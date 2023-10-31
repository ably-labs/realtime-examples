import { generate } from "random-words";

export const colours = [
  { cursorColor: "#FE372B" },
  { cursorColor: "#9C007E" },
  { cursorColor: "#008E06" },
  { cursorColor: "#460894" },
  { cursorColor: "#0284CD" },
  { cursorColor: "#AC8600" },
  { cursorColor: "#FF723F" },
  { cursorColor: "#FF17D2" },
  { cursorColor: "#00E80B" },
  { cursorColor: "#7A1BF2" },
  { cursorColor: "#2CC0FF" },
  { cursorColor: "#FFC700" },
];

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
