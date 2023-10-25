import React from "react";
import { useLock, useMembers } from "@ably/spaces/react";

import { useLiveValue } from "../hooks/useLiveValue";
import InputCell from "./InputCell";
import { Member } from "../utils/types";

interface AblyPoweredInputProps {
  name: string;
  label: string;
}

export const AblyPoweredInput: React.FC<AblyPoweredInputProps> = ({
  name,
  label,
}) => {
  const { member, status } = useLock(name);
  const { space, self } = useMembers();
  const [value, setValue] = useLiveValue(name, self as Member);
  const lockHolder = member as Member;

  const locked = status === "locked";
  const lockedByYou = locked && lockHolder?.connectionId === self?.connectionId;

  const handleFocus = async () => {
    if (locked) return;

    try {
      await space?.locks.acquire(name);
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
