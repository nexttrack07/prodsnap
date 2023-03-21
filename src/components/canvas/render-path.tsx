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
import { AnimatePresence, motion } from 'framer-motion';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';

type SVGCanvasElement = MoveableElement & SVGPathType;

type Props = {
  element: SVGCanvasElement;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

const SNAP_TOLERANCE = 5;

function getSnap(num: number, d = 0, max = 1000) {
  if (num > -SNAP_TOLERANCE && num < SNAP_TOLERANCE) {
    return 0;
  } else if (num + d > max - SNAP_TOLERANCE && num + d < max + SNAP_TOLERANCE) {
    return max - d;
  }

  return num;
}

export function RenderPath({ element, onSelect, setElement, isSelected }: Props) {
  const { x, y, width, height } = element;
  const canvasProps = useAtomValue(canvasAtom);

  const handleMouseMove = useCallback(
    (p: Draggable) => {
      setElement((el) => {
        return {
          ...el,
          x: getSnap(p.x + el.x, el.width, canvasProps.width),
          y: getSnap(p.y + el.y, el.height, canvasProps.height)
        };
      });
    },
    [setElement]
  );

  const handleClick = (e: React.MouseEvent) => {
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

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <DragHandler
          onClick={handleClick}
          position={{ x, y }}
          dimension={{ width, height }}
          onMove={handleMouseMove}
        >
          <svg
            opacity={element.opacity}
            {...element.props}
            viewBox={element.getViewBox(width, height)}
          >
            <path {...element.path} d={element.getPath(width, height)} />
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
          {isSelected && <ResizeHandler dimension={{ width, height }} onResize={handleResize} />}
        </DragHandler>
      </motion.div>
    </AnimatePresence>
  );
}
