import { type SpaceMember } from "@ably/spaces";

export interface CellProps {
  value: string | number;
  rowIndex: number;
  colIndex: number;
  cellMembers: Member[];
  isSelf?: boolean;
  handleClick: (row: number, col: number) => void;
}

export type Member = Omit<SpaceMember, "profileData" | "location"> & {
  profileData: {
    memberName: string;
    memberColor: string;
  };
  location: {
    row?: number;
    col?: number;
  };
};
