import React from "react";
import "./location.css";
import { getMemberProperty, getCellStyles } from "./utils/helper";
import { type CellProps } from "./utils/types";

const Cell: React.FC<CellProps> = ({
  value,
  rowIndex,
  colIndex,
  cellMembers,
  isSelf,
  handleClick,
}) => {
  // 💡 Get the member color and name for the cell from the `cellMembers` prop.
  const memberColor = getMemberProperty(cellMembers, "memberColor");
  const memberName = isSelf
    ? "You"
    : getMemberProperty(cellMembers, "memberName");
  const additionalCellMembers = cellMembers.length - 1;
  const cellLabel =
    additionalCellMembers > 0
      ? `${memberName} + ${additionalCellMembers}`
      : memberName;

  const handleCellClick = () => {
    handleClick(rowIndex, colIndex);
  };

  return (
    <td
      key={`${rowIndex}-${colIndex}`}
      className={`w-[45%] px-2 py-2 h-10 relative  hover:bg-slate-50 member-name-tab ${getCellStyles(
        cellMembers,
      )}`}
      onClick={handleCellClick}
      data-name-content={memberName ? cellLabel : ""}
      style={{ "--info-bg-color": memberColor } as React.CSSProperties}
    >
      {value}
    </td>
  );
};

export default Cell;
