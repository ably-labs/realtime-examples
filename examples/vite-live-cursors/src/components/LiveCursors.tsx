import { useMemo, useRef, useEffect, useContext } from "react";
import { mockNames } from "../utils/mockNames";
import { colours } from "../utils/helpers";
import useSpaceMembers from "../hooks/useMembers";
import { MemberCursors, YourCursor } from "./Cursors";
import { SpacesContext } from "./SpacesContext";

import type { Member } from "../utils/types";
import type { SpaceMember } from "@ably/spaces";

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

const LiveCursors = () => {
  const name = useMemo(mockName, []);
  /** 💡 Select a color to assign randomly to a new user that enters the space💡 */
  const userColors = useMemo(
    () => colours[Math.floor(Math.random() * colours.length)],
    [],
  );

  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  useEffect(() => {
    space?.enter({ name, userColors });
  }, [space]);

  const { self, otherMembers } = useSpaceMembers(space);

  const liveCursors = useRef(null);

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className="live-cursors-container example-container"
    >
      <YourCursor
        self={self as Member | null}
        space={space}
        parentRef={liveCursors}
      />
      <MemberCursors
        otherUsers={
          otherMembers.filter((m: SpaceMember) => m.isConnected) as Member[]
        }
        space={space}
        selfConnectionId={self?.connectionId}
      />
    </div>
  );
};

export default LiveCursors;
