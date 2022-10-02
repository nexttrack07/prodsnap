import React, { SetStateAction, useCallback } from "react";
import { CanvasElement, MoveableElement, SVGType } from "./store";
import { renderElement } from ".";
import { Moveable, MoveableItem } from "../moveable";
import { useMantineTheme } from "@mantine/core";

export function RenderSvg({
  element,
  setElement,
  isSelected,
}: {
  element: MoveableElement & SVGType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
}) {
  const { width, height } = element;
  const theme = useMantineTheme();

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
        height: (d.x + el.width) * el.height/el.width
      }));
    },
    [setElement]
  );

  return (
    <>
      <svg width={width} height={height} {...element.props}>
        {element.elements?.map(renderElement)}
      </svg>
      <svg {...element.props}>
        <clipPath id="sample">
          <path d="M0,0L64,0L64,64L0,64L0,0" />
        </clipPath>
        <path
          d="M0,0L64,0L64,64L0,64L0,0"
          stroke="#000"
          strokeWidth="10"
          strokeLinecap="butt"
          clipPath="#sample"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
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
                borderStyle: "solid",
                borderColor: theme.colors.blue[6],
              }}
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
            />
          </MoveableItem>
        </Moveable>
      )}
    </>
  );
}
