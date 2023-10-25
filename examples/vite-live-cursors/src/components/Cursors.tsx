import React, { useState } from "react";
import { useCursors } from "@ably/spaces/react";

import type { CursorUpdate as _CursorUpdate } from "@ably/spaces";
import CursorSvg from "./CursorSvg";
import useTrackCursor from "../hooks/useTrackCursor";
import { Member } from "../utils/types";

// 💡 This component is used to render the cursor of the user
const YourCursor = ({
  self,
  parentRef,
}: {
  self: Member | null;
  parentRef: React.RefObject<HTMLDivElement>;
}) => {
  const [cursorPosition, setCursorPosition] = useState<{
    left: number;
    top: number;
    state: string;
  }>({ left: 0, top: 0, state: "move" });
  const handleSelfCursorMove = useTrackCursor(setCursorPosition, parentRef);
  if (!self) {
    return null;
  }
  if (cursorPosition.state === "leave") return null;
  const { cursorColor, nameColor } = self.profileData.userColors;

  return (
    <div
      className="absolute"
      onMouseMove={(e) => handleSelfCursorMove(e)}
      style={{
        top: `${cursorPosition.top}px`,
        left: `${cursorPosition.left}px`,
      }}
    >
      <CursorSvg cursorColor={cursorColor} />
      <div
        className={`px-4 py-2 m-2 ${nameColor} rounded-full text-sm text-white whitespace-nowrap`}
      >
        You
      </div>
    </div>
  );
};

type CursorUpdate = Omit<_CursorUpdate, "data"> & {
  data: { state: "move" | "leave" };
};

// 💡 This component is used to render the cursors of other users in the space
const MemberCursors = () => {
  const { cursors } = useCursors({ returnCursors: true });

  return (
    <>
      {Object.values(cursors).map((data) => {
        const cursorUpdate = data.cursorUpdate as CursorUpdate;
        const member = data.member as Member;
        if (cursorUpdate.data.state === "leave") return;
        const { cursorColor, nameColor } = member.profileData.userColors;
        return (
          <div
            key={member.connectionId}
            id={`member-cursor-${member.connectionId}`}
            className="absolute"
            style={{
              left: `${cursorUpdate.position.x}px`,
              top: `${cursorUpdate.position.y}px`,
            }}
          >
            <CursorSvg cursorColor={cursorColor} />
            <div
              className={`px-4 py-2 m-2 ${nameColor} rounded-full text-sm text-white whitespace-nowrap member-cursor`}
            >
              {member.profileData.name}
            </div>
          </div>
        );
      })}
    </>
  );
};

export { MemberCursors, YourCursor };
