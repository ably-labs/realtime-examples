import React, { useCallback, useRef } from "react";
import cn from "classnames";
import { useOnClickOutside } from "usehooks-ts";
import { getCellStylesForMember } from "../utils/helpers";
import { LockFilledSvg } from "./LockedFilled";
import { type Member } from "../utils/types";

interface InputCellProps {
  value: string;
  label: string;
  name: string;
  onFocus: () => void;
  onChange: (nextValue: string) => void;
  onClickOutside: () => void;
  lockHolder: Member | null;
  lockedByYou: boolean;
}

interface CSSPropertiesWithVars extends React.CSSProperties {
  "--member-bg-color": string;
}

const InputCell: React.FC<InputCellProps> = ({
  value,
  label,
  name,
  onFocus,
  onClickOutside,
  onChange,
  lockHolder,
  lockedByYou,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // 💡 Get the member color and name for the cell from the `cellMembers` prop. 💡 
  const memberColor = lockHolder?.profileData.memberColor;
  const memberName = lockedByYou ? "You" : lockHolder?.profileData.memberName;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  // 💡  Unlock the component on click outside 💡 
  useOnClickOutside(ref, onClickOutside);

  // 💡  Determine if the input cell should be read-only 💡 
  const readOnly = Boolean(lockHolder && !lockedByYou);

  return (
    <div ref={ref} className="flex flex-col mb-4 w-full">
      <label htmlFor={name} className="mb-2 text-sm">
        {label}
      </label>
      <div
        className="relative"
        style={{ "--member-bg-color": memberColor } as CSSPropertiesWithVars}
      >
        {memberName ? (
          <div className="member-name-lock">
            {memberName}
            {!lockedByYou && <LockFilledSvg className="text-base" />}
          </div>
        ) : null}
        <input
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={onFocus}
          disabled={readOnly}
          placeholder="Click to lock and edit me"
          className={cn(
            `p-2 w-full h-10 text-sm rounded-lg outline-none transition-colors hover:bg-white focus:bg-white ${getCellStylesForMember(
              lockHolder,
            )}`,
            {
              "bg-[#EDF1F6]": !readOnly,
              "bg-slate-250 hover:bg-slate-250 cursor-not-allowed": readOnly,
            },
          )}
        />
      </div>
    </div>
  );
};

export default InputCell;
