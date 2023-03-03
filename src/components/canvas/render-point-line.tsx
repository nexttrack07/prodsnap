import { SetStateAction, useAtom } from "jotai";
import { useRef, useState } from "react";
import useEventListener from "../../utils/use-event";
import { CanvasElement, MoveableElement, SVGPointLine } from "./store";

type SVGCanvasElement = MoveableElement & SVGPointLine;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
};

export function RenderPointLine({ element }: Props) {
  const [p1, setP1] = useAtom(element.p1);
  const [p2, setP2] = useAtom(element.p2);
  const documentRef = useRef<Document>(document);
  const [isMoving, setIsMoving] = useState(false);
  const handlePointClick: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.stopPropagation();
    console.log('circle clicked')
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMoving(true);
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMoving(false);
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.stopPropagation();
    if (isMoving) {
      console.log('moving...')
      setP1(el => ({ ...el, x: e.movementX + el.x, y: e.movementY + el.y }));
    }
  }

  useEventListener("pointerup", handleMouseUp, documentRef);
  useEventListener("pointermove", handleMouseMove, documentRef, [isMoving]);
  return (
    <>
      <svg
        onClick={handlePointClick}
        onMouseDown={handleMouseDown}
        opacity={element.opacity}
        style={{
          position: 'absolute',
          left: p1.x,
          top: p1.y,
        }}
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
      <svg>
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="black" strokeWidth={element.stroke} />
      </svg>
      <svg
        opacity={element.opacity}
        style={{
          position: 'absolute',
          left: p2.x,
          top: p2.y,
        }}
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
    </>
  );
}
