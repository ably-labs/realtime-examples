import { useEffect, useState } from "react";
import { getLocationColors } from "../../commonUtils/mockColors";
import { getMemberName } from "../../commonUtils/mockNames";
import useSpaces from "../../commonUtils/useSpaces";
import { SpaceMember } from "@ably-labs/spaces";
import Form from "./Form";

const ComponentLocking = ({ spaceName }: { spaceName: string }) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [self, setSelf] = useState<SpaceMember["location"] | undefined>(
    undefined,
  );
  const [memberColor, setMemberColor] = useState(getLocationColors);
  const [memberName, setMemberName] = useState(getMemberName);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces(spaceName, {
    memberName,
    memberColor,
  });

  /** 💡 Get a list of everyone already in the space. 
			The locationUpdate will then be used to update the members list 
			as shown in the useEffect after this one.
			You could just use space.members.subscribe to do this as well.💡 */
  useEffect(() => {
    if (space && members.length === 0) {
      space.members.subscribe(() =>
        (async () => {
          const others = await space.members.getOthers();
          setMembers(others);
        })(),
      );

      return () => {
        /** 💡 Remove any listeners on unmount 💡 */
        space?.off();
      };
    }
  }, [space, members]); // Now the effect will react to changes in space and members

  return (
    <div
      className="w-full flex justify-center items-center rounded-2xl bg-white"
      id="member-location"
    >
      <div>
        <Form users={members} space={space} self={self} />
      </div>
    </div>
  );
};
export default ComponentLocking;
