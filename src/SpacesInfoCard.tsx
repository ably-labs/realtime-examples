import { FunctionComponent, useEffect, useState } from "react";
import type { ProjectInfo } from "./commonUtils/types";
import AblyLogo from "./AblyLogo";
import GithubLogo from "./GithubLogo";
import {
  ExternalLinkIcon,
  DocumentDuplicateIcon,
  CodeIcon,
  ArrowRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/solid";
import debounce from "lodash.debounce";

const handleCopyClick = async () => {
  const currentURL = window.location.href;
  try {
    await navigator.clipboard.writeText(currentURL);
  } catch (err) {
    console.error("Failed to copy URL: ", err);
  }
};

const ExpandedInfoSection: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-slate-200 text-sm pb-2">
        Open this page in multiple windows or share the URL with your team to
        experience the demo.
        <div>
          <a
            className="text-slate-200 text-sm hover:underline"
            href={`https://ably.com/examples/${projectInfo.topic}?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
            target="_blank"
          >
            Learn more.
          </a>
        </div>
      </div>
      <div className="space-y-4 text-sm">
        <a
          className="flex justify-center items-center bg-white hover:bg-slate-100 active:bg-slate-200 focus:border-blue-500 focus:border-2 rounded py-3 md:flex-grow"
          href={window.location.href}
          target="_blank"
        >
          Open in new window
          <ExternalLinkIcon className="h-4 w-4 ml-2 text-orange-600" />
        </a>
        <div className="flex flex-row space-x-4 md:space-y-4 md:space-x-0 md:flex-col">
          <button
            className="flex justify-center items-center bg-slate-700 hover:bg-slate-600 active:bg-slate-500 focus:border-blue-500 focus:border-2 rounded py-3 flex-grow text-white"
            onClick={handleCopyClick}
          >
            <DocumentDuplicateIcon className="h-4 w-4 mx-2 text-slate-300" />
            Copy Link
          </button>
          <a
            className="flex justify-center items-center bg-slate-700 hover:bg-slate-600 active:bg-slate-500  focus:border-blue-500 focus:border-2 rounded py-3 flex-grow text-white"
            href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
          >
            <CodeIcon className="h-4 w-4 mx-2 text-slate-300" />
            View docs
            <ExternalLinkIcon className="h-4 w-4 ml-2 text-slate-300" />
          </a>
        </div>
        <a
          className="flex justify-center items-center bg-slate-700 hover:bg-slate-600 active:bg-slate-500  focus:border-blue-500 focus:border-2 text-white rounded py-3 md:flex-grow"
          href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
        >
          <span className="h-4 w-4 ml-2">
            <GithubLogo />
          </span>
          <span className="ml-2">View source on Github</span>
          <ExternalLinkIcon className="h-4 w-4 ml-2 text-slate-300" />
        </a>
      </div>
    </div>
  );
};

const SpacesInfoCard: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = debounce(() => {
      setIsMobile(window.innerWidth < 768);
    }, 150);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-slate-800 flex flex-col shadow-xl overflow-y-auto rounded-2xl">
      <div className="p-5">
        <div>
          <div className="flex justify-between text-white">
            <h2 className="pb-2">{projectInfo.name}</h2>
            {isMobile ? (
              <button
                className="text-sm"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Less" : "More"} info
                <ChevronUpIcon
                  className={`inline-block h-4 w-4 ml-2 text-slate-500 ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : null}
          </div>
        </div>
        {expanded || !isMobile ? (
          <ExpandedInfoSection projectInfo={projectInfo} />
        ) : null}
      </div>
      <div className="flex justify-between items-center text-white  py-6 px-6 mt-auto">
        <AblyLogo />
        <a
          href={`https://ably.com/examples?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
          className="group flex text-sm ml-2 items-center"
        >
          View all examples
          <ArrowRightIcon className="h-4 w-4 ml-1 text-orange-600 transition-transform group-hover:translate-x-2" />
        </a>
      </div>
    </div>
  );
};

export default SpacesInfoCard;
