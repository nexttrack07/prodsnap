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
      <svg opacity={element.opacity} {...element.props}>
        <path {...element.path} />
      </svg>
      <svg opacity={element.opacity} {...element.props}>
        <clipPath id={element.strokeProps.clipPathId}>
          <path d={element.path.d} />
        </clipPath>
        <path
          {...element.path}
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
