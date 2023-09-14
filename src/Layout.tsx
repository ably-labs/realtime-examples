import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import randomWords from "random-words";
import InfoCard from "./InfoCard";
import SpacesInfoCard from "./SpacesInfoCard";
import type { ProjectInfo } from "./commonUtils/types";
import createApiConfig from "./commonUtils/apiConfig";
import { SpaceContextProvider } from "./components/SpacesContext";

const example: string = window.location.pathname;
const API_CONFIG = createApiConfig(example);
const clientId = API_CONFIG.clientId || "";

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: "Realtime Examples",
    repoNameAndPath: "realtime-examples",
    topic: "realtime-examples",
    learnMore: true,
    description:
      "Open this page in multiple windows or share the URL with your team to experience the demo.",
  });

  const channelId =
    searchParams.get("id") || randomWords({ exactly: 3, join: "-" });

  useEffect(() => {
    if (!searchParams.get("id")) {
      setSearchParams({ id: channelId }, { replace: true });
    }
  }, [channelId]);

  const oldLayouts = ["emoji-reactions", "user-claims", "realtime-examples"];

  return oldLayouts.includes(projectInfo.topic) ? (
    <SpaceContextProvider example={example} spaceName={channelId}>
      <main className="h-screen flex pt-6 justify-center font-sans bg-slate-100 md:pt-0 md:items-center">
        <Outlet
          context={{ channelName: channelId, clientId, setProjectInfo }}
        />
        <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
          <InfoCard projectInfo={projectInfo} />
        </div>
      </main>
    </SpaceContextProvider>
  ) : (
    <SpaceContextProvider example={example} spaceName={channelId}>
      <main className="antialiased overflow-scroll flex w-screen h-screen justify-between font-sans bg-slate-900 flex-col-reverse md:flex-row md:p-12">
        <div className="w-full flex justify-center max-h-[calc(100vh)] md:min-w-[268px] md:max-w-[328px] md:mr-6">
          <SpacesInfoCard projectInfo={projectInfo} />
        </div>
        <div className="w-full h-full flex justify-center p-4 md:p-0">
          <Outlet
            context={{ channelName: channelId, clientId, setProjectInfo }}
          />
        </div>
      </main>
    </SpaceContextProvider>
  );
};

export default Layout;
