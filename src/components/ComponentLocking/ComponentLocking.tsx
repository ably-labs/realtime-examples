import { useEffect, useState } from "react";
import { useChannel } from "@ably-labs/react-hooks";
import { getLocationColors } from "../../commonUtils/mockColors";
import { getMemberName } from "../../commonUtils/mockNames";
import useSpaces from "../../commonUtils/useSpaces";
import Form from "./Form";

import { SpaceMember } from "@ably-labs/spaces";

const ComponentLocking = ({ spaceName }: { spaceName: string }) => {
  const [allMembers, setAllMembers] = useState<SpaceMember[]>([]);
  const [self, setSelf] = useState<SpaceMember[]>([]);
  const [memberColor, setMemberColor] = useState(getLocationColors);
  const [memberName, setMemberName] = useState(getMemberName);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({
    memberName,
    memberColor,
  });

  useEffect(() => {
    if (space && allMembers.length === 0) {
      const getAllMembersAndSelf = async () => {
        const all = await space.members.getAll();
        setAllMembers(all);
        const self = await space.members.getSelf();
        setSelf(self);
      };
      space.members.subscribe(() => getAllMembersAndSelf());
      space.locations.subscribe("update", () => {
        getAllMembersAndSelf();
      });

      return () => {
        /** 💡 Remove any listeners on unmount 💡 */
        space?.off();
      };
    }
  }, [space]); // Now the effect will react to changes in space

  return (
    <div
      className="w-full flex justify-center items-center rounded-2xl bg-white"
      id="member-location"
    >
      <div>
        <Form users={allMembers} space={space} self={self} />
      </div>
    </div>
  );
};
export default ComponentLocking;

// Lock cell if someone else is editing it
// Transmit the cell data to all members in the space
// Unlock the cell when the member leaves the space (but maintain the data)
