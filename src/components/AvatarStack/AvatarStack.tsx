import { useEffect, useState } from "react";
import Avatars from "./Avatars";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getMemberName } from "../../commonUtils/mockNames";
import { getMemberColor } from "../../commonUtils/mockColors";
import useSpaces from "../../commonUtils/useSpaces";
import { SpaceMember } from "@ably-labs/spaces";

dayjs.extend(relativeTime);

const AvatarStack = ({ spaceName }: { spaceName: string }) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [name, setName] = useState(getMemberName);
  const [memberColor, setMemberColor] = useState(getMemberColor);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({ name, memberColor });

  useEffect(() => {
    if (!space) return;

    /** 💡 Listen to space members entering and leaving 💡 */
    space.members.subscribe(() =>
      (async () => {
        console.log(members);
        const others = await space.members.getOthers();
        setMembers(others);
      })(),
    );

    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.off();
    };
  }, [space]);

  return (
    <div
      className="w-full flex justify-center relative rounded-2xl bg-white"
      id="avatar-stack"
    >
      <div className="flex items-center">
        {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
        <Avatars otherUsers={members} />
      </div>
    </div>
  );
};
export default AvatarStack;
