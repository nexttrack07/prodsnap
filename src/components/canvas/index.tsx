import React from "react";
import { Box, useMantineTheme } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily, useAtomCallback } from "jotai/utils";
import { createElement, ReactNode } from "react";
import {
  CanvasElement,
  ElementGroupType,
  elementsAtom,
  ElementType,
  selectedElementsAtom,
  SVGType,
} from "./store";
import { RenderImage } from "./render-image";
import { RenderSvg } from "./render-svg";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import { RenderPath } from "./render-path";
import { RenderLine } from "./render-line";
import { Moveable, MoveableItem } from "../moveable";

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementsAtom, []);
});

export function Canvas() {
  const elementGroups = useAtomValue(elementsAtom);
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
      {elementGroups.map((elementGroupAtom, i) => (
        <ElementGroup i={i} key={i} elementGroupAtom={elementGroupAtom} />
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

const isSelectedAtom = atomFamily((id: number) =>
  atom((get) => {
    const selectedElements = get(selectedElementsAtom);
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


const groupedAtom = atomFamily((i: number) => atom(
  null,
  (get, set, update: { x: number; y: number }) => {
    const elementGroups = get(elementsAtom);
    const elementGroup = elementGroups[i];
    set(elementGroup, items => items.map(item => {
      set(item, item => ({
        ...item,
        x: item.x + update.x,
        y: item.y + update.y
      }))
      return item;
    }))
  }
))

function ElementGroup({
  elementGroupAtom,
  i,
}: {
  elementGroupAtom: ElementGroupType;
  i: number;
}) {
  const theme = useMantineTheme();

  const handleMoveElement = useAtomCallback(
    React.useCallback(
    (get, set, d: { x: number; y: number }) => {
      set(groupedAtom(i), (els) => els.map(el => ({
        ...el,
        x: d.x + el.x,
        y: d.y + el.y,
      })));
    },
    [setElementGroup]
  ))

  return (
    <div>
      <Moveable>
        {elementGroup.map((elementAtom, i) => (
          <MoveableItem onMove={handleMoveElement}>
            <div
              style={{
                borderWidth: 3,
                borderStyle: "solid",
                borderColor: theme.colors.blue[6],
                userSelect: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Element elementAtom={elementAtom} i={i} />
            </div>
          </MoveableItem>
        ))}
      </Moveable>
    </div>
  );
}

function Element({ elementAtom, i }: { elementAtom: ElementType; i: number }) {
  const [element, setElement] = useAtom(elementAtom);
  const setSelectedElements = useSetAtom(selectedElementsAtom);
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleElementSelect}
    >
      <Comp element={element} setElement={setElement} isSelected={isSelected} />
    </span>
  );
}
