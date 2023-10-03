import { useContext, useEffect, useMemo, useState } from "react";
import { type SpaceMember } from "@ably/spaces";

import { getMemberName } from "../utils/mockNames";
import { getLocationColors } from "../utils/mockColors";
import Spreadsheet from "./Spreadsheet";
import { SpacesContext } from "./SpacesContext";

import { type Member } from "../utils/types";

const MemberLocation = () => {
  const [others, setOthers] = useState<Member[]>([]);
  const [self, setSelf] = useState<Member | null>(null);

  const memberName = useMemo(getMemberName, []);
  const memberColor = useMemo(getLocationColors, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({ memberName, memberColor });
  }, [space]);

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
      className="member-location-container example-container"
      id="member-location"
    >
      <Spreadsheet self={self} others={others} setLocation={setLocation} />
    </div>
  );
};

export default MemberLocation;
