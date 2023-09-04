import React, { useCallback } from "react";
import type { SpaceMember } from "@ably/spaces";
import cn from "classnames";
import { getCellStylesForMember } from "./utils/helper";
import { LockFilledSvg } from "./LockedFilled";
import "./locking.css";

interface InputCellProps {
  value: string;
  label: string;
  name: string;
  onFocus: () => void;
  onChange: (nextValue: string) => void;
  onBlur: () => void;
  lockHolder: SpaceMember | null;
  lockedByYou: boolean;
}
const InputCell: React.FC<InputCellProps> = ({
  value,
  label,
  name,
  onFocus,
  onBlur,
  onChange,
  lockHolder,
  lockedByYou,
}) => {
  // 💡 Get the member color and name for the cell from the `cellMembers` prop.
  const memberColor = lockHolder?.profileData?.memberColor;
  const memberName = lockedByYou
    ? "You"
    : `${lockHolder?.profileData?.memberName}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  // Determine if the input cell should be read-only
  const readOnly = Boolean(lockHolder && !lockedByYou);

  return (
    <div className="input-wrapper flex flex-col mb-4">
      <label htmlFor={name} className="mb-2 text-sm">
        {label}
      </label>
      <div
        className="relative"
        style={{ "--member-bg-color": memberColor } as React.CSSProperties}
      >
        {memberName && (
          <div className="member-name-lock">
            {memberName}
            {!lockedByYou && <LockFilledSvg className="text-base" />}
          </div>
        )}
        <input
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={readOnly}
          placeholder="Edit to lock me"
          className={cn(
            `p-2 w-96 h-10 text-sm rounded-lg outline-none focus:bg-white ${getCellStylesForMember(
              lockHolder,
            )}`,
            {
              "bg-slate-50": !readOnly,
              "bg-slate-250 cursor-not-allowed": readOnly,
            },
          )}
        />
      </div>
    </div>
  );
};

export default InputCell;
