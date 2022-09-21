import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { Box, Center, Image, Loader, useMantineTheme } from "@mantine/core";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { createElement, ReactNode } from "react";
import {
  CanvasElement,
  elementsAtom,
  ElementType,
  ImageType,
  MoveableElement,
  selectedElementsAtom,
  SVGType,
} from "./store";
import { Moveable, MoveableItem } from "../moveable";
import { getImageDimensions } from "../../utils";

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
        x: d.x + el.x,
        y: d.y + el.y,
      }));
    },
    [setElement]
  );

  const handleResizeElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        width: d.x + el.width,
        height: d.y + el.height,
      }));
    },
    [setElement]
  );

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
        <svg
          preserveAspectRatio="xMaxYMax"
          width={width * 0.9}
          height={height * 0.9}
        >
          {element.elements?.map(renderElement)}
        </svg>
      )}
      {element.type === "image" && (
        <RenderImage element={element} setElement={setElement} />
      )}
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
                borderWidth: 2,
                borderStyle: "dashed",
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
                border: "1px solid rgba(0,0,0,0.3)",
              }}
            // className="h-6 w-6 cursor-se-resize rounded translate-x-1/4 translate-y-1/4 border-8 border-l-0 border-t-0 border-blue-500 absolute bottom-0 right-0"
            />
          </MoveableItem>
        </Moveable>
      )}
    </span>
  );
}

function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
}) {
  const [loading, setLoading] = useState(true);
  const { width, height, x, y } = element;

  useEffect(() => {
    async function setImageDimensions(src: string) {
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height,
      }));
      setLoading(false);
    }
    if (element.type === "image") {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  return (
    <Center sx={{ width, height, left: x, top: y, border: "1px solid blue" }}>
      {loading ? (
        <Loader />
      ) : (
        <Image width={width} height={height} src={element.url} />
      )}
    </Center>
  );
}
