import React, { useCallback } from "react";
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

  const locked = Boolean(lockHolder);
  const lockedByYou = locked && lockHolder?.connectionId === self?.connectionId;

  const handleFocus = useCallback(async () => {
    if (locked) return;
    try {
      await space.locks.acquire(name);
    } catch {
      // can't acquire the lock
    }
  }, [locked, space, name]);

  const handleBlur = useCallback(() => {
    space.locks.release(name);
  }, [space, name]);

  return (
    <InputCell
      value={value}
      label={label}
      name={name}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={setValue}
      lockedByYou={lockedByYou}
      lockHolder={lockHolder}
    />
  );
};
