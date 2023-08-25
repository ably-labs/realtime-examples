import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectInfo } from "../../commonUtils/types";
import ComponentLocking from "./ComponentLocking";
import { useChannel } from "@ably-labs/react-hooks";

const Project = () => {
  const { setProjectInfo, channelName } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Component Locking",
      repoNameAndPath:
        "realtime-examples/tree/main/src/components/ComponentLocking",
      topic: "component-locking",
      description:
        "Click on a field to lock and edit the copy. Open in a new widow or share the link to see multiple users.",
    });
  }, []);

  return <ComponentLocking spaceName={channelName} />;
};

export default Project;
