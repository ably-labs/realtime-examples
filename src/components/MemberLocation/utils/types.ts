import { SpaceMember } from "@ably/spaces";

export interface CellProps {
  value: string | number;
  rowIndex: number;
  colIndex: number;
  cellMembers: SpaceMember[];
  isSelf: boolean;
  handleClick: (row: number, col: number) => void;
}
