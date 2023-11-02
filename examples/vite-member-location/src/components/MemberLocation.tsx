import { useEffect, useMemo } from "react";
import { useLocations, useMembers, useSpace } from "@ably/spaces/react";

import { getMemberName } from "../utils/mockNames";
import { getLocationColors } from "../utils/mockColors";
import Spreadsheet from "./Spreadsheet";

import { type Member } from "../utils/types";

type UpdateLocationCallback = (location: Member["location"]) => void;

import styles from "./MemberLocation.module.css";

const MemberLocation = () => {
  const memberName = useMemo(getMemberName, []);
  const memberColor = useMemo(getLocationColors, []);

  /** 💡 Get a handle on a space instance 💡 */
  const { enter, space } = useSpace();

  const { self, others } = useMembers();

  const { update } = useLocations();

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    enter?.({ memberName, memberColor });
  }, [space]);


  return (
    <div
      id="member-location"
      className={`example-container ${styles.container}`}
    >
      <Spreadsheet
        self={self as Member}
        others={others as Member[]}
        setLocation={update as UpdateLocationCallback}
      />
    </div>
  );
};

export default MemberLocation;
