import { FunctionComponent } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { type Member } from "../utils/helpers";

import styles from "./UserInfo.module.css";

dayjs.extend(relativeTime);

const UserInfo: FunctionComponent<{ user: Member; isSelf?: boolean }> = ({
  user,
  isSelf,
}) => {
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
    <div className={styles.wrapper}>
      <div
        style={{
          backgroundColor: user.isConnected
            ? user.profileData.memberColor
            : "rgb(229 231 235)",
        }}
        className={styles.container}
        id="avatar"
      >
        <p
          style={{ color: user.isConnected ? "#fff" : "rgb(156 163 175)" }}
          className={styles.smallText}
        >
          {initials}
        </p>
      </div>

      {/* 💡 Display the name of the user from the `profileData` object 💡 */}
      <div id="user-list" className={styles.userList}>
        <p className={styles.name}>{name}</p>
        <div className={styles.wrapper}>
          <div
            style={{
              backgroundColor: user.isConnected
                ? "rgb(34 197 94)"
                : "rgb(100 116 139)",
            }}
            className={styles.statusIndicator}
          />
          <p className={styles.statusIndicatorText}>{statusIndicatorText}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
