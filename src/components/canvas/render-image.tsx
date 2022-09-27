import React, { useEffect, useRef, useState } from 'react';
import { SetStateAction } from "jotai";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop"
import { CanvasElement, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from '../../utils';
import { Center, Loader, Image, Box } from '@mantine/core';

import 'react-image-crop/dist/ReactCrop.css'

enum ImageState {
  Cropping,
  Normal
}

export function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
}) {
  const { width, height, x, y } = element;
  const [imageState, setImageState] = useState<ImageState>(ImageState.Cropping)
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement(el => ({ ...el, loading: true }));
      const { width, height } = await getImageDimensions(src, 400, 400);
      setElement((el) => ({
        ...el,
        width,
        height,
      }));
      setElement(el => ({ ...el, loading: false }));
    }
    if (element.type === "image") {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  return (
    <Center sx={{ width, height, left: x, top: y }}>
      {element.loading ? (
        <Loader />
      ) : imageState === ImageState.Normal ? (
        <svg width={width} height={height}>
          <defs>
            <clipPath id="svgPath">
              <circle id="circleClip" stroke="#000000" strokeWidth={2} fill="none" cx="50%" cy="50%" r="45%" />
            </clipPath>
          </defs>
          <use xlinkHref="#circleClip" />
          <image xlinkHref={element.url} height={height} width={width} style={{ clipPath: "url(#svgPath)" }} />
        </svg>
      ) : (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={c => setCompletedCrop(c)}
        >
          <img onMouseDown={e => e.stopPropagation()} ref={imgRef} src={element.url} />
        </ReactCrop>
      )}
    </Center>
  );
}
