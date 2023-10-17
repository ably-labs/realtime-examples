export const colors = [
  "#9951F5",
  "#7A1BF2",
  "#5F0BC9",
  "#460894",
  "#00E80B",
  "#00C008",
  "#008E06",
  "#FF17D2",
  "#D400AB",
  "#9C007E",
  "#2CC0FF",
  "#00A5EC",
  "#0284CD",
  "#E4B200",
  "#AC8600",
];

export const getMemberColor = () =>
  colors[Math.floor(Math.random() * colors.length)];
