import { useState, useEffect } from "react";
import { SpaceMember, Space } from "@ably-labs/spaces";

const useSpaceMembers = (space: Space) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [self, setSelf] = useState<SpaceMember | undefined>(undefined);

  useEffect(() => {
    if (!space) return;

    /** 💡 Listen to space members entering and leaving 💡 */
    space.members.subscribe(() =>
      (async () => {
        const self = await space.members.getSelf();
        setSelf(self);
        const others = await space.members.getOthers();
        setMembers(others);
      })(),
    );

    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.off();
    };
  }, [space]);

  return { members, self };
};

export default useSpaceMembers;
