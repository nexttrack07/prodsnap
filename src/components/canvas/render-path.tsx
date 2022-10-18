import { SetStateAction } from "jotai";
import { CanvasElement, MoveableElement, SVGPathType } from "./store";

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
};

export function RenderPath({ element }: Props) {
  return (
    <>
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(element.width, element.height)}
      >
        <path
          {...element.path}
          d={element.getPath(element.width, element.height)}
        />
      </svg>
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(element.width, element.height)}
      >
        <clipPath id={element.strokeProps.clipPathId}>
          <path d={element.getPath(element.width, element.height)} />
        </clipPath>
        <path
          d={element.getPath(element.width, element.height)}
          stroke={element.strokeProps.stroke}
          strokeWidth={element.strokeProps.strokeWidth}
          strokeLinecap={element.strokeProps.strokeLinecap}
          strokeDasharray={element.strokeProps.strokeDasharray}
          clipPath={element.strokeProps.clipPathId}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  );
}
