import { useMemo, useRef, useEffect } from "react";
import { useMembers, useSpace } from "@ably/spaces/react";
import { mockNames } from "../utils/mockNames";
import { colours } from "../utils/helpers";
import { MemberCursors, YourCursor } from "./Cursors";

import type { Member } from "../utils/types";

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
  const { enter } = useSpace();

  useEffect(() => {
    enter?.({ name, userColors });
  }, [enter]);

  const { self } = useMembers();

  const liveCursors = useRef(null);

  return (
    <div
      id="live-cursors"
      ref={liveCursors}
      className="live-cursors-container example-container"
    >
      <YourCursor self={self as Member | null} parentRef={liveCursors} />
      <MemberCursors />
    </div>
  );
};

export default LiveCursors;
