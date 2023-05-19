import { Dimension, Image } from '@/stores/elements';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Box } from '@mantine/core';
import { circleCropAtom } from '@/components/canvas/store';

export const cropperAtom = atom<Cropper | null>(null);

export function CropImage({ element }: { element: Image & Dimension }) {
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
