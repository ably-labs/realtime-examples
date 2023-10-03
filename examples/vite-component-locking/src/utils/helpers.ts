import { generate } from "random-words";

import type { Member } from "./types";

export const getCellStylesForMember = (cellMember: Member | null): string => {
  if (cellMember) {
    const memberColor = `${cellMember?.profileData?.memberColor}`;
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
