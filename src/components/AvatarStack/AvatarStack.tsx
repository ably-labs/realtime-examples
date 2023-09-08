import { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Avatars from "./Avatars";
import { getMemberName } from "../../commonUtils/mockNames";
import { getMemberColor } from "../../commonUtils/mockColors";
import useSpaces from "../../commonUtils/useSpaces";

import useSpaceMembers from "./utils/useSpaceMembers";
import type { Member } from "./utils/helpers";

dayjs.extend(relativeTime);

const AvatarStack = () => {
  const name = useMemo(getMemberName, []);
  const memberColor = useMemo(getMemberColor, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({ name, memberColor });

  /** 💡 Get everybody except the local member in the space 💡 */
  const { otherMembers, self } = useSpaceMembers(space);

  return (
    <div
      className="w-full flex justify-center items-center relative rounded-2xl bg-[#F4F8FB]"
      id="avatar-stack"
    >
      {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
      <Avatars
        self={self as Member | null}
        otherUsers={otherMembers as Member[]}
      />
    </div>
  );
};

export default AvatarStack;
