import React from "react";
import { Box } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { createElement, ReactNode } from "react";
import {
  CanvasElement,
  elementByIdAtom,
  elementListAtom,
  ElementType,
  selectedElementListAtom,
  SVGType,
} from "./store";
import { RenderImage } from "./render-image";
import { RenderSvg } from "./render-svg";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import { RenderPath } from "./render-path";
import { RenderLine } from "./render-line";
import { SelectHandler } from "./select-handler";

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementListAtom, []);
});

export function Canvas() {
  const elements = useAtomValue(elementListAtom);
  const elementById = useAtomValue(elementByIdAtom);
  const unSelectAllElements = useSetAtom(unSelectAllAtom);
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
      onClick={unSelectAllElements}
    >
      {elements.map(id => (
        <Element i={id} key={id} elementAtom={elementById[id]} />
      ))}
      <SelectHandler />
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

const isSelectedAtom = atomFamily((id: number) =>
  atom((get) => {
    const selectedElements = get(selectedElementListAtom);
    return selectedElements.includes(id);
  })
);

const elementCompMap: Record<CanvasElement["type"], React.FC<any>> = {
  svg: RenderSvg,
  image: RenderImage,
  text: RenderText,
  "svg-path": RenderPath,
  "svg-line": RenderLine,
};

function Element({ elementAtom, i }: { elementAtom: ElementType; i: number }) {
  const [element, setElement] = useAtom(elementAtom);
  const setSelectedElements = useSetAtom(selectedElementListAtom);
  const isSelected = useAtomValue(isSelectedAtom(i));
  const isShiftPressed = useKeyPress("Shift");

  const handleElementSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElements((items) => {
      if (isShiftPressed) {
        return items.includes(i) ? items : items.concat(i);
      } else {
        return [i];
      }
    });
  };

  const Comp = elementCompMap[element.type];

  return (
    <span
      style={{
        left: element.x,
        top: element.y,
        position: "absolute",
        width: element.width,
        height: element.height
      }}
      onClick={handleElementSelect}
    >
      <Comp element={element} setElement={setElement} isSelected={isSelected} />
    </span>
  );
}
