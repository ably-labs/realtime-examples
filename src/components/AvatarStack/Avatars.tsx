import { SpaceMember } from "@ably/spaces";
import {
  MAX_USERS_BEFORE_LIST,
  calculateRightOffset,
  calculateTotalWidth,
} from "./utils/helpers";
import Surplus from "./Surplus";
import { useState } from "react";
import UserInfo from "./UserInfo";

const SelfAvatar = () => (
  <div className="bg-orange-600 h-12 w-12 rounded-full flex items-center justify-center relative border-2 border-gray-200">
    <p className="text-xs text-white">You</p>
    <div
      className="bg-green-500 w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2"
      id="status-indicator"
    />
  </div>
);

const OtherAvatars = ({ users }: { users: SpaceMember[] }) => {
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  return (
    <>
      {users.map((user, index) => {
        const rightOffset = calculateRightOffset({ users, index });
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
              className={`${
                user.isConnected ? user.profileData.memberColor : "bg-gray-200"
              } h-12 w-12 rounded-full flex items-center justify-center relative border-2 border-gray-200`}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p
                className={`relative z-20 text-xs ${
                  user.isConnected ? "text-white" : "text-gray-400"
                }`}
              >
                {user.profileData.name
                  .split(" ")
                  .map((word: string) => word.charAt(0))
                  .join("")}
              </p>
              <div
                className={`${
                  user.isConnected ? "bg-green-500" : "bg-gray-400"
                } w-[10px] h-[10px] rounded-full absolute bottom-1 left-0 transform translate-y-1/2 translate-x-1/2 z-10`}
                id="status-indicator"
              />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className="absolute -top-16 min-w-[190px] px-2 py-2 bg-black rounded-lg text-white">
                <UserInfo user={user} />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
};

const Avatars = ({ otherUsers }: { otherUsers: SpaceMember[] }) => {
  const totalWidth = calculateTotalWidth({ users: otherUsers });

  return (
    <div
      className="relative flex max-w-[206px] "
      style={{ width: `${totalWidth}px` }}
    >
      <SelfAvatar />
      <OtherAvatars
        users={otherUsers.slice(0, MAX_USERS_BEFORE_LIST).reverse()}
      />
      {/** 💡 Dropdown list of surplus users 💡 */}
      <Surplus otherUsers={otherUsers} />
    </div>
  );
};

export default Avatars;
