import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectInfo } from "../../commonUtils/types";
import ComponentLocking from "./ComponentLocking";

const Project = () => {
  const { setProjectInfo, channelName } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Component locking",
      docsLink: "https://ably.com/docs/spaces/locking",
      repoNameAndPath:
        "realtime-examples/tree/main/src/components/ComponentLocking",
      topic: "component-locking",
      learnMore: false,
      description:
        "Click on a UI component to lock and edit the copy. Open the demo in a new window or share the link to see multiple users.",
    });
  }, []);

  return <ComponentLocking spaceName={channelName} />;
};

export default Project;
