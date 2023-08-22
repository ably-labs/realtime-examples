import { useEffect, useMemo, useRef, useState } from "react";
import { mockNames } from "../../commonUtils/mockNames";
import { colours } from "./utils/mockData";
import useSpaces from "../../commonUtils/useSpaces";
import { MemberCursors, YourCursor } from "./Cursors";
import { SpaceMember } from "@ably-labs/spaces";

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

const LiveCursors = ({ spaceName }: { spaceName: string }) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const name = useMemo(mockName, []);
  /** 💡 Select a color to assign randomly to a new user that enters the space💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    [],
  );
  const [self, setSelf] = useState<SpaceMember | undefined>(undefined);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces(spaceName, { name, userColors });

  useEffect(() => {
    if (!space) return;
    /** 💡 Listen to space members entering and leaving 💡 */
    space.members.subscribe("update", () =>
      (async (memberUpdate) => {
        const self = await space.members.getSelf();
        setSelf(self);
        const others = await space.members.getOthers();
        setMembers(others);
      })(),
    );
    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.unsubscribe();
    };
  }, [space]);
  const liveCursors = useRef(null);
  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className="w-full flex relative cursor-none overflow-hidden rounded-2xl bg-white"
    >
      <YourCursor user={self} space={space} parentRef={liveCursors} />
      <MemberCursors
        otherUsers={members}
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  );
};

export default LiveCursors;
