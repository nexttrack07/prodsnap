import { SetStateAction, useCallback } from "react";
import { CanvasElement, MoveableElement, SVGType } from "./store";
import { renderElement } from ".";

export function RenderSvg({
  element
}: {
  element: MoveableElement & SVGType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
}) {
  const { width, height } = element;


  return (
    <>
      <svg width={width} height={height} {...element.props}>
        {element.elements?.map(renderElement)}
      </svg>
      <svg {...element.props}>
        <clipPath id="sample">
          <path d="M0,0L64,0L64,64L0,64L0,0" />
        </clipPath>
        <path
          d="M0,0L64,0L64,64L0,64L0,0"
          stroke="#000"
          strokeWidth="10"
          strokeLinecap="butt"
          clipPath="#sample"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </>
  );
}
