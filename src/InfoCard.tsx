import AblyLogo from './AblyLogo'
import { ExternalLinkIcon, ArrowRightIcon } from '@heroicons/react/solid'

const InfoCard = () => (
  <div className="bg-slate-800 shadow-xl w-[360px] rounded-lg">
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-white text-xl">Avatar Stack</h2>
        <p className="text-slate-300 text-sm">
          Open in multiple windows or share the URL with your team to see more
          avatars.
        </p>
      </div>
      <div className="flex flex-col text-center space-y-4 text-sm">
        <a className="flex justify-center bg-white rounded py-3" href="https://www.google.com/">
          Open in another window
          <ExternalLinkIcon className="h-5 w-5 ml-2 text-orange-600" />
        </a>
        <a className="flex justify-center bg-slate-700 text-white rounded py-3" href="https://">
          View source on Github
          <ExternalLinkIcon className="h-5 w-5 ml-2 text-slate-300" />
        </a>
      </div>
    </div>
    <div className="w-full h-px bg-gray-700" />
    <div className="flex justify-between items-center py-4 px-6 text-white">
      <AblyLogo />
      <a className="flex text-sm">
        View all examples
        <ArrowRightIcon className="h-5 w-5 ml-2 text-orange-600" />
      </a>
    </div>
  </div>
)

export default InfoCard
