import React, { ElementRef, useEffect, useReducer, useRef, useState } from "react";
import { useChannel } from "ably/react";
import { Types } from "ably";
import {
  LightBulbIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { generate } from "random-words";
import classNames from "classnames";

import { JWTUtil } from "../utils/helpers";

import styles from "./UserClaims.module.css";

type Message = {
  author: string;
  content: string;
  timestamp: Date;
  id: string;
  deleted?: boolean;
};

type MessageSendEvent = { type: "send"; message: Message; id: string };
type MessageClearEvent = { type: "clear" };
type MessageDeleteEvent = { type: "delete"; [key: string]: any };

type MessageDispatch =
  | MessageSendEvent
  | MessageClearEvent
  | MessageDeleteEvent;

const UserClaims = ({
  clientId,
  channelName,
}: {
  clientId: string;
  channelName: string;
}) => {
  // 💡 Used to handle incoming events and action the changes against the message list
  const messageReducer = (
    state: Message[],
    action: MessageDispatch,
  ): Message[] => {
    switch (action.type) {
      case "send":
        action.message.id = action.id;
        return state.concat(action.message);
      case "delete":
        // 💡 Delete the message by remapping the message list with the target message deleted
        //    checking that the user who sent the delete action has the privilege to do so
        //    action.extras.userClaim will be populated automatically with the claim from the JWT when claims are active
        return state.map((m) =>
          !(m.author !== author && action.extras?.userClaim === "user") &&
          m.id === action.extras.ref.timeserial
            ? { ...m, deleted: true }
            : m,
        );
      case "clear":
        return [];
      default:
        return state;
    }
  };

  // 💡 Transforms the message from ably into the format that the reducer expects
  const handleMessage = (msg: Types.Message) => {
    dispatchMessage({ type: msg.name, id: msg.id, ...msg.data });
  };

  // 💡 Handles pressing enter or the send button
  const sendMessage = () => {
    if (draft.length === 0) return;
    channel.publish("send", {
      message: { author, content: draft, timestamp: new Date() },
    });
    setDraft("");
  };

  // 💡 Handles pressing the delete button
  const deleteMessage = (mid: string) => {
    return () => {
      // 💡 Send a message interaction for the target message with the `com.ably.delete` reference type
      channel.publish("delete", {
        user: author,
        extras: {
          ref: { type: "com.ably.delete", timeserial: mid },
        },
      });
    };
  };

  // 💡 Switches between the moderator/normal user JWT
  const switchMode = async () => {
    setLoading(true);
    await JWTUtil.switchToken(ably, clientId, channelName, moderator);
    setModerator(!moderator);
    setLoading(false);
  };

  const [author] = useState(generate({ exactly: 2, join: "" }));
  const [draft, setDraft] = useState("");
  const [moderator, setModerator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, dispatchMessage] = useReducer(messageReducer, []);
  const { channel, ably } = useChannel(channelName, handleMessage);
  const scrollRef = useRef<ElementRef<"div">>(null);

  // 💡 Effect to replay the message history, and add an initial message to new sessions
  useEffect(() => {
    channel.history((err: any, result: { items: Types.Message[] }) => {
      if (err || !result) return;
      if (result.items.length === 0) {
        channel.publish("send", {
          message: {
            author: "Joe Bloggs",
            content: "You won't believe this get rich quick scheme!",
            timestamp: new Date(),
          },
        });
      } else {
        result.items.reverse().forEach(handleMessage);
      }
    });

    return () => {
      dispatchMessage({ type: "clear" });
    };
  }, []);

  // call the scrollIntoView method on the element, which scrolls the element into the visible area of the browser window
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.inner, {
          [styles.moderator]: moderator,
          [styles.noModerator]: !moderator,
        })}
      >
        <div className={styles.messages}>
          {messages.map((m) => (
            <Message
              message={m}
              local={m.author === author}
              deleteMessage={deleteMessage}
              moderator={moderator}
              key={m.id}
            />
          ))}
           <div ref={scrollRef} />
        </div>
        <div className={styles.bar}>
          <input
            type="text"
            disabled={loading}
            className={styles.input}
            placeholder="Type something..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className={styles.button}
            disabled={loading}
          >
            <PaperAirplaneIcon className={styles.icon} />
          </button>
        </div>
        <PrivilegeBar
          moderator={moderator}
          loading={loading}
          onToggle={switchMode}
        />
      </div>
      <div className={styles.note}>
        <LightBulbIcon className={styles.lightBulbIcon} />
        <p className={styles.text}>
          Send messages from one or more windows. Toggle between roles to delete
          messages sent by you or by anyone else in the chat.
        </p>
      </div>
    </div>
  );
};

function PrivilegeBar({
  moderator,
  loading,
  onToggle,
}: {
  moderator: boolean;
  loading: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={styles.privilageContainer}>
      {loading ? (
        <PrivilegeBarInner
          Icon={ArrowPathIcon}
          titleText="Switching roles"
          subtitleText="Loading..."
          iconColour={styles.textSlate500}
          iconBackground={styles.bgSlate100}
        />
      ) : moderator ? (
        <PrivilegeBarInner
          Icon={ShieldCheckIcon}
          titleText={
            <>
              You have the <b>moderator</b> role
            </>
          }
          subtitleText="You can delete everyone's messages"
          iconColour={styles.textOrange500}
          iconBackground={styles.bgOrange100}
        />
      ) : (
        <PrivilegeBarInner
          Icon={UserCircleIcon}
          titleText={
            <>
              You have the <b>participant</b> role
            </>
          }
          subtitleText="You can delete your own messages"
          iconColour={styles.textSlate800}
          iconBackground={styles.bgSlate200}
        />
      )}
      <button
        className={styles.switchButton}
        onClick={onToggle}
        disabled={loading}
      >
        Switch to {moderator ? "participant" : "moderator"}
      </button>
    </div>
  );
}

function PrivilegeBarInner({
  Icon,
  iconBackground,
  iconColour,
  titleText,
  subtitleText,
}: {
  Icon: typeof ArrowPathIcon | typeof ShieldCheckIcon | typeof UserCircleIcon;
  iconBackground: string;
  iconColour: string;
  titleText: string | JSX.Element;
  subtitleText: string;
}) {
  return (
    <div className={styles.privilegeBarInner}>
      <div
        className={classNames(styles.privilegeBarIconContainer, iconBackground)}
      >
        <Icon className={classNames(styles.privilegeIcon, iconColour)} />
      </div>
      <div>
        <div>{titleText}</div>
        <div className={styles.textSlate500}>{subtitleText}</div>
      </div>
    </div>
  );
}

function Message({
  message,
  local,
  moderator,
  deleteMessage,
}: {
  message: Message;
  local: boolean;
  moderator: boolean;
  deleteMessage: (mid: string) => () => void;
}) {
  return (
    <div
      className={classNames(styles.messageContainer, {
        [styles.end]: local,
        [styles.row]: !local,
      })}
    >
      <div
        className={classNames(styles.messageInner, {
          [styles.bgBlue50]: local,
          [styles.bgSlate100]: !local,
        })}
      >
        <p
          className={classNames(styles.author, {
            [styles.textBlue400]: local,
            [styles.textSlate400]: !local,
          })}
        >
          {message.author} {local ? "(you)" : ""}
        </p>
        <p
          className={classNames(styles.deleted, {
            [styles.isDeleted]: message.deleted,
          })}
        >
          {message.deleted ? "This message has been deleted." : message.content}
        </p>
      </div>
      <button
        className={classNames(styles.deleteButton, {
          [styles.isLocalDelete]: local,
          [styles.isNotLocalDelete]: !local,
          [styles.noOpacity]: (!moderator && !local) || message.deleted,
        })}
        disabled={!moderator && !local}
        onClick={deleteMessage(message.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default UserClaims;
