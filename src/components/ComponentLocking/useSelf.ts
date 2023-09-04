import type { Space, SpaceMember } from "@ably/spaces";
import { useEffect, useState } from "react";

export const useSelf = (space: Space) => {
  const [self, setSelf] = useState<SpaceMember | null>(null);

  useEffect(() => {
    const handler = async () => {
      const self = await space.members.getSelf();
      setSelf(self);
    };

    space.subscribe("update", handler);
    return () => {
      space.unsubscribe("update", handler);
    };
  }, [space]);

  useEffect(() => {
    const init = async () => {
      const initSelf = await space.members.getSelf();
      setSelf(initSelf);
    };

    init();
  }, []);

  return self;
};
