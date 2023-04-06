import React, { useCallback } from 'react';
import {
  canvasAtom,
  CanvasElement,
  Draggable,
  Resizable,
  SVGType
} from '@/components/canvas/store';
import { SetStateAction, useAtomValue } from 'jotai';
import { createSVGElement } from '../sidepanel/graphics-panel';
import { calculatePosition, SNAP_TOLERANCE } from '@/utils';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';

type Props = {
  element: SVGType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};

export function RenderSVG({ element, setElement, onSelect, isSelected }: Props) {
  const { x, y, width, height } = element;
  const component = createSVGElement(element.graphic);
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e);
  };

  return (
    <DragHandler
      onClick={handleClick}
      position={{ x, y }}
      dimension={{ width, height }}
      onMove={handleMouseMove}
      hide={!isSelected}
    >
      {component}
      <ResizeHandler
        withBMResize={false}
        withLMResize={false}
        withRMResize={false}
        withTMResize={false}
        show={isSelected}
        dimension={{ width, height }}
        onResize={handleResize}
      />
    </DragHandler>
  );
}
