import React from 'react';
import { MoveableElement, SVGType } from "./store";
import { renderElement } from '.';

export function RenderSvg({
  element,
}: {
  element: MoveableElement & SVGType;
}) {
  const { width, height } = element;

  return (
    <svg
      preserveAspectRatio="xMaxYMax"
      width={width * 0.9}
      height={height * 0.9}
    >
      {element.elements?.map(renderElement)}
    </svg>
  );
}
