import { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

import InfoCard from "./InfoCard";
import SpacesInfoCard from "./SpacesInfoCard";
import type { ProjectInfo } from "../utils/types";

import styles from "./Layout.module.css";

const Layout = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: "Realtime Examples",
    repoNameAndPath: "realtime-examples",
    topic: "realtime-examples",
    learnMore: true,
    description:
      "Open this page in multiple windows or share the URL with your team to experience the demo.",
  });

  const oldLayouts = ["emoji-reactions", "user-claims", "realtime-examples"];
  const [searchParams] = useSearchParams();

  if (searchParams.get('layout') === 'false') {
    return <Outlet context={{ setProjectInfo }} />;
  }

  return oldLayouts.includes(projectInfo.topic) ? (
    <main id="full-layout" className={styles.oldLayout}>
      <Outlet context={{ setProjectInfo }} />
      <div className={styles.oldLayoutWrapper}>
        <InfoCard projectInfo={projectInfo} />
      </div>
    </main>
  ) : (
    <main id="full-layout" className={styles.layout}>
      <div className={styles.cardWrapper}>
        <SpacesInfoCard projectInfo={projectInfo} />
      </div>
      <div className={styles.display}>
        <Outlet context={{ setProjectInfo }} />
      </div>
    </main>
  );
};

export default Layout;
