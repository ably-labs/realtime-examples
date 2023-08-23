import { Space, SpaceMember } from "@ably-labs/spaces";

export interface InputCellProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cellMembers: SpaceMember[];
  isSelf: boolean;
}

export interface FormComponentProps {
  users: SpaceMember[];
  self: SpaceMember.location;
  space?: Space;
}

export interface FormData {
  entry1: string;
  entry2: string;
  entry3: string;
}
