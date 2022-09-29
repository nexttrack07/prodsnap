import React, { useEffect, useCallback, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { atom, SetStateAction, useAtom, useAtomValue, useSetAtom } from "jotai";
import { CanvasElement, ImageState, ImageType, MoveableElement } from "./store";
import { getImageDimensions } from "../../utils";
import { Moveable, MoveableItem } from "../moveable";
import { Center, Box, Image, Loader, useMantineTheme } from "@mantine/core";
import "react-image-crop/dist/ReactCrop.css";
import { circleCropAtom } from "../../components/toolbar/image-toolbar";

export const cropperAtom = atom<Cropper | null>(null);

export function RenderImage({
  element,
  setElement,
  isSelected,
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
}) {
  const theme = useMantineTheme();
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

  const handleMoveElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        x: d.x + el.x,
        y: d.y + el.y,
      }));
    },
    [setElement]
  );

  const handleResizeElement = useCallback(
    (d: { x: number; y: number }) => {
      setElement((el) => ({
        ...el,
        width: d.x + el.width,
        height: d.y + el.height,
      }));
    },
    [setElement]
  );


  const { width, height, x, y } = element;

  return (
    <>
      <Center sx={{ left: x, top: y }}>
        {element.state === ImageState.Loading && <Loader></Loader>}
        {element.state === ImageState.Normal && (
          <Image width={width} height={height} src={element.currentUrl ?? element.url} />
        )}
        {element.state === ImageState.Cropping && <CropImage element={element} />}
      </Center>
      {(isSelected && element.state !== ImageState.Cropping) && (
        <Moveable>
          <MoveableItem onMove={handleMoveElement}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                borderWidth: 2,
                borderStyle: "dashed",
                borderColor: theme.colors.blue[6],
              }}
              className="border border-dashed border-blue-500"
              onClick={(e) => e.stopPropagation()}
            ></div>
          </MoveableItem>
          <MoveableItem onMove={handleResizeElement}>
            <span
              style={{
                height: 10,
                width: 10,
                cursor: "se-resize",
                borderRadius: "100%",
                transform: "translate(50%, 50%)",
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                boxShadow: "0 0 1px rgba(0,0,0,0.4)",
                border: "1px solid rgba(0,0,0,0.3)",
              }}
            />
          </MoveableItem>
        </Moveable>
      )}
    </>
  );
}

export function CropImage({
  element,
}: {
  element: ImageType & MoveableElement;
}) {
  const cropperRef = useRef<HTMLImageElement>(null);
  const setCropper = useSetAtom(cropperAtom);
  const circleCrop = useAtomValue(circleCropAtom);

  const handleCrop = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    if (cropper) {
      setCropper(cropper);
    }
  };

  return (
    <Box sx={() => circleCrop ? ({
      '& .cropper-view-box': {
        borderRadius: "50%",
        outline: 0,
        boxShadow: '0 0 0 1px #39f'
      },
      '& .cropper-face': {
        borderRadius: "50%"
      }
    }) : ({})}>
      <Cropper
        ref={cropperRef}
        style={{ width: element.width, height: element.height }}
        src={element.url}
        crop={handleCrop}
      />
    </Box>
  );
}
