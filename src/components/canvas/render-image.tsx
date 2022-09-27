import React, { useEffect, useRef, useState } from 'react';
import { SetStateAction } from "jotai";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop"
import { CanvasElement, ImageState, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from '../../utils';
import { Center, Loader, Image, Box } from '@mantine/core';

import 'react-image-crop/dist/ReactCrop.css'

export function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
}) {
  const { width, height, x, y } = element;
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement(el => ({ ...el, state: ImageState.Loading }));
      const { width, height } = await getImageDimensions(src, 400, 400);
      setElement((el) => ({
        ...el,
        width,
        height,
      }));
      setElement(el => ({ ...el, state: ImageState.Normal }));
    }
    if (element.type === "image") {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  return (
    <Center sx={{ width, height, left: x, top: y }}>
      {element.state === ImageState.Loading && <Loader></Loader>}
      {element.state === ImageState.Cropping && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={c => setCompletedCrop(c)}
        >
          <img onMouseDown={e => e.stopPropagation()} ref={imgRef} src={element.url} />
        </ReactCrop>
      )}
      {element.state === ImageState.Normal && (
        <svg width={width} height={height}>
          <defs>
            <clipPath id="svgPath">
              <circle id="circleClip" stroke="#000000" strokeWidth={2} fill="none" cx="50%" cy="50%" r="45%" />
            </clipPath>
          </defs>
          <use xlinkHref="#circleClip" />
          <image xlinkHref={element.url} height={height} width={width} style={{ clipPath: "url(#svgPath)" }} />
        </svg>
      )}
    </Center>
  );
}
