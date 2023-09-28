import { useState } from "react";
import { Outlet } from "react-router-dom";

import InfoCard from "./InfoCard";
import SpacesInfoCard from "./SpacesInfoCard";
import type { ProjectInfo } from "../utils/types";

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

  return oldLayouts.includes(projectInfo.topic) ? (
    <main className="h-screen flex p-6 justify-center font-sans md:pt-0 md:items-center bg-[#f4f8fb]">
      <Outlet context={{ setProjectInfo }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard projectInfo={projectInfo} />
      </div>
    </main>
  ) : (
    <main className="antialiased overflow-scroll flex w-screen h-screen justify-between font-sans bg-slate-900 flex-col-reverse md:flex-row md:p-12">
      <div className="w-full flex justify-center max-h-[calc(100vh)] md:min-w-[268px] md:max-w-[328px] md:mr-6">
        <SpacesInfoCard projectInfo={projectInfo} />
      </div>
      <div className="w-full h-full flex justify-center p-4 md:p-0">
        <Outlet context={{ setProjectInfo }} />
      </div>
    </main>
  );
};

export default Layout;
