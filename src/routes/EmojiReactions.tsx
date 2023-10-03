import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAbly } from "ably/react";

import type { ProjectInfo } from "../utils/types";
import EmojiReactions from "../../examples/vite-emoji-reactions/src/App";
import { getSpaceNameFromUrl } from "../utils/helpers";

const channelName = getSpaceNameFromUrl();

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();
  const client = useAbly();

  useEffect(() => {
    setProjectInfo({
      name: "Emoji Reactions",
      repoNameAndPath:
        "realtime-examples/tree/main/examples/vite-emoji-reactions",
      topic: "emoji-reactions",
      learnMore: true,
      description:
        "Open this page in multiple windows or share the URL with your team to experience the demo.",
    });
  }, []);

  return <EmojiReactions clientId={client.id} channelName={channelName} />;
};

export default Project;
