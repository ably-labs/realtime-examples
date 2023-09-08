import { getLocationColors } from "../../commonUtils/mockColors";
import { getMemberName } from "../../commonUtils/mockNames";
import useSpaces from "../../commonUtils/useSpaces";
import Form from "./Form";

const ComponentLocking = ({ spaceName }: { spaceName: string }) => {
  /** 💡 Get a handle on a space instance 💡 */
  const space = useSpaces({
    memberName: getMemberName(),
    memberColor: getLocationColors(),
  });

  return (
    <div
      className="w-full flex justify-center items-center rounded-2xl bg-[#F4F8FB]"
      id="member-location"
    >
      <div className="w-full max-w-[320px] p-2 py-4">
        <Form space={space} spaceName={spaceName} />
      </div>
    </div>
  );
};

export default ComponentLocking;

// Lock cell if someone else is editing it
// Transmit the cell data to all members in the space
// Unlock the cell when the member leaves the space (but maintain the data)
