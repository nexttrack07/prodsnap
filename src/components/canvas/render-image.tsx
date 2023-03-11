import React, { useEffect, useCallback, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { atom, SetStateAction, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { CanvasElement, ImageState, ImageType, MoveableElement } from './store';
import { getImageDimensions } from '../../utils';
import { Center, Box, Image, Loader, useMantineTheme } from '@mantine/core';
import 'react-image-crop/dist/ReactCrop.css';
import { circleCropAtom } from '../../components/toolbar/image-toolbar';

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
  const [status, setStatus] = useState<Status>('none');
  const lastPos = useRef({ x: 0, y: 0 });
  const theme = useMantineTheme();

  useEffect(() => {
    async function setImageDimensions(src: string) {
      setElement((el) => ({ ...el, state: ImageState.Loading }));
      const { width, height } = await getImageDimensions(src);
      setElement((el) => ({
        ...el,
        width,
        height
      }));
      setElement((el) => ({ ...el, state: ImageState.Normal }));
    }
    if (element.type === 'image') {
      setImageDimensions(element.url);
    }
  }, [element.type]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    lastPos.current = { x: e.clientX, y: e.clientY };
    setStatus('move');
    onSelect(e);
  }, []);

  const handleResizeMouseDown = (e: React.MouseEvent, stat: Status) => {
    e.stopPropagation();
    setStatus(stat);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (status === 'move') {
        const deltaX = e.clientX - lastPos.current.x + element.x;
        const deltaY = e.clientY - lastPos.current.y + element.y;
        setElement((el) => ({ ...el, x: deltaX, y: deltaY }));
      } else if (status === 'resize-br') {
        const newWidth = e.clientX - lastPos.current.x + element.width;
        const newHeight = (newWidth / element.width) * element.height;

        setElement((el) => ({
          ...el,
          width: newWidth,
          height: newHeight
        }));
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      setStatus('none');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [status]);

  const { width, height, x, y } = element;

  return (
    <Center
      onMouseDown={handleMouseDown}
      style={{
        left: x,
        top: y,
        userSelect: 'none',
        position: 'absolute',
        border: isSelected ? `2px solid ${theme.colors.blue[7]}` : '',
        borderRadius: 3
      }}>
      {element.state === ImageState.Loading && <Loader></Loader>}
      {element.state === ImageState.Normal && (
        <>
          {/* <Image width={width} height={height} src={element.currentUrl ?? element.url} /> */}
          <div
            style={{
              width,
              height,
              background: `url(${element.currentUrl ?? element.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          {isSelected && (
            <Box
              onMouseDown={(e) => handleResizeMouseDown(e, 'resize-br')}
              onMouseUp={(e) => e.stopPropagation()}
              component="span"
              onClick={(e) => {
                e.stopPropagation();
              }}
              sx={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: 15,
                width: 15,
                borderRadius: '50%',
                transform: 'translate(50%,50%)',
                backgroundColor: theme.colors.gray[2],
                boxShadow: '0 0 1px rgba(0,0,0,0.4)',
                border: '1px solid rgba(0,0,0,0.3)',
                cursor: 'grab'
              }}
            />
          )}
        </>
      )}
      {element.state === ImageState.Cropping && <CropImage element={element} />}
    </Center>
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
      }>
      <Cropper
        ref={cropperRef}
        style={{ width: element.width, height: element.height }}
        src={element.url}
        crop={handleCrop}
      />
    </Box>
  );
}
