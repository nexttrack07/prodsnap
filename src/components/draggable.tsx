import useEventListener from "../utils/use-event";
import {
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  useCallback,
} from "react";
import { useMantineTheme } from "@mantine/core";

type Position = { x: number; y: number };
type MoveableProps = {
  onDrag: (p: Position) => void;
  styleProps: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
};

export function Draggable({
  onDrag,
  styleProps: { ...styles },
}: MoveableProps) {
  const documentRef = useRef<Document>(document);
  const theme = useMantineTheme();
  const [moving, setMoving] = useState(false);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setMoving(false);
  }, []);

  const handleDragMouseDown = useCallback((e: ReactMouseEvent) => {
    e.stopPropagation();
    setMoving(true);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (moving) {
      onDrag({ x: e.movementX, y: e.movementY });
    }
  };


  useEventListener("pointerup", handleMouseUp, documentRef);
  useEventListener("pointermove", handleMouseMove, documentRef, [moving]);

  return (
    <div
      style={{
        position: "absolute",
        left: styles.left,
        top: styles.top,
        height: styles.height,
        width: styles.width,
        userSelect: "none",
      }}
      id="moveable"
      onMouseDown={handleDragMouseDown}
      onClick={e => e.stopPropagation()}
    >
      <div
        style={{
          position: "absolute",
          border: `4px solid ${theme.colors.teal[8]}`,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          transform: "scale(1.03)",
          borderRadius: 3
        }}>
      </div>
    </div>
  );
}
