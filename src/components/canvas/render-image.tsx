import React, { useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { atom, SetStateAction, useAtom, useSetAtom } from "jotai";
import { ImageState, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from "../../utils";
import { Center, Image, Loader } from "@mantine/core";
import "react-image-crop/dist/ReactCrop.css";

export const cropperAtom = atom<Cropper | null>(null);

export function RenderImage({
  element,
  setElement,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<MoveableElement & ImageType>) => void;
}) {
  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, state: ImageState.Loading }));
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height,
      }));
      setElement((el) => ({ ...el, state: ImageState.Normal }));
    }
    if (element.type === "image") {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  const { width, height, x, y } = element;

  return (
    <Center sx={{ left: x, top: y }}>
      {element.state === ImageState.Loading && <Loader></Loader>}
      {element.state === ImageState.Normal && (
        <Image width={width} height={height} src={element.url} />
      )}
      {element.state === ImageState.Cropping && <CropImage element={element} />}
    </Center>
  );
}

export function CropImage({
  element,
}: {
  element: ImageType & MoveableElement;
}) {
  const cropperRef = useRef<HTMLImageElement>(null);
  const setCropper = useSetAtom(cropperAtom);

  const handleCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      setCropper(cropper);
    }
  };

  return (
    <Cropper
      id="image"
      ref={cropperRef}
      style={{ width: element.width, height: element.height }}
      src={element.url}
      crop={handleCrop}
    />
  );
}
