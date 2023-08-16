import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectInfo } from "../../commonUtils/types";
import MemberLocation from "./MemberLocation";

const Project = () => {
  const { setProjectInfo, channelName } = useOutletContext<{
    channelName: string;
    clientId: string;
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: "Member Location",
      repoNameAndPath:
        "realtime-examples/tree/main/src/components/MemberLocation",
      topic: "member-location",
    });
  }, []);

  return <MemberLocation spaceName={channelName} />;
};

export default Project;
