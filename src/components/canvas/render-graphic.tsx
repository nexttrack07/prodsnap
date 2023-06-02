import React, { useEffect } from 'react';
import 'cropperjs/dist/cropper.css';
import { SetStateAction } from 'jotai';
import { CanvasElement, ImageState, SVGGraphicType } from '@/components/canvas/store';
import { getImageDimensions, uuid } from '../../utils';
import 'react-image-crop/dist/ReactCrop.css';

export function RenderGraphic({
  element,
  setElement
}: {
  element: SVGGraphicType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
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

  const { rotation, width, height, x, y } = element;
  const id = uuid();

  return (
    <svg
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center'
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <image
        clipPath={id}
        preserveAspectRatio="xMidYMid slice"
        href={element.url}
        width={width}
        height={height}
      />
    </svg>
  );
}
