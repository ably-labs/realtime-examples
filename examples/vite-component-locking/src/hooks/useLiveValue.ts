import type { Types } from "ably";
import { useChannel } from "ably/react";
import { useCallback, useState } from "react";
import { type Member } from "../utils/types";

import { getSpaceNameFromUrl } from "../utils/helpers";

export const useLiveValue = (componentName: string, self: Member | null) => {
  const [value, setValue] = useState("");

  /** 💡 Use rewind to get the last message from the channel. See https://ably.com/docs/channels/options/rewind 💡 */
  const channelName = `[?rewind=1]${getSpaceNameFromUrl()}-${componentName}`;
  const { channel } = useChannel(channelName, (message: Types.Message) => {
    if (message.connectionId === self?.connectionId) return;
    setValue(message.data);
  });

  const handleChange = useCallback(
    (nextValue: string) => {
      setValue(nextValue);
      channel.publish("update", nextValue);
    },
    [channel],
  );

  return [value, handleChange] as const;
};
