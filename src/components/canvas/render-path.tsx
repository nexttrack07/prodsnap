import React from 'react';
import { SetStateAction } from 'jotai';
import { CanvasElement, MoveableElement, SVGPathType } from '@/components/canvas/store';

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  isSelected: boolean;
  isGrouped: boolean;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<CanvasElement>) => void;
};

export function RenderPath({ element }: Props) {
  const {
    x,
    y,
    width,
    height,
    strokeProps: { strokeWidth },
    rotation = 0
  } = element;
  const pathData = scalePathData(element.path.d!, width, height, strokeWidth);

  return (
    <svg
      opacity={element.opacity}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
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
