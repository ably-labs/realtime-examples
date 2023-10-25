import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type Spaces from "@ably/spaces";

import type { ProjectInfo } from "../utils/types";
import MemberLocation from "../../examples/vite-member-location/src/App";

const Project = ({ spaces }: { spaces: Spaces }) => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  useEffect(() => {
    setProjectInfo({
      name: "Member location",
      docsLink: "https://ably.com/docs/spaces/locations",
      repoNameAndPath:
        "realtime-examples/tree/main/examples/vite-member-location",
      topic: "member-location",
      learnMore: false,
      description:
        "Click on a field to see how your location is displayed. Open in a new window or share the link to see multiple users.",
    });
  }, []);

  return <MemberLocation spaces={spaces} />;
};

export default Project;
