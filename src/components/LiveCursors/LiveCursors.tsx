import { useMemo, useRef } from "react";
import { mockNames } from "../../commonUtils/mockNames";
import { colours } from "./utils/mockData";
import useSpaces from "../../commonUtils/useSpaces";
import useSpaceMembers from "../../commonUtils/useSpaceMembers";
import { MemberCursors, YourCursor } from "./Cursors";

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

const LiveCursors = ({ spaceName }: { spaceName: string }) => {
  const name = useMemo(mockName, []);
  /** 💡 Select a color to assign randomly to a new user that enters the space💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    [],
  );

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({ name, userColors });
  const { self, otherMembers } = useSpaceMembers(space);

  const liveCursors = useRef(null);
  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className="w-full flex relative cursor-none overflow-hidden rounded-2xl bg-white"
    >
      <YourCursor user={self} space={space} parentRef={liveCursors} />
      <MemberCursors
        otherUsers={otherMembers}
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  );
};

export default LiveCursors;
