import { useCallback, useEffect, useMemo, useState } from "react";
import useSpaces from "../../commonUtils/useSpaces";
import { getMemberName } from "../../commonUtils/mockNames";
import { getLocationColors } from "../../commonUtils/mockColors";
import Spreadsheet from "./Spreadsheet";
import { type Member } from "./utils/types";
import { type SpaceMember } from "@ably/spaces";

const MemberLocation = () => {
  const [others, setOthers] = useState<Member[]>([]);
  const [self, setSelf] = useState<Member | null>(null);

  const memberName = useMemo(getMemberName, []);
  const memberColor = useMemo(getLocationColors, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({
    memberName,
    memberColor,
  });

  const setConnectedMembers = (members: SpaceMember[]) => {
    setOthers(members.filter((member) => member.isConnected) as Member[]);
  };

  /** 💡 Get a list of everyone already in the space. 
      The locationUpdate will then be used to update the members list 
      as shown in the useEffect after this one.
      You could just use space.members.subscribe to do this as well.💡 */
  useEffect(() => {
    if (!space) return;

    (async () => {
      setConnectedMembers(await space.members.getOthers());
      setSelf((await space.members.getSelf()) as Member);
    })();

    const handler = async () => {
      setConnectedMembers(await space.members.getOthers());
      setSelf((await space.members.getSelf()) as Member);
    };

    space.members.subscribe(["enter", "leave", "remove"], handler);

    return () => {
      space.members.unsubscribe(["enter", "leave", "remove"], handler);
    };
  }, [space]);

  useEffect(() => {
    if (!space) return;

    /** 💡 "locationUpdate" is triggered every time
     * - a member changes the cell they have clicked
     * - or if a member leaves the space.💡 */
    const handler = async (locationUpdate: { member: SpaceMember }) => {
      if (self?.connectionId === locationUpdate.member.connectionId) {
        const updatedSelf = await space.members.getSelf();
        setSelf(updatedSelf as Member);
      } else {
        const others = await space.members.getOthers();
        setConnectedMembers(others);
      }
    };

    space.locations.subscribe("update", handler);

    return () => {
      /** 💡 Remove listener on unmount 💡 */
      space.locations.unsubscribe("update", handler);
    };
  }, [space, self?.connectionId]);

  const setLocation = (location: Member["location"]) => {
    space?.locations.set(location);
  };

  return (
    <div
      className="w-full flex justify-center items-center rounded-2xl bg-[#F4F8FB]"
      id="member-location"
    >
      <Spreadsheet self={self} others={others} setLocation={setLocation} />
    </div>
  );
};

export default MemberLocation;
