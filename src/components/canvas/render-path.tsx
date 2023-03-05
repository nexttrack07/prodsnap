import { Box } from "@mantine/core";
import { SetStateAction } from "jotai";
import { CanvasElement, MoveableElement, SVGPathType } from "./store";

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function RenderPath({ element, onSelect, isSelected }: Props) {
  const { x, y, width, height } = element;

  return (
    <Box sx={{
      width,
      height,
      left: x,
      top: y,
      position: 'absolute',
    }}
      onClick={onSelect}
    >
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(width, height)}
      >
        <path
          {...element.path}
          d={element.getPath(width, height)}
        />
      </svg>
      <svg
        opacity={element.opacity}
        {...element.props}
        viewBox={element.getViewBox(width, height)}
      >
        <clipPath id={element.strokeProps.clipPathId}>
          <path d={element.getPath(width, height)} />
        </clipPath>
        <path
          d={element.getPath(width, height)}
          stroke={element.strokeProps.stroke}
          strokeWidth={element.strokeProps.strokeWidth}
          strokeLinecap={element.strokeProps.strokeLinecap}
          strokeDasharray={element.strokeProps.strokeDasharray}
          clipPath={element.strokeProps.clipPathId}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  );
}
