import { type Space } from "@ably/spaces";
import { useEffect, useState } from "react";

import { type Member } from "../utils/types";

export const useSelf = (space: Space) => {
  const [self, setSelf] = useState<Member | null>(null);

  useEffect(() => {
    if (!space) return;

    const handler = async () => {
      const self = await space.members.getSelf();
      setSelf(self as Member);
    };
     /** 💡 Set initial data */
    handler();
    
    /** 💡 Listen to all events emitted in the space 💡 */
    space.subscribe("update", handler);

    return () => {
      /** 💡 Remove listener on unmount 💡 */
      space?.unsubscribe("update", handler);
    };
  }, [space]);


  return self;
};
