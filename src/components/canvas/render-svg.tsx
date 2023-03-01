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
    </>
  );
}
