import { SpaceMember } from "@ably-labs/spaces";
import Space from "@ably-labs/spaces/dist/mjs/Space";

export interface CellProps {
  value: string | number;
  rowIndex: number;
  colIndex: number;
  cellMembers: SpaceMember[];
  isSelf: boolean;
  handleClick: (row: number, col: number) => void;
}
