import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import randomWords from "random-words";
import { configureAbly } from "@ably-labs/react-hooks";
import InfoCard from "./InfoCard";
import type { ProjectInfo } from "./components/commonUtils/types";
import apiConfig from "./components/commonUtils/apiConfig";

const example: string = window.location.pathname;
const API_CONFIG = apiConfig(example);
const clientId = API_CONFIG.clientId;

configureAbly(API_CONFIG);

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: "Realtime Examples",
    repoNameAndPath: "realtime-examples",
    topic: "realtime-examples",
  });

  const channelId =
    searchParams.get("id") || randomWords({ exactly: 3, join: "-" });

  useEffect(() => {
    if (!searchParams.get("id")) {
      setSearchParams({ id: channelId }, { replace: true });
    }
  }, [channelId]);

  const oldLayouts = [
    "emoji-reactions",
    "user-claims",
    "avatar-stack",
    "realtime-examples",
  ];

  return (
    <>
      {oldLayouts.includes(projectInfo.topic) ? (
        <main className="h-screen flex pt-6 md:pt-0 md:items-center justify-center font-sans bg-slate-100">
          <Outlet
            context={{ channelName: channelId, clientId, setProjectInfo }}
          />
          <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
            <InfoCard projectInfo={projectInfo} />
          </div>
        </main>
      ) : (
        <main className="h-screen flex pt-6 md:pt-0 md:items-center justify-center font-sans bg-slate-100">
          <Outlet
            context={{ channelName: channelId, clientId, setProjectInfo }}
          />
          <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
            <InfoCard projectInfo={projectInfo} />
          </div>
        </main>
      )}
    </>
  );
};

export default Layout;
