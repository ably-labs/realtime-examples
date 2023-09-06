import { useEffect, useState } from "react";
import useSpaces from "../../commonUtils/useSpaces";
import { getMemberName } from "../../commonUtils/mockNames";
import { getLocationColors } from "../../commonUtils/mockColors";
import Spreadsheet from "./Spreadsheet";
import { type Member } from "./utils/types";

const MemberLocation = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selfLocation, setSelfLocation] = useState<
    Member["location"] | undefined
  >(undefined);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({
    memberName: getMemberName(),
    memberColor: getLocationColors(),
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
          setMembers(others as Member[]);
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
    space.locations.subscribe("update", (locationUpdate) => {
      space.locations.getSelf().then((member) => {
        setSelfLocation(member as Member["location"]);
        const updatedMember = locationUpdate.member;
        if (updatedMember.isConnected) {
          // Add to the members array if the member is connected
          setMembers((prevMembers) => {
            return [
              ...prevMembers.filter(
                (member) => member.connectionId !== updatedMember.connectionId,
              ),
              updatedMember as Member,
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
      <Spreadsheet users={members} space={space} selfLocation={selfLocation} />
    </div>
  );
};

export default MemberLocation;
