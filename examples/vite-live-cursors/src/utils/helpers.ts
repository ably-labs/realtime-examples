import { generate } from "random-words";

export const colours = [
  { nameColor: "bg-orange-700", cursorColor: "#FE372B" },
  { nameColor: "bg-pink-700", cursorColor: "#9C007E" },
  { nameColor: "bg-green-700", cursorColor: "#008E06" },
  { nameColor: "bg-purple-700", cursorColor: "#460894" },
  { nameColor: "bg-blue-700", cursorColor: "#0284CD" },
  { nameColor: "bg-yellow-700", cursorColor: "#AC8600" },
  { nameColor: "bg-orange-500", cursorColor: "#FF723F" },
  { nameColor: "bg-pink-500", cursorColor: "#FF17D2" },
  { nameColor: "bg-green-500", cursorColor: "#00E80B" },
  { nameColor: "bg-purple-500", cursorColor: "#7A1BF2" },
  { nameColor: "bg-blue-500", cursorColor: "#2CC0FF" },
  { nameColor: "bg-yellow-500", cursorColor: "#FFC700" },
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
