import React, { useCallback } from 'react';
import { SetStateAction, useAtomValue } from 'jotai';
import {
  canvasAtom,
  CanvasElement,
  Draggable,
  MoveableElement,
  Resizable,
  SVGPathType
} from '@/components/canvas/store';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';
import { calculatePosition, SNAP_TOLERANCE } from '@/utils';
import { RotateHandler } from './rotate-handler';

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function RenderPath({ element, onSelect, setElement, isSelected }: Props) {
  const {
    x,
    y,
    width,
    height,
    strokeProps: { strokeWidth },
    rotation = 0
  } = element;
  const canvasProps = useAtomValue(canvasAtom);

  const handleMouseMove = useCallback(
    (p: Draggable) => {
      setElement((el) => {
        return {
          ...el,
          x: calculatePosition(el.x, p.x, el.width, canvasProps.width, SNAP_TOLERANCE),
          y: calculatePosition(el.y, p.y, el.height, canvasProps.height, SNAP_TOLERANCE)
        };
      });
    },
    [setElement]
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
  };

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => {
      let newX = prev.x + x;
      let newY = prev.y + y;
      let newWidth = prev.width + width;
      let newHeight = prev.height + height;

      if (newX > -SNAP_TOLERANCE && newX < SNAP_TOLERANCE) {
        newX = 0;
      }

      if (newY > -SNAP_TOLERANCE && newY < SNAP_TOLERANCE) {
        newY = 0;
      }

      if (
        newX + newWidth > canvasProps.width - SNAP_TOLERANCE &&
        newX + newWidth < canvasProps.width + SNAP_TOLERANCE
      ) {
        newWidth = canvasProps.width - newX;
      }

      if (
        newY + newHeight > canvasProps.height - SNAP_TOLERANCE &&
        newY + newHeight < canvasProps.height + SNAP_TOLERANCE
      ) {
        newHeight = canvasProps.height - newY;
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    });
  };

  const pathData = scalePathData(element.path.d!, width, height, strokeWidth);

  const handleRotate = (angle: number) => {
    setElement((prev) => {
      return {
        ...prev,
        rotation: angle // + (prev.rotation ?? 0)
      };
    });
  };

  return (
    <DragHandler
      onClick={handleClick}
      position={{ x, y }}
      rotation={rotation}
      dimension={{ width, height }}
      onMove={handleMouseMove}
      hide={!isSelected}
    >
      <svg
        opacity={element.opacity}
        viewBox={`${-strokeWidth} ${-strokeWidth} ${width + strokeWidth}, ${height + strokeWidth}`}
      >
        <clipPath id={element.strokeProps.clipPathId}>
          <path
            d={pathData}
            vectorEffect="non-scaling-stroke"
            stroke="transparent"
            strokeWidth={element.strokeProps.strokeWidth}
          />
        </clipPath>
        <path
          d={pathData}
          stroke={element.strokeProps.stroke}
          strokeWidth={element.strokeProps.strokeWidth}
          strokeLinecap={element.strokeProps.strokeLinecap}
          strokeDasharray={element.strokeProps.strokeDasharray}
          strokeMiterlimit={element.strokeProps.strokeWidth * 2}
          clipPath={element.strokeProps.clipPathId}
          fill={element.props.fill}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ResizeHandler show={isSelected} dimension={{ width, height }} onResize={handleResize} />
      <RotateHandler
        show={isSelected}
        dimension={{ width, height }}
        position={{ x, y }}
        onRotate={handleRotate}
      />
    </DragHandler>
  );
}

type PathCommand =
  | 'M'
  | 'm'
  | 'L'
  | 'l'
  | 'H'
  | 'h'
  | 'V'
  | 'v'
  | 'C'
  | 'c'
  | 'S'
  | 's'
  | 'Q'
  | 'q'
  | 'T'
  | 't'
  | 'A'
  | 'a'
  | 'Z'
  | 'z';

export function scalePathData(
  initialPathData: string,
  width: number,
  height: number,
  strokeWidth: number
): string {
  const pathDataRegex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;

  function parseAndScaleValues(str: string, scaleX: number, scaleY: number): string {
    return str
      .trim()
      .split(/\s*,\s*|\s+/)
      .map((value, index) => {
        const numValue = parseFloat(value);
        return isNaN(numValue)
          ? ''
          : (index % 2 === 0 ? numValue * scaleX : numValue * scaleY).toString();
      })
      .join(' ');
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  initialPathData.replace(pathDataRegex, (_, command: PathCommand, values: string) => {
    const coords = parseAndScaleValues(values, 1, 1).split(' ');
    for (let i = 0; i < coords.length; i += 2) {
      const x = parseFloat(coords[i]);
      const y = parseFloat(coords[i + 1]);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    return '';
  });

  const initialWidth = maxX - minX;
  const initialHeight = maxY - minY;
  const scaleX = (width - strokeWidth) / initialWidth;
  const scaleY = (height - strokeWidth) / initialHeight;

  const newPathData = initialPathData.replace(
    pathDataRegex,
    (_, command: PathCommand, values: string) => {
      const scaledValues = parseAndScaleValues(values, scaleX, scaleY);
      return command + scaledValues;
    }
  );

  return newPathData;
}
