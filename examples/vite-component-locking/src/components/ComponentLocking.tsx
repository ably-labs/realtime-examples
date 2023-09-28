import { useContext, useEffect } from "react";
import { getLocationColors } from "../utils/mockColors";
import { getMemberName } from "../utils/mockNames";
import Form from "./Form";

import { SpacesContext } from "./SpacesContext";

const ComponentLocking = () => {
  /** 💡 Get a handle on a space instance 💡 */
  const space = useContext(SpacesContext);

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    space?.enter({
      memberName: getMemberName(),
      memberColor: getLocationColors(),
    });
  }, [space]);

  return (
    <div
      className="component-locking-container example-container"
      id="component-locking"
    >
      <div className="w-full max-w-[320px] p-2 py-4">
        <Form space={space} />
      </div>
    </div>
  );
};

export default ComponentLocking;
