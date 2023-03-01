import { SetStateAction } from "jotai";
import { CanvasElement, MoveableElement, SVGPointLine } from "./store";

type SVGCanvasElement = MoveableElement & SVGPointLine;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
};

export function RenderPointLine({ element }: Props) {
  return (
    <>
      <svg
        opacity={element.opacity}
        style={{
          position: 'absolute',
          left: element.p1.x,
          top: element.p1.y,
        }}
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
      <svg>
        <line x1={element.p1.x} y1={element.p1.y} x2={element.p2.x} y2={element.p2.y} stroke="black" strokeWidth={element.stroke} />
      </svg>
      <svg
        opacity={element.opacity}
        style={{
          position: 'absolute',
          left: element.p2.x,
          top: element.p2.y,
        }}
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
    </>
  );
}
