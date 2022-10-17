import React from "react";
import { Box } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { createElement, ReactNode } from "react";
import {
  CanvasElement,
  elementAtomsAtom,
  ElementType,
  groupsByIdAtom,
  selectedElementAtomsAtom,
  SVGType,
} from "./store";
import { RenderImage } from "./render-image";
import { RenderSvg } from "./render-svg";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import { RenderPath } from "./render-path";
import { RenderLine } from "./render-line";
import { SelectHandler } from "./select-handler";
import { useShiftKeyPressed } from "../../utils";
import { atomFamily } from "jotai/utils";

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementAtomsAtom, []);
});

export function Canvas() {
  const elementAtoms = useAtomValue(elementAtomsAtom);
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
      {elementAtoms.map((elementAtom) => (
        <Element key={elementAtom.toString()} elementAtom={elementAtom} />
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

const elementCompMap: Record<CanvasElement["type"], React.FC<any>> = {
  svg: RenderSvg,
  image: RenderImage,
  text: RenderText,
  "svg-path": RenderPath,
  "svg-line": RenderLine,
};

const groupFromElementAtom = atomFamily((element: CanvasElement) => atom(
  get => {
    if (!element.group) return null;

    const groupsById = get(groupsByIdAtom);
    return groupsById[element.group];
  }
))

function Element({ elementAtom }: { elementAtom: ElementType }) {
  const [element, setElement] = useAtom(elementAtom);
  const setSelectedElementAtoms = useSetAtom(selectedElementAtomsAtom);
  const atomGroup = useAtomValue(groupFromElementAtom(element));
  const isShiftPressed = useShiftKeyPressed();
  const isSelected = false;

  const handleSelectElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElementAtoms(selectedItems => {
      if (selectedItems.includes(elementAtom)) return selectedItems;
      if (atomGroup) {
        return isShiftPressed ? selectedItems.concat(atomGroup) : atomGroup;
      }
      return isShiftPressed ? selectedItems.concat(elementAtom) : [elementAtom];
    })
  }

  const Comp = elementCompMap[element.type];

  return (
    <span
      style={{
        left: element.x,
        top: element.y,
        position: "absolute",
        width: element.width,
        height: element.height,
      }}
      onClick={handleSelectElement}
    >
      <Comp element={element} setElement={setElement} isSelected={isSelected} />
    </span>
  );
}
