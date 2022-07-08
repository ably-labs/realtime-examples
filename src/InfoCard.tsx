import AblyLogo from './AblyLogo'

const InfoCard = () => (
  <div className="bg-slate-800 shadow-xl w-[360px] rounded-lg">
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-white text-xl">Avatar Stack</h2>
        <p className="text-slate-300 text-sm">Open in multiple windows or share the URL with your team to see more avatars.</p>
      </div>
      <div className="flex flex-col text-center space-y-4">
        <a className="bg-white rounded py-3" href="https://www.google.com/">Open in another window</a>
        <a className="bg-slate-700 text-white rounded py-3" href="https://">View source on Github</a>
      </div>
    </div>
    <div className="w-full h-px bg-gray-700" />
    <div className="flex justify-between items-center py-4 px-6 text-white">
      <AblyLogo />
      <a className="text-sm">View all examples</a>
    </div>
  </div>
)

export default InfoCard
