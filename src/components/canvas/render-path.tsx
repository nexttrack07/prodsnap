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

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function RenderPath({ element, onSelect, setElement, isSelected }: Props) {
  const { x, y, width, height } = element;
  const canvasProps = useAtomValue(canvasAtom);

  const handleMouseMove = useCallback(
    (p: Draggable) => {
      setElement((el) => {
        return {
          ...el,
          x: p.x + el.x,
          y: p.y + el.y
        };
      });
    },
    [setElement]
  );

  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => ({
      ...prev,
      x: prev.x + x,
      y: prev.y + y,
      width: prev.width + width,
      height: prev.height + height
    }));
  };

  return (
    <DragHandler
      onClick={handleClick}
      position={{ x, y }}
      dimension={{ width, height }}
      onMove={handleMouseMove}
    >
      <svg opacity={element.opacity} {...element.props} viewBox={element.getViewBox(width, height)}>
        <path {...element.path} d={element.getPath(width, height)} />
      </svg>
      <svg opacity={element.opacity} {...element.props} viewBox={element.getViewBox(width, height)}>
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
      {isSelected && <ResizeHandler dimension={{ width, height }} onResize={handleResize} />}
    </DragHandler>
  );
}
