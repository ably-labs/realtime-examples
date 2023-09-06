import { SpaceMember } from "@ably/spaces";
export const REMOVE_USER_AFTER_MILLIS = 120_000;
export const MAX_USERS_BEFORE_LIST = 4;
export const HORIZONTAL_SPACING_OFFSET = 40;
export const OVERLAP_AMOUNT = 40;
export const AVATAR_WIDTH = 48;

interface CalculateRightOffsetArgs {
  users: SpaceMember[];
  index?: number;
}

export function calculateRightOffset({
  users,
  index = 0,
}: CalculateRightOffsetArgs): number {
  const HORIZONTAL_SPACING_OFFSET = 40;
  return users.length > MAX_USERS_BEFORE_LIST
    ? (index + 1) * HORIZONTAL_SPACING_OFFSET
    : index * HORIZONTAL_SPACING_OFFSET;
}

export function calculateTotalWidth({
  users,
}: CalculateRightOffsetArgs): number {
  return AVATAR_WIDTH + OVERLAP_AMOUNT * users.length;
}
