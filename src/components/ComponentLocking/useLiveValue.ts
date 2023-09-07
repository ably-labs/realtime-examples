import type { Types } from "ably";
import { useChannel } from "ably/react";
import { useCallback, useState } from "react";
import { type Member } from "./utils/helper";

export const useLiveValue = (
  spaceName: string,
  componentName: string,
  self: Member | null,
) => {
  const [value, setValue] = useState("");
  const channelName = `[?rewind=1]${spaceName}-${componentName}`;
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
