import React, { useEffect, useCallback, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { atom, SetStateAction, useAtomValue, useSetAtom } from 'jotai';
import {
  canvasAtom,
  CanvasElement,
  Draggable,
  ImageState,
  ImageType,
  MoveableElement,
  Resizable
} from './store';
import { getImageDimensions } from '../../utils';
import { Center, Box, Image, LoadingOverlay, useMantineTheme } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import { circleCropAtom } from '../../components/toolbar/image-toolbar';
import { IImage } from './types';
import { DragHandler } from './drag-handler';
import { ResizeHandler } from './resize-handler';

export const cropperAtom = atom<Cropper | null>(null);

type Status = 'none' | 'rotate' | 'move' | 'resize-br' | 'resize-tl' | 'resize-bl' | 'resize-tr';

export function RenderImage({
  element,
  setElement,
  onSelect,
  isSelected
}: {
  element: IImage;
  setElement: (update: SetStateAction<IImage>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, attrs: { ...el.attrs, state: ImageState.Loading } }));
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height,
        attrs: { ...el.attrs, state: ImageState.Normal }
      }));
    }
    if (element.type === 'image') {
      setImageDimensions(element.attrs.url);
    }
  }, [element.type]);

  const { left, top, width, height } = element;

  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  const handleMouseMove = useCallback((p: Draggable) => {
    setElement((prev) => ({
      ...prev,
      left: p.x + prev.left,
      top: p.y + prev.top
    }));
  }, []);

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => {
      let newX = prev.left + x;
      let newY = prev.top + y;
      let newWidth = prev.width + width;
      let newHeight = prev.height + height;

      return {
        ...prev,
        left: newX,
        top: newY,
        width: newWidth,
        height: newHeight
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
      <LoadingOverlay
        overlayOpacity={0.2}
        overlayColor="black"
        visible={element.attrs.state === ImageState.Loading}
        loaderProps={{ size: 'lg', variant: 'dots' }}
      />
      {element.attrs.state === ImageState.Normal && (
        <>
          <Image
            style={{ userSelect: 'none', pointerEvents: 'none' }}
            width={width}
            height={height}
            src={element.attrs.currentUrl ?? element.attrs.url}
          />
        </>
      )}
      {isSelected && <ResizeHandler dimension={{ width, height }} onResize={handleResize} />}

      {element.attrs.state === ImageState.Cropping && <CropImage element={element} />}
    </DragHandler>
  );
}

export function CropImage({ element }: { element: IImage }) {
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
    <Box
      sx={() =>
        circleCrop
          ? {
              '& .cropper-view-box': {
                borderRadius: '50%',
                outline: 0,
                boxShadow: '0 0 0 1px #39f'
              },
              '& .cropper-face': {
                borderRadius: '50%'
              }
            }
          : {}
      }
    >
      <Cropper
        ref={cropperRef}
        style={{ width: element.width, height: element.height }}
        src={element.attrs.url}
        crop={handleCrop}
      />
    </Box>
  );
}
