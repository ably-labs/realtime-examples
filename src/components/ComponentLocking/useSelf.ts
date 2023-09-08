import { type Space } from "@ably/spaces";
import { useEffect, useState } from "react";

import { type Member } from "./utils/helper";

export const useSelf = (space: Space) => {
  const [self, setSelf] = useState<Member | null>(null);

  useEffect(() => {
    const handler = async () => {
      const self = await space.members.getSelf();
      setSelf(self as Member);
    };

    space.subscribe("update", handler);
    return () => {
      space.unsubscribe("update", handler);
    };
  }, [space]);

  useEffect(() => {
    const init = async () => {
      const initSelf = await space.members.getSelf();
      setSelf(initSelf as Member);
    };

    init();
  }, []);

  return self;
};
