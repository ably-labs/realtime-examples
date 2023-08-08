import { Space } from "@ably-labs/spaces";
import { useEffect } from "react";

// 💡 This hook is used to get the cursor position of the user and update the cursor position in the space
const useCursor = (
  setCursorPosition: ({ left, top }: { left: number; top: number }) => void,
  parentRef: React.RefObject<HTMLDivElement>,
  space?: Space,
) => {
  let handleSelfCursorMove: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => void = () => {};

  useEffect(() => {
    if (!space) return;

    // 💡 The pointer gets all the cursors in the space
    const pointer = space.cursors.get("space-pointer");

    // 💡 This function is used to update the cursor position in the space
    const handleSelfCursorMove = (e: MouseEvent) => {
      const liveCursorsDiv = parentRef.current;
      const bounds = liveCursorsDiv?.getBoundingClientRect();
      if (!bounds) return;
      let relativeLeftPosition = e.clientX - bounds.left;
      let relativeTopPosition = e.clientY - bounds.top;
      if (e.clientX < bounds.left) relativeLeftPosition = -100;
      if (e.clientX > bounds.right) relativeLeftPosition = bounds.right;
      if (e.clientY < bounds.top) relativeTopPosition = -100;
      if (e.clientY > bounds.bottom) relativeTopPosition = bounds.bottom;

      setCursorPosition({
        left: relativeLeftPosition,
        top: relativeTopPosition,
      });
      pointer.set({
        position: { x: relativeLeftPosition, y: relativeTopPosition },
      });
    };
    window.addEventListener("mousemove", handleSelfCursorMove);
    return () => {
      window.removeEventListener("mousemove", handleSelfCursorMove);
    };
  }, [space]);
  return handleSelfCursorMove;
};

export default useCursor;
