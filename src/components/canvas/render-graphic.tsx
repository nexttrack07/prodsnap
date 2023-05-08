import React, { useEffect, useCallback } from 'react';
import 'cropperjs/dist/cropper.css';
import { SetStateAction, useAtomValue } from 'jotai';
import {
  CanvasElement,
  ImageState,
  Resizable,
  Draggable,
  canvasAtom,
  SVGGraphicType
} from '@/components/canvas/store';
import { calculatePosition, SNAP_TOLERANCE, getImageDimensions, uuid } from '../../utils';
import 'react-image-crop/dist/ReactCrop.css';
import { ResizeHandler } from './resize-handler';
import { DragHandler } from './drag-handler';
import { RotateHandler } from './rotate-handler';

export function RenderGraphic({
  element,
  setElement,
  onSelect,
  isSelected
}: {
  element: SVGGraphicType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const canvasProps = useAtomValue(canvasAtom);

  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, state: ImageState.Loading }));
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height
      }));
      setElement((el) => ({ ...el, state: ImageState.Normal }));
    }
    if (element.type === 'svg-graphic') {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => {
      let newX = prev.x + x;
      let newY = prev.y + y;
      let newWidth = prev.width + width;
      let newHeight = prev.height + height;

      return {
        ...prev,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      };
    });
  };

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
    onSelect(e);
  };

  const { rotation, width, height, x, y } = element;
  const id = uuid();

  return (
    <DragHandler
      position={{ x, y }}
      dimension={{ width, height }}
      rotation={rotation}
      onMove={handleMouseMove}
      onClick={handleClick}
    >
      <svg viewBox={`0 0 ${width} ${height}`}>
        <image
          clipPath={id}
          preserveAspectRatio="xMidYMid slice"
          href={element.url}
          width={width}
          height={height}
        />
      </svg>
      <ResizeHandler
        withBMResize={false}
        withTMResize={false}
        withLMResize={false}
        withRMResize={false}
        show={isSelected}
        dimension={{ width, height }}
        onResize={handleResize}
      />
      <RotateHandler
        show={isSelected}
        dimension={{ width, height }}
        onRotate={(rotation) => setElement((el) => ({ ...el, rotation }))}
        position={{ x, y }}
      />
    </DragHandler>
  );
}
