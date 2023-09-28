import { FunctionComponent } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import classNames from "classnames";

import { type Member } from "../utils/helpers";

dayjs.extend(relativeTime);

const UserInfo: FunctionComponent<{ user: Member; isSelf?: boolean }> = ({
  user,
  isSelf,
}) => {
  const containerCSS = classNames(
    {
      "bg-gray-200": !user.isConnected,
      [user.profileData.memberColor]: user.isConnected,
    },
    "h-8 w-8 rounded-full flex shrink-0 items-center justify-center relative border-2 border-gray-300",
  );

  const initialsCSS = classNames(
    {
      "text-white": user.isConnected,
      "text-gray-400": !user.isConnected,
    },
    "text-xs",
  );

  const statusIndicatorCSS = classNames(
    {
      "bg-slate-500": !user.isConnected,
      "bg-green-500": user.isConnected,
    },
    "w-[5px] h-[5px] rounded-full mr-2",
  );

  const initials = user.profileData.name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("");

  const statusIndicatorText = user.isConnected
    ? "Online"
    : "Last seen " + dayjs().to(user.lastEvent.timestamp);

  const name = isSelf
    ? `${user.profileData.name} (You)`
    : user.profileData.name;

  return (
    <div className="flex justify-start items-center">
      <div className={containerCSS} id="avatar">
        <p className={initialsCSS}>{initials}</p>
      </div>

      {/* 💡 Display the name of the user from the `profileData` object 💡 */}
      <div id="user-list" className="pl-3 w-full">
        <p className="font-semibold text-sm">{name}</p>
        <div className="flex items-center justify-start">
          <div className={statusIndicatorCSS} />
          <p className="font-medium text-xs">{statusIndicatorText}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
