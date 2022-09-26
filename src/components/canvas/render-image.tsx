import React, { useEffect, useState } from 'react';
import { SetStateAction } from "jotai";
import { CanvasElement, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from '../../utils';
import { Center, Loader, Image } from '@mantine/core';

export function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
}) {
  const { width, height, x, y } = element;

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
      ) : (
        <Image width={width} height={height} src={element.url} />
      )}
    </Center>
  );
}
