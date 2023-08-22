import { useEffect, useState } from "react";
import useSpaces from "../../commonUtils/useSpaces";
import { SpaceMember } from "@ably-labs/spaces";
import { getMemberName } from "../../commonUtils/mockNames";
import { getLocationColors } from "../../commonUtils/mockColors";
import Spreadsheet from "./Spreadsheet";

const MemberLocation = ({ spaceName }: { spaceName: string }) => {
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

  useEffect(() => {
    if (!space) return;

    /** 💡 "locationUpdate" is triggered every time
     * - a member changes the cell they have clicked
     * - or if a member leaves the space. 💡 */
    space.locations.subscribe("update", (locationUpdate) => {
      space.locations.getSelf().then((self) => {
        setSelf(self);
        const updatedMember = locationUpdate.member;

        if (updatedMember.isConnected) {
          // Add to the members array if the member is connected
          setMembers((prevMembers) => {
            return [
              ...prevMembers.filter(
                (member) => member.connectionId !== updatedMember.connectionId,
              ),
              updatedMember,
            ];
          });
        } else if (!updatedMember.isConnected) {
          // Remove from the members array if the member is not connected
          setMembers((prevMembers) =>
            prevMembers.filter(
              (member) => member.connectionId !== updatedMember.connectionId,
            ),
          );
        }
      });
    });

    return () => {
      /** 💡 Remove any listeners on unmount 💡 */
      space?.off();
    };
  }, [space]);

  return (
    <div
      className="w-full flex justify-center items-center rounded-2xl bg-white"
      id="member-location"
    >
      <Spreadsheet users={members} space={space} self={self} />
    </div>
  );
};

export default MemberLocation;
