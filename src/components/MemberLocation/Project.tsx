import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectInfo } from "../../commonUtils/types";
import MemberLocation from "./MemberLocation";

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Member location",
      docsLink: "https://ably.com/docs/spaces/locations",
      repoNameAndPath:
        "realtime-examples/tree/main/src/components/MemberLocation",
      topic: "member-location",
      description:
        "Click on a field to see how your location is displayed. Open in a new window or share the link to see multiple users.",
    });
  }, []);

  return <MemberLocation />;
};

export default Project;
