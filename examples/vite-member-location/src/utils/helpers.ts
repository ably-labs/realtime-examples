import { generate } from "random-words";

import type { Member, MemberProperty } from "./types";

export const getMemberProperty = (
  cellMembers: Member[],
  property: MemberProperty,
): string | null => {
  if (cellMembers.length > 0 && property in cellMembers[0].profileData) {
    return cellMembers[0].profileData[property];
  }
  return null;
};

export const getCellStyles = (
  self: Member | null,
  selfInCell: boolean,
  cellMembers: Member[],
): string => {
  if (selfInCell) {
    return `border-[${self?.profileData.memberColor}] border-2`;
  }

  if (cellMembers.length > 0) {
    const memberColor = `${cellMembers[0].profileData.memberColor}`;
    return `border-[${memberColor}] border-2`;
  }
  return "bg-white border-[0.25px] border-gray-350 hover:border-gray-325";
};

export const getSpaceNameFromUrl = () => {
  const url = new URL(window.location.href);
  const spaceNameInParams = url.searchParams.get("space");

  if (spaceNameInParams) {
    return spaceNameInParams;
  } else {
    const generatedName = generate({ exactly: 3, join: "-" });
    url.searchParams.set("space", generatedName);
    window.history.replaceState({}, "", `?${url.searchParams.toString()}`);
    return generatedName;
  }
};