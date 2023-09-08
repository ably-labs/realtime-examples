import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../../commonUtils/types";
import AvatarStack from "./AvatarStack";

const Project = () => {
  const { setProjectInfo, channelName } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Avatar stack",
      docsLink: "https://ably.com/docs/spaces/avatar",
      repoNameAndPath: "realtime-examples/tree/main/src/components/AvatarStack",
      topic: "avatar-stack",
      description:
        "See your online presence in a space displayed as an Avatar. Open in a new window or share the link to see multiple users.",
    });
  }, []);

  return <AvatarStack />;
};

export default Project;
