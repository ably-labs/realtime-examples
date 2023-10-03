import { type SpaceMember } from "@ably/spaces";

export type MemberProperty = "memberColor" | "memberName";

export type Member = Omit<SpaceMember, "profileData" | "location"> & {
  profileData: {
    memberName: string;
    memberColor: string;
  };
  location: {
    row?: number;
    col?: number;
  };
};
