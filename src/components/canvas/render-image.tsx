import React, { useEffect, useState } from 'react';
import { SetStateAction } from "jotai";
import { CanvasElement, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from 'utils';
import { Center, Loader, Image } from '@mantine/core';

export function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
}) {
  const [loading, setLoading] = useState(true);
  const { width, height, x, y } = element;

  useEffect(() => {
    async function setImageDimensions(src: string) {
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height,
      }));
      setLoading(false);
    }
    if (element.type === "image") {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  return (
    <Center sx={{ width, height, left: x, top: y, border: "1px solid blue" }}>
      {loading ? (
        <Loader />
      ) : (
        <Image width={width} height={height} src={element.url} />
      )}
    </Center>
  );
}
