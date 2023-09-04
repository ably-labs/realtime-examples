import { SpaceMember } from "@ably/spaces";

type MemberProperty = "memberColor" | "memberName";

export const getMemberProperty = (
  cellMembers: SpaceMember[],
  property: MemberProperty,
): string | null => {
  if (cellMembers.length > 0 && property in cellMembers[0].profileData) {
    return cellMembers[0].profileData[property];
  }
  return null;
};

export const getCellStyles = (cellMembers: SpaceMember[]): string => {
  if (cellMembers.length > 0) {
    const memberColor = `${cellMembers[0].profileData.memberColor}`;
    return `border-[${memberColor}] border-2`;
  }
  return "bg-white border-[0.25px] border-gray-350 hover:border-gray-325";
};
