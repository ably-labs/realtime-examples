import { useChannel } from "ably/react";
import { useEffect, useState } from "react";
import defaultMessages, { EmojiUsage, Message } from "../utils/messageData";
import { ArrowPathIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { Types } from "ably";

import styles from "./EmojiReactions.module.css";

const EmojiReactions = ({
  channelName,
  clientId,
}: {
  channelName: string;
  clientId: string;
}) => {
  // 💡 Include your channel namespace created in Ably for message interactions. In this case, we use "reactions" 💡
  channelName = `reactions:${channelName}`;
  const emojis = ["😀", "❤️", "👋", "😹", "😡", "👏"];
  let usedEmojiCollection: EmojiUsage[] = [];

  const ADD_REACTION_EVENT = "add-reaction";
  const REMOVE_REACTION_EVENT = "remove-reaction";
  const SEND_EVENT = "send";

  const [addEmoji, setAddEmoji] = useState(true);

  const [chatMessage, setChatMessage] = useState<Message>({});
  const [showEmojiList, setShowEmojiList] = useState(false);

  // 💡 Access and subscribe to your channel using "useChannel" from "ably/react" 💡
  const { channel } = useChannel(
    channelName,
    (msg: {
      name: string;
      data: { author: any; content: any; body: string };
      id: any;
      timestamp: string | number | Date;
      clientId: string;
    }) => {
      switch (msg.name) {
        case SEND_EVENT:
          // 💡 Reset emoji reactions when a new message is received 💡
          usedEmojiCollection = [];
          setChatMessage({
            author: msg.data.author,
            content: msg.data.content,
            timeserial: msg.id,
            timeStamp: new Date(msg.timestamp),
          });
          break;
        case REMOVE_REACTION_EVENT:
          // 💡 Remove emoji reaction from chat message 💡
          const msgReactions = updateEmojiCollection(
            msg.data.body,
            msg.clientId,
            msg.name,
          );
          setChatMessage((chatMessage) => ({
            ...chatMessage,
            reactions: msgReactions,
          }));
          break;
      }
    },
  );

  // 💡 Publish new chat message to channel 💡
  const sendMessage = () => {
    const message =
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
    channel.publish(SEND_EVENT, message);
  };

  // 💡 Publish emoji reaction for a message using the chat message timeserial 💡
  const sendMessageReaction = (
    emoji: string,
    timeserial: any,
    reactionEvent: string,
  ) => {
    channel.publish(reactionEvent, {
      body: emoji,
      extras: {
        reference: { type: "com.ably.reaction", timeserial },
      },
    });
    setShowEmojiList(false);
  };

  // 💡 Subscribe to emoji reactions for a message using the message timeserial 💡
  const getMessageReactions = () => {
    channel.subscribe(
      {
        name: ADD_REACTION_EVENT,
        refTimeserial: chatMessage.timeserial,
      },
      (reaction: {
        data: { body: string };
        clientId: string;
        name: string;
      }) => {
        // 💡 Update current chat message with its reaction(s) 💡
        const msgReactions = updateEmojiCollection(
          reaction.data.body,
          reaction.clientId,
          reaction.name,
        );
        setChatMessage((chatMessage) => ({
          ...chatMessage,
          reactions: msgReactions,
        }));
      },
    );
  };

  // 💡 Increase or decrease emoji count on click on existing emoji 💡
  const handleEmojiCount = (emoji: string, timeserial: any) => {
    const emojiEvent = addEmoji ? ADD_REACTION_EVENT : REMOVE_REACTION_EVENT;
    setAddEmoji(!addEmoji);
    sendMessageReaction(emoji, timeserial, emojiEvent);
  };

  // 💡 Keep track of used emojis 💡
  const updateEmojiCollection = (
    emoji: string,
    clientId: string,
    reactionEvent: string,
  ) => {
    const userReactions = usedEmojiCollection.find(
      (emj) => emj.emoji === emoji,
    );

    switch (reactionEvent) {
      case ADD_REACTION_EVENT:
        if (userReactions) {
          if (!userReactions.usedBy.includes(clientId)) {
            userReactions.usedBy.push(clientId);
          }
        } else {
          const emojiUse: EmojiUsage = { usedBy: [clientId], emoji: emoji };
          usedEmojiCollection.push(emojiUse);
        }
        break;
      case REMOVE_REACTION_EVENT:
        if (userReactions && userReactions.usedBy.includes(clientId)) {
          userReactions.usedBy.splice(
            userReactions.usedBy.indexOf(clientId),
            1,
          );
          usedEmojiCollection[usedEmojiCollection.indexOf(userReactions)] =
            userReactions;
        }
        break;
    }
    return usedEmojiCollection;
  };

  // 💡 Update current chat message and its reactions leveraging Ably channel history 💡
  const updateMessageFromHistory = (
    messageIndex: number,
    history: Types.PaginatedResult<Types.Message>,
  ) => {
    const lastPublishedMessage = history?.items[messageIndex];

    // 💡 Get reactions of the published message 💡
    if (messageIndex > 0) {
      for (let i = messageIndex - 1; i >= 0; i--) {
        const emoji = history?.items[i].data.body;
        const client = history?.items[i].clientId;
        const event = history?.items[i].name;

        if (usedEmojiCollection.length > 0) {
          for (const usage of usedEmojiCollection) {
            updateEmojiCollection(emoji, client, event);
          }
        } else {
          const emojiUse: EmojiUsage = { usedBy: [client], emoji: emoji };
          usedEmojiCollection.push(emojiUse);
        }
      }
    }

    // 💡 Update chat message 💡
    setChatMessage({
      author: lastPublishedMessage?.data.author,
      content: lastPublishedMessage?.data.content,
      timeserial: lastPublishedMessage?.id,
      reactions: usedEmojiCollection,
      timeStamp: new Date(lastPublishedMessage.timestamp),
    });
  };

  // 💡 Format chat message timestamp to readable format 💡
  const formatChatMessageTime = (timestamp: Date) => {
    const hour = timestamp.getHours();
    const minutes = `${
      timestamp.getMinutes() < 10 ? "0" : ""
    }${timestamp.getMinutes()}`;
    return `${hour}:${minutes}`;
  };

  useEffect(() => {
    // 💡 Subscribe to message reactions 💡
    getMessageReactions();

    // 💡 Keep last published message and reactions using Ably channel history 💡
    channel.history(
      (err: any, result: Types.PaginatedResult<Types.Message>) => {
        // Get index of last sent message from history
        const lastPublishedMessageIndex: any = result?.items.findIndex(
          (message) => message.name == SEND_EVENT,
        );

        if (lastPublishedMessageIndex >= 0) {
          updateMessageFromHistory(lastPublishedMessageIndex, result!);
        } else {
          // 💡 Load new random message when channel has no history 💡
          sendMessage();
        }
      },
    );
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.uiWrapper}>
        <div className={styles.instructions}>
          <p>
            Open this page in a few windows and add a reaction to the message to
            see it update everywhere.
          </p>
        </div>

        {/* Display default chat message */}
        {chatMessage.author ? (
          <div className={styles.author}>
            <div className={styles.authorFlex}>
              <img className={styles.authorAvatar} role="presentation"></img>
              <div>
                <p className={styles.authorName}>
                  {chatMessage.author}
                  <span className={styles.authorTimestamp}>
                    {formatChatMessageTime(chatMessage.timeStamp!)}
                  </span>
                </p>
                <p className={styles.message}>{chatMessage.content}</p>
              </div>
            </div>

            {/* Display chat message emoji reactions and count */}
            <div className={styles.emojiWrapper}>
              {chatMessage.reactions?.length ? (
                <ul className={styles.emojiList}>
                  {chatMessage.reactions?.map((reaction) =>
                    reaction.usedBy.length ? (
                      <li
                        key={reaction.emoji}
                        className={`${styles.emojiListItem} ${
                          reaction.usedBy.includes(clientId)
                            ? styles.emojiListItemBlue
                            : styles.emojiListItemSlate
                        }`}
                        onClick={() =>
                          handleEmojiCount(
                            reaction.emoji,
                            chatMessage.timeserial,
                          )
                        }
                      >
                        <EmojiDisplay emoji={reaction.emoji} />
                        <span className={styles.emojiListItemSpan}>
                          {reaction.usedBy.length}
                        </span>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : null}

              {/* Allow user to select and add an emoji reaction */}
              <div className={styles.controls}>
                <div className={styles.control}>
                  <FaceSmileIcon
                    className={styles.controlIcon}
                    onClick={() => setShowEmojiList(!showEmojiList)}
                  />
                </div>
                {showEmojiList ? (
                  <ul className={styles.controlEmojiList}>
                    {emojis.map((emoji) => (
                      <li
                        key={emoji}
                        className={styles.controlEmojiListItem}
                        onClick={() =>
                          sendMessageReaction(
                            emoji,
                            chatMessage.timeserial,
                            ADD_REACTION_EVENT,
                          )
                        }
                      >
                        <EmojiDisplay emoji={emoji} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Load new chat message */}
        <div className={styles.newMessage}>
          <button className={styles.newMessageButton} onClick={sendMessage}>
            <ArrowPathIcon className={styles.newMessageButtonIcon} />
            <span className={styles.newMessageButtonText}>New message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 💡 Use twemoji for consistency in emoji display across platforms 💡
const EmojiDisplay = ({ emoji }: { emoji: string }) => {
  const codePoint = emoji.codePointAt(0)?.toString(16);
  return (
    <img
      alt={emoji}
      className={styles.emojiIcon}
      src={`https://twemoji.maxcdn.com/v/latest/svg/${codePoint}.svg`}
    />
  );
};

export default EmojiReactions;
