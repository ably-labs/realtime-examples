import { Space, SpaceMember } from "@ably-labs/spaces";

export interface InputCellProps {
  label: string;
  name: string;
  type: string;
  handleFocus: (inputId: string) => void;
  cellMembers: SpaceMember[];
  self: SpaceMember;
  isSelf: boolean;
}

export interface FormComponentProps {
  users: SpaceMember[];
  self: SpaceMember.location;
  space?: Space;
}
