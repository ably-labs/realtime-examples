import { useState, FunctionComponent } from "react";
import type { ProjectInfo } from "../utils/types";
import AblyLogo from "./AblyLogo";
import {
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";

const InfoCard: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="bg-slate-800 shadow-xl w-screen md:w-[360px] rounded-t-lg md:rounded-lg">
      <div className="p-6 space-y-4">
        <div>
          <div className="flex justify-between text-white">
            <h2>{projectInfo.name}</h2>
            <button className="text-sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Less" : "More"} info
              <ChevronUpIcon
                className={`inline-block ml-2 h-5 w-5 text-slate-500 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
        {expanded ? (
          <div className="space-y-4">
            <div className="text-slate-300 text-sm">
              {projectInfo.description}
              <div>
                <a
                  className="text-slate-200 text-sm underline"
                  href={`https://ably.com/examples/${projectInfo.topic}?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
                  target="_blank"
                >
                  Learn more.
                </a>
              </div>
            </div>
            <div className="flex flex-col text-center space-y-4 text-sm">
              <a
                className="flex justify-center bg-white rounded py-3"
                href={window.location.href}
                target="_blank"
              >
                Open in another window
                <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 text-orange-600" />
              </a>
              <a
                className="flex justify-center bg-slate-700 text-white rounded py-3"
                href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
              >
                View source on GitHub
                <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-2 text-slate-300" />
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className="w-full h-px bg-gray-700" />
      <div className="flex justify-between items-center py-4 px-6 text-white">
        <AblyLogo />
        <a
          href={`https://ably.com/examples?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
          className="flex text-sm"
        >
          View all examples
          <ArrowRightIcon className="h-5 w-5 ml-2 text-orange-600" />
        </a>
      </div>
    </div>
  );
};

export default InfoCard;
