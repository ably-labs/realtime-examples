import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../utils/types";
import ComponentLocking from "../../examples/vite-component-locking/src/App";
import Spaces from "@ably/spaces";

const Project = ({ spaces }: { spaces: Spaces }) => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  useEffect(() => {
    setProjectInfo({
      name: "Component locking",
      docsLink: "https://ably.com/docs/spaces/locking",
      repoNameAndPath:
        "realtime-examples/tree/main/examples/vite-component-locking",
      topic: "component-locking",
      learnMore: false,
      description:
        "Click on a UI component to lock and edit the copy. Open the demo in a new window or share the link to see multiple users.",
    });
  }, []);

  return <ComponentLocking spaces={spaces} />;
};

export default Project;
