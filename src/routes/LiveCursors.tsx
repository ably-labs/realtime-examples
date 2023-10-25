import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../utils/types";
import LiveCursors from "../../examples/vite-live-cursors/src/App";
import Spaces from "@ably/spaces";

const Project = ({ spaces }: { spaces: Spaces }) => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  useEffect(() => {
    setProjectInfo({
      name: "Live cursors",
      repoNameAndPath: "realtime-examples/tree/main/examples/vite-live-cursors",
      docsLink: "https://ably.com/docs/spaces/cursors",
      topic: "live-cursors",
      learnMore: true,
      description:
        "Move your cursor to see it animated in a collaborative space. To see multiple users share the link with colleagues.",
    });
  }, []);

  return <LiveCursors spaces={spaces} />;
};

export default Project;
