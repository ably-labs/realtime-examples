import { useEffect, useState } from 'react'
import { Space, SpaceMember } from '@ably-labs/spaces'
import CursorSvg from './CursorSvg'
import useCursor from './utils/use-cursor'

// 💡 This component is used to render the cursor of the user
const YourCursor = ({ user, space }: { user?: SpaceMember; space?: Space }) => {
  const [cursorPosition, setCursorPosition] = useState<{
    [key: string]: number
  }>({ left: 100, top: 100 })
  const handleSelfCursorMove = useCursor(setCursorPosition, space)
  if (!user) {
    return null
  }
  const {
    gradientStartClass,
    gradientEndClass,
    cursorStartColor,
    cursorEndColor,
  } = user.profileData.userColors

  return (
    <div
      className="absolute"
      onMouseMove={(e) => handleSelfCursorMove(e)}
      style={{
        top: `${cursorPosition.top + 30}px`,
        left: `${cursorPosition.left}px`,
      }}
    >
      <CursorSvg
        startColor={cursorStartColor}
        endColor={cursorEndColor}
        id={user.connectionId}
      />
      <div
        className={`px-4 py-2 m-2 bg-gradient-to-r ${gradientStartClass} ${gradientEndClass} rounded-full text-sm text-white`}
      >
        {user.profileData.name} (You)
      </div>
    </div>
  )
}

// 💡 This component is used to render the cursors of other users in the space
const MemberCursors = ({
  otherUsers,
  space,
  selfConnectionId,
}: {
  otherUsers: SpaceMember[]
  space?: Space
  selfConnectionId?: string
}) => {
  const [positions, setPositions] = useState<{
    [connectionId: string]: { x: number; y: number }
  }>({})

  useEffect(() => {
    if (!space) return

    const pointer = space.cursors.get('space-pointer')

    pointer.on(
      'cursorUpdate',
      (event: { connectionId: string; position: { x: number; y: number } }) => {
        // 💡 Ignore our own cursor
        if (event.connectionId === selfConnectionId) return

        setPositions((positions) => ({
          ...positions,
          [event.connectionId]: event.position,
        }))
      }
    )
    return () => {
      pointer.off()
    }
  }, [space])

  return (
    <>
      {otherUsers.map(({ connectionId, profileData }) => {
        if (!positions[connectionId]) return
        const {
          cursorStartColor,
          cursorEndColor,
          gradientStartClass,
          gradientEndClass,
        } = profileData.userColors
        return (
          <div
            key={connectionId}
            id={`member-cursor-${connectionId}`}
            className="absolute"
            style={{
              left: `${positions[connectionId].x}px`,
              top: `${positions[connectionId].y}px`,
            }}
          >
            <CursorSvg
              startColor={cursorStartColor}
              endColor={cursorEndColor}
              id={connectionId}
            />
            <div
              className={`px-4 py-2 m-2 bg-gradient-to-r ${gradientStartClass} ${gradientEndClass} rounded-full text-sm text-white member-cursor`}
            >
              {profileData.name}
            </div>
          </div>
        )
      })}
    </>
  )
}

export { MemberCursors, YourCursor }