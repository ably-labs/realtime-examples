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

import styles from "./Avatars.module.css";

const SelfAvatar = ({ self }: { self: Member | null }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={styles.avatar}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p className={styles.name}>You</p>
      <div className={styles.statusIndicatorOnline} id="status-indicator" />

      {hover && self ? (
        <div className={styles.popup}>
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

        const initialsCSS = classNames(
          {
            [styles.textWhite]: user.isConnected,
            [styles.inactiveColor]: !user.isConnected,
          },
          styles.nameOthers,
        );

        const statusIndicatorCSS = classNames(
          {
            [styles.statusIndicatorOnline]: user.isConnected,
            [styles.inactiveBackground]: !user.isConnected,
          },
          styles.statusIndicator,
        );

        return (
          <div
            className={styles.avatarContainer}
            key={user.clientId}
            style={{
              right: rightOffset,
              zIndex: users.length - index,
            }}
          >
            <div
              className={styles.avatar}
              style={{
                backgroundColor: user.isConnected
                  ? user.profileData.memberColor
                  : "#C6CED9",
              }}
              onMouseOver={() => setHoveredClientId(user.clientId)}
              onMouseLeave={() => setHoveredClientId(null)}
              id="avatar"
            >
              <p className={initialsCSS}>{userInitials}</p>
              <div className={statusIndicatorCSS} id="status-indicator" />
            </div>

            {hoveredClientId === user.clientId ? (
              <div className={styles.popup}>
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
    <div className={styles.container} style={{ width: `${totalWidth}px` }}>
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
