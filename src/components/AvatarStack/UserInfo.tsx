import { FunctionComponent } from "react";
import dayjs from "dayjs";
import { SpaceMember } from "@ably-labs/spaces";

function getRandomColor(arr: string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
const UserInfo: FunctionComponent<{ user: SpaceMember }> = ({ user }) => {
  return (
    <div className="flex justify-start items-center">
      <div
        className={`${
          user.isConnected ? user.profileData.memberColor : "bg-gray-200"
        } h-8 w-8 rounded-full flex items-center justify-center relative border-2 border-gray-300`}
        id="avatar"
      >
        <p
          className={`text-xs ${
            user.isConnected ? "text-white" : "text-gray-400"
          }`}
        >
          {user.profileData.name
            .split(" ")
            .map((word: string) => word.charAt(0))
            .join("")}
        </p>
      </div>

      {/* 💡 Display the name of the user from the `profileData` object 💡 */}
      <div id="user-list" className="pl-3">
        <p className="font-semibold text-sm">{user.profileData.name}</p>
        <div className="flex items-center justify-start">
          <div
            className={`${
              user.isConnected ? "bg-green-500" : "bg-slate-500"
            } w-[5px] h-[5px] rounded-full mr-2`}
          />
          <p className="font-medium text-xs">
            {user.isConnected
              ? "Online"
              : "Last seen " + dayjs().to(user.lastEvent.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
