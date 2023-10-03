import { useState, useEffect } from "react";
import { SpaceMember, Space } from "@ably/spaces";

const useMembers = (space?: Space) => {
  const [otherMembers, setOtherMembers] = useState<SpaceMember[]>([]);
  const [allMembers, setAllMembers] = useState<SpaceMember[]>([]);
  const [self, setSelf] = useState<SpaceMember | null>(null);

  useEffect(() => {
    if (!space) return;

    const setMembers = async () => {
      const others = await space.members.getOthers();
      setOtherMembers(others);
      const all = await space.members.getAll();
      setAllMembers(all);
      const s = await space.members.getSelf();
      setSelf(s);
    };

    /** 💡 Set initial data */
    setMembers();

    /** 💡 Listen to all events emitted for space members 💡 */
    space.members.subscribe(setMembers);

    return () => {
      /** 💡 Remove listener on unmount 💡 */
      space?.members.unsubscribe(setMembers);
    };
  }, [space]);

  return { self, otherMembers, allMembers };
};

export default useMembers;
