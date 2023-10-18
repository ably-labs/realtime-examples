import React from "react";
import { getMemberProperty } from "../utils/helpers";
import { type Member } from "../utils/types";

import styles from "./Cell.module.css";
import classNames from "classnames";

interface CellProps {
  value: string | number;
  rowIndex: number;
  colIndex: number;
  cellMembers: Member[];
  self: Member | null;
  handleClick: (row: number, col: number) => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  rowIndex,
  colIndex,
  cellMembers,
  self,
  handleClick,
}) => {
  const selfInCell =
    self?.location?.row === rowIndex && self?.location?.col === colIndex;

  // 💡 Get the member color and name for the cell from the `cellMembers` prop.
  const labelColor = selfInCell
    ? self.profileData.memberColor
    : getMemberProperty(cellMembers, "memberColor");
  const memberName = selfInCell
    ? "You"
    : getMemberProperty(cellMembers, "memberName");
  const additionalCellMembers = cellMembers.length + (selfInCell ? 0 : -1);
  const cellLabel =
    additionalCellMembers > 0
      ? `${memberName} + ${additionalCellMembers}`
      : memberName;

  const handleCellClick = () => handleClick(rowIndex, colIndex);

  return (
    <td
      key={`${rowIndex}-${colIndex}`}
      style={
        {
          "--info-bg-color": labelColor,
          "--member-color": self?.profileData.memberColor,
          "--cell-member-color": cellMembers[0]?.profileData.memberColor,
          backgroundColor: selfInCell ? "white" : "#EDF1F6",
        } as React.CSSProperties
      }
      className={classNames(styles.cell, {
        [styles.cellMembers]: cellMembers.length > 0 && !selfInCell,
        [styles.rest]: !selfInCell && cellMembers.length === 0,
        [styles.cellSelf]: selfInCell,
      })}
      onClick={handleCellClick}
      data-name-content={memberName ? cellLabel : ""}
    >
      {value}
    </td>
  );
};

export default Cell;
