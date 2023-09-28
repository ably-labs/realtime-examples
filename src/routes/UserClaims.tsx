import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import type { ProjectInfo } from "../utils/types";
import UserClaims from "../../examples/vite-user-claims/src/App";

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void;
  }>();

  useEffect(() => {
    setProjectInfo({
      name: "User Claims",
      repoNameAndPath: "realtime-examples/tree/main/examples/vite-user-claims",
      topic: "user-claims",
      learnMore: true,
      description:
        "Open this page in multiple windows or share the URL with your team to experience the demo.",
    });
  }, []);

  return <UserClaims />;
};

export default Project;
