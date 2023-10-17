import { useMemo } from "react";
import { useEffect } from "react";
import { useSpace, useMembers } from "@ably/spaces/react";

import Avatars from "./Avatars";
import { getMemberName } from "../utils/mockNames";
import { getMemberColor } from "../utils/mockColors";

import type { Member } from "../utils/helpers";

import styles from "./AvatarStack.module.css";

const AvatarStack = () => {
  const name = useMemo(getMemberName, []);
  const memberColor = useMemo(getMemberColor, []);

  /** 💡 Get a handle on a space instance 💡 */
  const { space } = useSpace();

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({ name, memberColor });
  }, [space]);

  /** 💡 Get everybody except the local member in the space and the local member 💡 */
  const { others, self } = useMembers();

  return (
    <div id="avatar-stack" className={`example-container ${styles.container}`}>
      {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
      <Avatars self={self as Member | null} otherUsers={others as Member[]} />
    </div>
  );
};

export default AvatarStack;
