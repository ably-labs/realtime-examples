import { useEffect, useState } from "react";
import useSpaces from "../../commonUtils/useSpaces";
import { SpaceMember } from "@ably/spaces";
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
  const space = useSpaces({
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

  useEffect(() => {
    if (!space) return;

    /** 💡 "locationUpdate" is triggered every time
     * - a member changes the cell they have clicked
     * - or if a member leaves the space.💡 */
    space.locations.subscribe(
      "update",
      (locationUpdate: { member: SpaceMember }) => {
        space.locations.getSelf().then((self: any) => {
          setSelf(self);
          const updatedMember = locationUpdate.member;
          if (updatedMember.isConnected) {
            // Add to the members array if the member is connected
            setMembers((prevMembers) => {
              return [
                ...prevMembers.filter(
                  (member) =>
                    member.connectionId !== updatedMember.connectionId,
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
      },
    );

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
