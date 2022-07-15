import { useState } from 'react'

const AvatarStack = () => {
  const [hovered, setHovered] = useState(false)
  return (
    <div className="flex flex-col">
      <div
        className="bg-gradient-to-r from-cyan-500 to-blue-500 
				h-12 w-12 rounded-full mb-8
				hover:w-14 hover:h-14 hover:border-2  hover:bg-blue-900"
        onMouseEnter={() => setHovered(!hovered)}
        onMouseLeave={() => setHovered(!hovered)}
      ></div>
      {hovered ? (
        <p className="h-8 w-14 bg-black rounded-lg text-white text-center py-1">
          You
        </p>
      ) : null}
    </div>
  )
}
export default AvatarStack
