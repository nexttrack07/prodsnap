import React, { useEffect, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { atom, SetStateAction, useAtomValue, useSetAtom } from 'jotai';
import {
  CanvasElement,
  ImageState,
  ImageType,
  MoveableElement,
  canvasAtom,
  circleCropAtom
} from '../store';
import { getImageDimensions, uuid } from '../../../utils';
import { Box, LoadingOverlay } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import { RenderBorder } from './render-border';

export const cropperAtom = atom<Cropper | null>(null);

export function RenderImage({
  element,
  setElement
}: {
  element: ImageType;
  setElement: (update: SetStateAction<CanvasElement>) => void;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const canvasProps = useAtomValue(canvasAtom);
  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, state: ImageState.Loading }));

      try {
        const { width, height } = await getImageDimensions(
          src,
          canvasProps.width - 200,
          canvasProps.height - 200
        );
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

  const { width, height, rotation, x, y } = element;
  const id = uuid();
  const s = element.border.strokeWidth;

  return (
    <>
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
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width,
              height,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
            enableBackground={`new ${-s} ${-s} ${width + s * 2} ${height + s * 2}`}
          >
            <defs>
              <clipPath id={id}>
                <RenderBorder width={width} height={height} border={element.border} uid={id} />
              </clipPath>
            </defs>
          </svg>
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
            viewBox={`${-s} ${-s} ${width + s * 2} ${height + s * 2}`}
          >
            {element.mask && (
              <mask id="svgmask1">
                <circle
                  fill="#ffffff"
                  cx={element.mask.x}
                  cy={element.mask.y}
                  r={element.mask.width / 2}
                ></circle>
              </mask>
            )}
            <image
              clipPath={id}
              preserveAspectRatio="xMidYMid slice"
              href={element.currentUrl ?? element.url}
              width={width}
              height={height}
              mask="url(#svgmask1)"
            />
            <use href={`#${element.border.id}-${id}`} />
          </svg>
        </>
      )}
      {element.state === ImageState.Cropping && null}
    </>
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
