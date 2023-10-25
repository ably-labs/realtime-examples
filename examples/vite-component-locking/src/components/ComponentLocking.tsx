import { useEffect } from "react";
import { useSpace } from "@ably/spaces/react";
import { getLocationColors } from "../utils/mockColors";
import { getMemberName } from "../utils/mockNames";
import Form from "./Form";

const ComponentLocking = () => {
  /** 💡 Get a handle on a space instance 💡 */
  const { enter } = useSpace();

  /** 💡 Enter the space as soon as it's available 💡 */
  useEffect(() => {
    enter?.({
      memberName: getMemberName(),
      memberColor: getLocationColors(),
    });
  }, [enter]);

  return (
    <div
      className="component-locking-container example-container"
      id="component-locking"
    >
      <div className="w-full max-w-[320px] p-2 py-4">
        <Form />
      </div>
    </div>
  );
};

export default ComponentLocking;
