import React from "react";
import "./location.css";
import { getMemberProperty, getCellStyles } from "./utils/helper";
import { type Member } from "./utils/types";

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
  const borderClasses = getCellStyles(self, selfInCell, cellMembers);
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
      className={`w-[45%] px-2 py-2 h-10 relative cursor-pointer hover:bg-slate-50 member-name-tab ${borderClasses} ${
        selfInCell ? "bg-white" : "bg-[#EDF1F6]"
      }`}
      onClick={handleCellClick}
      data-name-content={memberName ? cellLabel : ""}
      style={{ "--info-bg-color": labelColor } as React.CSSProperties}
    >
      {value}
    </td>
  );
};

export default Cell;
