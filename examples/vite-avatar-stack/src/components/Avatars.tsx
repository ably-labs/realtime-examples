import { useState } from "react";
import classNames from "classnames";

import {
  MAX_USERS_BEFORE_LIST,
  calculateRightOffset,
  calculateTotalWidth,
} from "../utils/helpers";
import Surplus from "./Surplus";
import UserInfo from "./UserInfo";

import type { Member } from "../utils/helpers";

const SelfAvatar = ({ self }: { self: Member | null }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="bg-orange-600 h-12 w-12 rounded-full flex items-center justify-center relative border-2 border-gray-200"
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className="text-xs text-white">You</p>
      <div
        className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
        id="status-indicator"
      />

      {hover && self ? (
        <div className="absolute -top-16 px-2 py-2 bg-black rounded-lg text-white min-w-[240px]">
          <UserInfo user={self} isSelf={true} />
        </div>
      ) : null}
    </div>
  );
};

const OtherAvatars = ({
  users,
  usersCount,
}: {
  users: Member[];
  usersCount: number;
}) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ usersCount, index });
        const userInitials = user.profileData.name
          .split(" ")
          .map((word: string) => word.charAt(0))
          .join("");
        const avatarCSS = classNames(
          {
            [user.profileData.memberColor]: user.isConnected,
            "bg-gray-200": !user.isConnected,
          },
          "h-12 w-12 rounded-full flex items-center justify-center relative border-2 border-gray-200",
        );
        const initialsCSS = classNames(
          {
            "text-white": user.isConnected,
            "text-gray-400": !user.isConnected,
          },
          "relative z-20 text-xs",
        );
        const statusIndicatorCSS = classNames(
          {
            "bg-green-500": user.isConnected,
            "bg-gray-400": !user.isConnected,
          },
          "w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2 z-10",
        );

        return (
          <div
            className="right-0 flex flex-col items-center absolute"
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
            <div
              className={avatarCSS}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p className={initialsCSS}>{userInitials}</p>
              <div className={statusIndicatorCSS} id="status-indicator" />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className="absolute -top-16 px-2 py-2 bg-black rounded-lg text-white min-w-[240px]">
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const Avatars = ({
  otherUsers,
  self,
}: {
  otherUsers: Member[];
  self: Member | null;
}) => {
  const totalWidth = calculateTotalWidth({ users: otherUsers });

  return (
    <div className="relative flex" style={{ width: `${totalWidth}px` }}>
      <SelfAvatar self={self} />
      <OtherAvatars
        usersCount={otherUsers.length}
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {/** 💡 Dropdown list of surplus users 💡 */}
      <Surplus otherUsers={otherUsers} />
    </div>
  );
};

export default Avatars;
