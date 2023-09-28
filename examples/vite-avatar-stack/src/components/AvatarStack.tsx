import { useMemo } from "react";
import { useContext, useEffect } from "react";

import { SpacesContext } from "../components/SpacesContext";

import Avatars from "./Avatars";
import { getMemberName } from "../utils/mockNames";
import { getMemberColor } from "../utils/mockColors";

import useMembers from "../hooks/useMembers";
import type { Member } from "../utils/helpers";

const AvatarStack = () => {
  const name = useMemo(getMemberName, []);
  const memberColor = useMemo(getMemberColor, []);

  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({ name, memberColor });
  }, [space]);

  /** 💡 Get everybody except the local member in the space and the local member 💡 */
  const { otherMembers, self } = useMembers(space);

  return (
    <div className="avatar-stack-container example-container" id="avatar-stack">
      {/** 💡 Stack of first 5 user avatars including yourself.💡 */}
      <Avatars
        self={self as Member | null}
        otherUsers={otherMembers as Member[]}
      />
    </div>
  );
};

export default AvatarStack;
