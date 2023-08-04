import { FunctionComponent } from "react";
import dayjs from "dayjs";
import { SpaceMember } from "@ably-labs/spaces";

const UserInfo: FunctionComponent<{ user: SpaceMember }> = ({ user }) => {
  return (
    <>
      {/* 💡 Display the name of the user from the `profileData` object 💡 */}
      <p className="font-semibold">{user.profileData.name}</p>
      <p className="font-semibold"></p>
      <div className="flex items-center justify-start">
        <div
          className={`${
            user.isConnected ? "bg-green-500" : "bg-slate-500"
          } w-2 h-2 rounded-full mr-2`}
        />
        <p className="font-medium text-sm">
          {user.isConnected
            ? "Online now"
            : dayjs().to(user.lastEvent.timestamp)}
        </p>
      </div>
    </>
  );
};

export default UserInfo;
