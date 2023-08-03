import { FunctionComponent } from 'react'
import type { ProjectInfo } from './Layout'
import AblyLogo from './AblyLogo'
import GithubLogo from './GithubLogo'
import {
  ExternalLinkIcon,
  DocumentDuplicateIcon,
  CodeIcon,
  ArrowRightIcon,
} from '@heroicons/react/solid'

const InfoCard: FunctionComponent<{ projectInfo: ProjectInfo }> = ({
  projectInfo,
}) => {
  return (
    <div className="bg-slate-800 shadow-xl h-screen max-h-[calc(100vh-80px)] md:mb-16 rounded-lg min-w-[268px] max-w-[328px] flex flex-col flex-grow overflow-y-auto info">
      <div className="p-5">
        <div>
          <div className="flex justify-between text-white">
            <h2>{projectInfo.name}</h2>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-slate-200 text-sm">
            Open this page in multiple windows or share the URL with your team
            to experience the demo.{' '}
            <a
              className="text-slate-200 text-sm hover:underline"
              href={`https://ably.com/examples/${projectInfo.topic}?utm_source=ably-labs&utm_medium=demo&utm_campaign=${projectInfo.topic}`}
              target="_blank"
            >
              Learn more.
            </a>
          </p>
          <div className="flex flex-col text-center space-y-4 text-sm">
            <a
              className="flex justify-center bg-white rounded py-3"
              href={window.location.href}
              target="_blank"
            >
              Open in another window
              <ExternalLinkIcon className="h-5 w-5 ml-2 text-orange-600" />
            </a>
            <button className="flex justify-center bg-slate-700 text-white rounded py-3">
              <DocumentDuplicateIcon className="h-5 w-5 mx-2 text-slate-300" />
              Copy Link
            </button>
            <a
              className="flex justify-center bg-slate-700 text-white rounded py-3"
              href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
            >
              <CodeIcon className="h-5 w-5 mx-2 text-slate-300" />
              View docs
              <ExternalLinkIcon className="h-5 w-5 ml-2 text-slate-300" />
            </a>
            <a
              className="flex justify-center bg-slate-700 text-white rounded py-3"
              href={`https://github.com/ably-labs/${projectInfo.repoNameAndPath}`}
            >
              <GithubLogo />
              <span className="ml-2">View source on Github</span>
              <ExternalLinkIcon className="h-5 w-5 ml-2 text-slate-300" />
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center py-4 px-6 text-white mt-auto">
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
  )
}

export default InfoCard
