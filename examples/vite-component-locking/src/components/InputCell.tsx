import React, { useCallback, useRef } from "react";
import cn from "classnames";
import { useOnClickOutside } from "usehooks-ts";
import { LockFilledSvg } from "./LockedFilled";
import { type Member } from "../utils/types";

import styles from "./InputCell.module.css";

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
    <div ref={ref} className={styles.container}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <div
        className={styles.inputContainer}
        style={{ "--member-bg-color": memberColor } as CSSPropertiesWithVars}
      >
        {memberName ? (
          <div className={styles.lock}>
            {memberName}
            {!lockedByYou && <LockFilledSvg className={styles.textBase} />}
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
          className={cn(styles.input, {
            [styles.regularCell]: !lockHolder,
            [styles.activeCell]: lockHolder,
            [styles.fullAccess]: !readOnly,
            [styles.readOnly]: readOnly,
          })}
        />
      </div>
    </div>
  );
};

export default InputCell;
