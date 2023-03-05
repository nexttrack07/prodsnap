import { SetStateAction, useCallback } from "react";
import { CanvasElement, MoveableElement, SVGType } from "./store";
import { renderElement } from ".";
import { Box } from "@mantine/core";

export function RenderSvg({
  element
}: {
  element: MoveableElement & SVGType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
}) {
  const { x, y, width, height } = element;


  return (
    <Box sx={{
      width,
      height,
      left: x,
      top: y,
      position: 'absolute'
    }}>
      <svg width={width} height={height} {...element.props}>
        {element.elements?.map(renderElement)}
      </svg>
    </Box>
  );
}
