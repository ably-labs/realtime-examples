import React, { useCallback, useState } from "react";
import type { Space } from "@ably/spaces";

import { useLock } from "./useLock";
import { useLiveValue } from "./useLiveValue";
import InputCell from "./InputCell";
import { useSelf } from "./useSelf";

interface AblyPoweredInputProps {
  name: string;
  label: string;
  space: Space;
  spaceName: string;
}

export const AblyPoweredInput: React.FC<AblyPoweredInputProps> = ({
  name,
  label,
  space,
  spaceName,
}) => {
  const { lockHolder } = useLock(space, name);
  const self = useSelf(space);
  const [value, setValue] = useLiveValue(spaceName, name, self);

  // region Workaround to react on local lock release
  const [unlocked, setUnlocked] = useState(false);
  const unlockedLocally =
    lockHolder && lockHolder?.connectionId === self?.connectionId && unlocked;
  // endregion

  const locked = Boolean(lockHolder) && !unlockedLocally;
  const lockedByYou = locked && lockHolder?.connectionId === self?.connectionId;

  const handleFocus = useCallback(async () => {
    if (locked) return;

    // region Workaround to react on local lock release
    setUnlocked(false);
    // endregion

    try {
      await space.locks.acquire(name);
    } catch {
      // can't acquire the lock
    }
  }, [locked, space, name]);

  const handleClickOutside = useCallback(() => {
    space.locks.release(name);
    // region Workaround to react on local lock release
    setUnlocked(true);
    // endregion
  }, [space, name]);

  return (
    <InputCell
      value={value}
      label={label}
      name={name}
      onFocus={handleFocus}
      onClickOutside={handleClickOutside}
      onChange={setValue}
      lockedByYou={lockedByYou}
      // region Workaround to react on local lock release
      lockHolder={unlockedLocally ? null : lockHolder}
      // endregion
    />
  );
};
