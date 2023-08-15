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
      name: "Avatar Stack",
      repoNameAndPath: "realtime-examples/tree/main/src/components/AvatarStack",
      topic: "avatar-stack",
    });
  }, []);

  return <AvatarStack spaceName={channelName} />;
};

export default Project;
