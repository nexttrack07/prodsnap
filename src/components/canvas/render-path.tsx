import { useMantineTheme } from "@mantine/core";
import { Moveable, MoveableItem } from "../moveable";
import { SetStateAction } from "jotai";
import { useCallback } from "react";
import { CanvasElement, MoveableElement, SVGPathType } from "./store";

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
};
export function RenderPath({ element, setElement, isSelected }: Props) {
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
        height: ((d.x + el.width) * el.height) / el.width,
      }));
    },
    [setElement]
  );

  console.log('fill: ', element.props.fill, element.props)

  return (
    <>
      <svg opacity={element.opacity} {...element.props}>
        <path {...element.path} />
      </svg>
      <svg opacity={element.opacity} {...element.props}>
        <clipPath id={element.strokeProps.clipPathId}>
          <path d={element.path.d} />
        </clipPath>
        <path
          {...element.path}
          stroke={element.strokeProps.stroke}
          strokeWidth={element.strokeProps.strokeWidth}
          strokeLinecap={element.strokeProps.strokeLinecap}
          strokeDasharray={element.strokeProps.strokeDasharray}
          clipPath={element.strokeProps.clipPathId}
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
                top: -3,
                left: -3,
                bottom: -3,
                right: -3,
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: theme.colors.blue[5],
                borderRadius: "1%",
              }}
              onClick={(e) => e.stopPropagation()}
            ></div>
          </MoveableItem>
          <MoveableItem onMove={handleResizeElement}>
            <span
              style={{
                height: 15,
                width: 15,
                cursor: "se-resize",
                borderRadius: "100%",
                transform: "translate(50%, 50%)",
                position: "absolute",
                bottom: -2,
                right: -2,
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
