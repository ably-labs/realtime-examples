import React from "react";
import type { Space } from "@ably/spaces";

import { useLock } from "../hooks/useLock";
import { useLiveValue } from "../hooks/useLiveValue";
import { useSelf } from "../hooks/useSelf";

import InputCell from "./InputCell";

interface AblyPoweredInputProps {
  name: string;
  label: string;
  space: Space;
}

export const AblyPoweredInput: React.FC<AblyPoweredInputProps> = ({
  name,
  label,
  space,
}) => {
  const { lockHolder, status } = useLock(space, name);
  const self = useSelf(space);
  const [value, setValue] = useLiveValue(name, self);

  const locked = status === "locked";
  const lockedByYou = locked && lockHolder?.connectionId === self?.connectionId;

  const handleFocus = async () => {
    if (locked) return;

    try {
      await space.locks.acquire(name);
    } catch {
      // can't acquire the lock
    }
  };

  const handleClickOutside = () => {
    space?.locks.release(name);
  };

  return (
    <InputCell
      value={value}
      label={label}
      name={name}
      onFocus={handleFocus}
      onClickOutside={handleClickOutside}
      onChange={setValue}
      lockedByYou={lockedByYou}
      lockHolder={lockHolder}
    />
  );
};
