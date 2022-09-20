import React, { useCallback } from "react";
import { Box, useMantineTheme } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { createElement, ReactNode } from "react";
import {
  elementsAtom,
  ElementType,
  selectedElementsAtom,
  SVGType,
} from "./store";
import { Moveable, MoveableItem } from "../moveable";

export function Canvas() {
  const elements = useAtomValue(elementsAtom);

  return (
    <Box
      sx={(theme) => ({
        width: 1000,
        height: 800,
        border: `1px solid ${theme.colors.gray[3]}`,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
        position: "relative",
      })}
    >
      {elements.map((elAtom, i) => (
        <Element i={i} key={i} elementAtom={elAtom} />
      ))}
    </Box>
  );
}

export function renderElement(item: SVGType, i: number): ReactNode {
  const { name: tag, attributes: props, children } = item;

  return createElement(
    tag,
    { ...props, key: i },
    children?.map((c, i) => renderElement(c, i))
  );
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
  const theme = useMantineTheme();

  const handleElementSelect = () => {
    setSelectedElements((items) => {
      if (items.includes(i)) {
        return items;
      }
      return items.concat(i);
    });
  };

  const handleMoveElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        attributes: {
          ...el.attributes,
          left: d.x + el.attributes.left,
          top: d.y + el.attributes.top,
        },
      }));
    },
    [setElement]
  );

  const handleResizeElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        attributes: {
          ...el.attributes,
          width: d.x + el.attributes.width,
          height: d.y + el.attributes.height,
        },
      }));
    },
    [setElement]
  );

  const { width, height, left, top } = element.attributes;

  return (
    <span
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={handleElementSelect}
    >
      <svg width={width * .95} height={height * .95}>{element.children?.map(renderElement)}</svg>
      {isSelected && (
        <Moveable>
          <MoveableItem onMove={handleMoveElement}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                border: "1px dashed",
                borderColor: theme.colors.blue[6],
              }}
              className="border border-dashed border-blue-500"
              onClick={(e) => e.stopPropagation()}
            ></div>
          </MoveableItem>
          <MoveableItem onMove={handleResizeElement}>
            <span
              style={{
                height: 10,
                width: 10,
                cursor: "se-resize",
                borderRadius: "100%",
                transform: "translate(50%, 50%)",
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                boxShadow: "0 0 1px rgba(0,0,0,0.4)",
                border: "1px solid rgba(0,0,0,0.3)"
              }}
            // className="h-6 w-6 cursor-se-resize rounded translate-x-1/4 translate-y-1/4 border-8 border-l-0 border-t-0 border-blue-500 absolute bottom-0 right-0" 
            />
          </MoveableItem>
        </Moveable>
      )}
    </span>
  );
}
