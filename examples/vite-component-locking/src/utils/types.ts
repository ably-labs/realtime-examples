import { type SpaceMember } from "@ably/spaces";

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: { memberColor: string; memberName: string };
};
