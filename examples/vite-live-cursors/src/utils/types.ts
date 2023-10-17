import type { SpaceMember } from "@ably/spaces";

export type Member = Omit<SpaceMember, "profileData"> & {
  profileData: {
    name: string;
    userColors: {
      cursorColor: string;
    };
  };
};
