import React, { useCallback } from 'react';
import { SetStateAction, useAtomValue } from 'jotai';
import { canvasAtom, Draggable, Resizable } from '@/components/canvas/store';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';
import { IPath } from './types';

type Props = {
  element: IPath;
  setElement: (update: SetStateAction<IPath>) => void;
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
  const { left, top } = element.meta.position;
  const { width, height } = element.meta.dimension;

  const canvasProps = useAtomValue(canvasAtom);

  const handleMouseMove = useCallback(
    (p: Draggable) => {
      setElement((prev) => {
        return {
          ...prev,
          meta: {
            ...prev.meta,
            position: {
              left: getSnap(
                p.x + prev.meta.position.left,
                prev.meta.dimension.width,
                canvasProps.width
              ),
              top: getSnap(
                p.y + prev.meta.position.top,
                prev.meta.dimension.height,
                canvasProps.height
              )
            }
          }
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
      let newX = prev.meta.position.left + x;
      let newY = prev.meta.position.top + y;
      let newWidth = prev.meta.dimension.width + width;
      let newHeight = prev.meta.dimension.height + height;

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
        meta: {
          ...prev.meta,
          position: {
            left: newX,
            top: newY
          },
          dimension: {
            width: newWidth,
            height: newHeight
          }
        }
      };
    });
  };

  return (
    <DragHandler
      onClick={handleClick}
      position={{ x: left, y: top }}
      dimension={{ width, height }}
      onMove={handleMouseMove}
    >
      <svg {...element.attrs.svgElement} viewBox={element.attrs.getViewBox(width, height)}>
        <path {...element.attrs.pathElement} d={element.attrs.getPath(width, height)} />
      </svg>
      <svg {...element.attrs.svgElement} viewBox={element.attrs.getViewBox(width, height)}>
        <clipPath id={element.attrs.clipPathId}>
          <path d={element.attrs.getPath(width, height)} />
        </clipPath>
        <path
          d={element.attrs.getPath(width, height)}
          stroke={element.attrs.pathElement.stroke}
          strokeWidth={element.attrs.pathElement.strokeWidth}
          strokeLinecap={element.attrs.pathElement.strokeLinecap}
          strokeDasharray={element.attrs.pathElement.strokeDasharray}
          clipPath={element.attrs.clipPathId}
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {isSelected && <ResizeHandler dimension={{ width, height }} onResize={handleResize} />}
    </DragHandler>
  );
}
