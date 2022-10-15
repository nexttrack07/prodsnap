import {SetStateAction } from "react";
import { Element, ShapeType } from "./element.store";


type Props = {
  element: ShapeType;
  setElement: (update: SetStateAction<Element>) => void;
  isSelected: boolean;
};
export function RenderPath({ element }: Props) {
  return (
    <div style={{ width: element.width, height: element.height }}>
      <svg {...element.props}>
        <path {...element.path} />
      </svg>
      <svg {...element.props}>
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
    </div>
  );
}
