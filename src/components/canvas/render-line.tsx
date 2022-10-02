import { useMantineTheme } from "@mantine/core";
import { Moveable, MoveableItem } from "../moveable";
import { SetStateAction } from "jotai";
import { useCallback } from "react";
import { CanvasElement, MoveableElement, SVGLineType } from "./store";

type SVGLineElement = MoveableElement & SVGLineType;

type Props = {
  element: SVGLineElement;
  setElement: (update: SetStateAction<SVGLineElement>) => void;
  isSelected: boolean;
};
export function RenderLine({ element, setElement, isSelected }: Props) {
  const theme = useMantineTheme();

  const handleEndMove = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        width: el.width + d.x,
        height: el.height + d.y,
        line: {
          ...el.line,
          x2: d.x + +el.line.x2!,
          y2: d.y + +el.line.y2!,
        }
      }));
    },
    [setElement]
  );

  const handleStartMove = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        width: el.width + d.x,
        height: el.height + d.y,
        x: el.x + d.x, 
        y: el.y + d.y, 
      }));
    },
    [setElement]
  );

  return (
    <>
      <svg opacity={element.opacity} {...element.props}>
        <g>
        <line {...element.line} fill="none" />
        </g>
      </svg>
      {isSelected && (
        <Moveable>
          <MoveableItem onMove={handleStartMove}>
            <span
              style={{
                height: 10,
                width: 10,
                cursor: "e-resize",
                borderRadius: "100%",
                transform: `translate(-50%, -50%)`,
                position: "absolute",
                left: 0,
                top: 0,
                backgroundColor: "white",
                boxShadow: "0 0 1px rgba(0,0,0,0.2)",
                border: `1px solid ${theme.colors.blue[4]}`,
              }}
            />
          </MoveableItem>
          <MoveableItem onMove={handleEndMove}>
            <span
              style={{
                height: 10,
                width: 10,
                cursor: "e-resize",
                borderRadius: "100%",
                transform: `translate(-50%, -50%)`,
                position: "absolute",
                left: element.line.x2,
                top: element.line.y2,
                backgroundColor: "white",
                boxShadow: "0 0 1px rgba(0,0,0,0.2)",
                border: `1px solid ${theme.colors.blue[4]}`,
              }}
            />
          </MoveableItem>
        </Moveable>
      )}
    </>
  );
}
