import React from "react";
import { Box } from "@mantine/core";
import { createElement, ReactNode } from "react";
import { SVGType } from "./store";
import { RenderImage } from "./render-image";
import { RenderText } from "./render-text";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import {
  Element,
  elementsState,
  elementState,
  selectedElementIdsState,
  activeElementState,
  canvasPropsState,
} from "./element.store";
import { RenderPath } from "./render-path";

export function Canvas() {
  const elements = useRecoilValue(elementsState);
  const selected = useRecoilValue(activeElementState) === -1;
  const canvasProps = useRecoilValue(canvasPropsState);

  const handleMouseDown = useRecoilCallback(
    ({ set }) =>
      (e: React.MouseEvent) => {
        e.stopPropagation();
        set(selectedElementIdsState, []);
        set(activeElementState, -1);
      },
    []
  );

  return (
    <Box
      id="canvas"
      onMouseDown={handleMouseDown}
      sx={(theme) => ({
        width: canvasProps.width,
        height: canvasProps.height,
        border: selected
          ? `2px solid ${theme.colors.blue[8]}`
          : `1px solid ${theme.colors.gray[3]}`,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
        position: "relative",
        backgroundColor: canvasProps.backgroundColor,
      })}
    >
      {elements.map((i) => (
        <ElementComponent i={i} key={i} />
      ))}
    </Box>
  );
}

export function renderElement(
  item: SVGType["elements"][number],
  i: number
): ReactNode {
  const { tag, props } = item;

  return createElement(tag, { ...props, key: i }, null);
}

const elementCompMap: Record<Element["type"], React.FC<any>> = {
  image: RenderImage,
  text: RenderText,
  shape: RenderPath,
};

function ElementComponent({ i }: { i: number }) {
  const [element, setElement] = useRecoilState(elementState(i));

  const Comp = elementCompMap[element.type];

  return <Comp element={element} setElement={setElement} id={i} />;
}
