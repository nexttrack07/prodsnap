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
        meta: {
          ...el.meta,
          dimensions: { width, height }
        },
        attrs: { ...el.attrs, state: ImageState.Normal }
      }));
    }
    if (element.type === 'image') {
      setImageDimensions(element.attrs.url);
    }
  }, [element.type]);

  const { left, top } = element.meta.position;
  const { width, height } = element.meta.dimension;

  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  const handleMouseMove = useCallback((p: Draggable) => {
    setElement((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        position: {
          left: p.x + prev.meta.position.left,
          top: p.y + prev.meta.position.top
        }
      }
    }));
  }, []);

  const handleResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => {
      let newX = prev.meta.position.left + x;
      let newY = prev.meta.position.top + y;
      let newWidth = prev.meta.dimension.width + width;
      let newHeight = prev.meta.dimension.height + height;

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
        style={{ width: element.meta.dimension.width, height: element.meta.dimension.height }}
        src={element.attrs.url}
        crop={handleCrop}
      />
    </Box>
  );
}
