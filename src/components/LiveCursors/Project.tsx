import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../../commonUtils/types";
import LiveCursors from "./LiveCursors";

const Project = () => {
  const { setProjectInfo, channelName } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Live Cursors",
      repoNameAndPath: "realtime-examples/tree/main/src/components/LiveCursors",
      topic: "live-cursors",
      description:
        "Move your cursor to see it animated in a collaborative space. Open in a new widow or share the link to see multiple users.",
    });
  }, []);

  return <LiveCursors spaceName={channelName} />;
};

export default Project;
