import React, { SetStateAction, useState } from "react";
import { Box, useMantineTheme } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { createElement, ReactNode } from "react";
import {
  elementsAtom,
  ElementType,
  MoveableElement,
  selectedElementsAtom,
  SVGLineType,
  SVGType,
} from "./store";
import { RenderImage } from "./render-image";
import { RenderSvg } from "./render-svg";
import { RenderText } from "./render-text";
import { useKeyPress } from "../../utils/use-key-press";
import { RenderPath } from "./render-path";
import { RenderLine } from "./render-line";

const unSelectAllAtom = atom(null, (_get, set) => {
  set(selectedElementsAtom, []);
});

export function Canvas() {
  const elements = useAtomValue(elementsAtom);
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
      {elements.map((elAtom, i) => (
        <Element i={i} key={i} elementAtom={elAtom} />
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

  const { width, height, x, y } = element;

  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleElementSelect}
    >
      {element.type === "svg" && (
        <RenderSvg
          element={element}
          setElement={setElement}
          isSelected={isSelected}
        />
      )}
      {element.type === "svg-path" && (
        <RenderPath
          element={element}
          setElement={setElement}
          isSelected={isSelected}
        />
      )}
      {element.type === "svg-line" && (
        <RenderLine
          element={element}
          setElement={
            setElement as (
              u: SetStateAction<MoveableElement & SVGLineType>
            ) => void
          }
          isSelected={isSelected}
        />
      )}
      {element.type === "image" && (
        <RenderImage
          isSelected={isSelected}
          element={element}
          setElement={setElement}
        />
      )}
      {element.type === "text" && (
        <RenderText
          element={element}
          setElement={setElement}
          isSelected={isSelected}
        />
      )}
    </span>
  );
}
