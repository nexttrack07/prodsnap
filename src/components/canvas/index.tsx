import React from "react";
import { Box } from "@mantine/core";
import { createElement, ReactNode } from "react";
import { SVGType } from "./store";
import { RenderImage } from "./render-image";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  Element,
  elementsState,
  elementState,
  isElementSelectedState,
  selectedElementIdsState,
  activeElementState,
} from "./element.store";
import { RenderPath } from "./render-path";

export function Canvas() {
  const elements = useRecoilValue(elementsState);

  return (
    <Box
      id="canvas"
      sx={(theme) => ({
        width: 1100,
        height: 700,
        border: `1px solid ${theme.colors.gray[3]}`,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
        position: "relative",
        backgroundColor: "white",
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

  return (
    <Comp element={element} setElement={setElement} id={i} />
  );
}
