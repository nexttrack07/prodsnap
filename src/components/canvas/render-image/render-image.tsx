import React, { useEffect, useCallback, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { atom, SetStateAction, useAtomValue, useSetAtom } from 'jotai';
import {
  CanvasElement,
  ImageState,
  ImageType,
  MoveableElement,
  Resizable,
  Draggable,
  canvasAtom,
  circleCropAtom
} from '../store';
import { calculatePosition, getImageDimensions, SNAP_TOLERANCE, uuid } from '../../../utils';
import { Center, Box, Image, Loader, useMantineTheme, LoadingOverlay } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import { ResizeHandler } from '../resize-handler';
import { DragHandler } from '../drag-handler';
import { RenderBorder } from './render-border';

export const cropperAtom = atom<Cropper | null>(null);

type Status = 'none' | 'rotate' | 'move' | 'resize-br' | 'resize-tl' | 'resize-bl' | 'resize-tr';

export function RenderImage({
  element,
  setElement,
  onSelect,
  isSelected
}: {
  element: MoveableElement & ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const canvasProps = useAtomValue(canvasAtom);

  // useEffect(() => {
  //   async function setImageDimensions(src: string) {
  //     setElement((el) => ({ ...el, state: ImageState.Loading }));
  //     const { width, height } = await getImageDimensions(src);
  //     setElement((el) => ({
  //       ...el,
  //       width,
  //       height
  //     }));
  //     setElement((el) => ({ ...el, state: ImageState.Normal }));
  //   }
  //   if (element.type === 'image') {
  //     setImageDimensions(element.url);
  //   }
  // }, [element.type]);

  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, state: ImageState.Loading }));

      try {
        const { width, height } = await getImageDimensions(src);
        setElement((el) => ({
          ...el,
          width,
          height
        }));
        setElement((el) => ({ ...el, state: ImageState.Normal }));
      } catch (error) {
        console.error('Failed to set image dimensions:', error);
      }
    }

    if (element.type === 'image') {
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

  const { width, height, x, y } = element;
  const id = uuid();
  const s = element.border.strokeWidth;

  return (
    <DragHandler
      position={{ x, y }}
      dimension={{ width, height }}
      onMove={handleMouseMove}
      onClick={handleClick}
    >
      {element.state === ImageState.Loading && (
        <div style={{ width, height, border: '1px solid rgba(0,0,0,.2)', borderRadius: 5 }}>
          <LoadingOverlay visible overlayOpacity={0.1} overlayColor="black" />
        </div>
      )}
      {element.state === ImageState.Normal && (
        <>
          <svg
            x="0"
            y="0"
            xmlSpace="preserve"
            style={{ position: 'absolute' }}
            enableBackground={`new ${-s} ${-s} ${width + s * 2} ${height + s * 2}`}
          >
            <defs>
              <clipPath id={id}>
                <RenderBorder width={width} height={height} border={element.border} uid={id} />
              </clipPath>
            </defs>
          </svg>
          <svg viewBox={`${-s} ${-s} ${width + s * 2} ${height + s * 2}`}>
            <use href={`#${element.border.id}-${id}`} />
            <image
              clipPath={id}
              preserveAspectRatio="xMidYMid slice"
              href={element.currentUrl ?? element.url}
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
        </>
      )}
      {element.state === ImageState.Cropping && <CropImage element={element} />}
    </DragHandler>
  );
}

export function CropImage({ element }: { element: ImageType & MoveableElement }) {
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
        src={element.url}
        crop={handleCrop}
      />
    </Box>
  );
}
