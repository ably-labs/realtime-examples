import { useEffect, useMemo, useState } from "react";
import Avatars from "./Avatars";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { mockNames } from "../../commonUtils/mockNames";
import { avatarColors } from "./utils/mockData";
import useSpaces from "../../commonUtils/useSpaces";
import { SpaceMember } from "@ably-labs/spaces";

dayjs.extend(relativeTime);

/** 💡 Select a mock name to assign randomly to a new user that enters the space💡 */
const mockName = () => mockNames[Math.floor(Math.random() * mockNames.length)];
const avatarColor = () =>
  avatarColors[Math.floor(Math.random() * avatarColors.length)];

const AvatarStack = ({ spaceName }: { spaceName: string }) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const name = useMemo(mockName, []);
  const memberColor = useMemo(avatarColor, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces(spaceName, { name, memberColor });

  useEffect(() => {
    if (!space) return;

    /** 💡 Listen to space members entering and leaving 💡 */
    space.on("membersUpdate", (members: SpaceMember[]) => {
      const self = space.getSelf();
      const others = members.filter(
        (member) => member.connectionId !== self?.connectionId,
      );
      setMembers(others);
    });

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
