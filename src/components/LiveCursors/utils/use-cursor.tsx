import { Space } from '@ably-labs/spaces'
import { useEffect } from 'react'

// 💡 This hook is used to get the cursor position of the user and update the cursor position in the space
const useCursor = (
  setCursorPosition: ({ left, top }: { left: number; top: number }) => void,
  space?: Space
) => {
  let handleSelfCursorMove: (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void = () => {}

  useEffect(() => {
    if (!space) return

    // 💡 The pointer gets all the cursors in the space
    const pointer = space.cursors.get('space-pointer')

    // 💡 This function is used to update the cursor position in the space
    const handleSelfCursorMove = (e: MouseEvent) => {
      setCursorPosition({ left: e.clientX, top: e.clientY })
      pointer.set({ position: { x: e.clientX, y: e.clientY } })
    }
    window.addEventListener('mousemove', handleSelfCursorMove)
    return () => {
      window.removeEventListener('mousemove', handleSelfCursorMove)
    }
  }, [space])
  return handleSelfCursorMove
}

export default useCursor
