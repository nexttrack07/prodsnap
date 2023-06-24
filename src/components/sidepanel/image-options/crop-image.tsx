import React from 'react';
import { cropperAtom } from '@/components/canvas/render-image/render-image';
import {
  circleCropAtom,
  ImageState,
  isCroppingAtom,
  selectedImageAtom,
  sidepanelAtom,
  imageStateAtom
} from '@/components/canvas/store';
import { Group, SegmentedControl, Button, ActionIcon } from '@mantine/core';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Check, Circle, Crop, Rectangle, X } from 'tabler-icons-react';

export const ImageCropper = () => {
  const [sidepanel, setSidepanel] = useAtom(sidepanelAtom);
  const imageState = useAtomValue(imageStateAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [circleCrop, setCircleCrop] = useAtom(circleCropAtom);
  const cropper = useAtomValue(cropperAtom);
  const setIsCropping = useSetAtom(isCroppingAtom);

  if (!selectedImage) {
    return null;
  }

  const handleCropDone = () => {
    if (cropper) {
      setSelectedImage({
        currentUrl: circleCrop
          ? getRoundedCanvas(cropper.getCroppedCanvas()).toDataURL()
          : cropper.getCroppedCanvas().toDataURL(),
        state: ImageState.Normal
      });
      setIsCropping(false);

      return;
    }
    setSelectedImage({
      state: ImageState.Normal
    });
    setIsCropping(false);
  };

  const handleCropCancel = () => {
    setSelectedImage({
      state: ImageState.Normal,
      currentUrl: selectedImage.url
    });
    setIsCropping(false);
  };

  const handleCropImage = () => {
    setSelectedImage({
      state: ImageState.Cropping,
      mask: selectedImage.mask ? selectedImage.mask : { id: 'circle', x: 200, y: 200 }
    });
    setIsCropping(true);
  };

  return (
    <Group>
      {imageState === ImageState.Normal && (
        <Button size="md" leftIcon={<Crop />} fullWidth variant="outline" onClick={handleCropImage}>
          Crop
        </Button>
      )}
      {imageState === ImageState.Cropping && (
        <>
          <SegmentedControl
            color="indigo"
            size="xs"
            defaultValue={circleCrop ? 'circle' : 'rectangle'}
            onChange={(val) => setCircleCrop(val === 'circle')}
            data={[
              { label: <Circle />, value: 'circle' },
              { label: <Rectangle />, value: 'rectangle' }
            ]}
          />
          <ActionIcon onClick={handleCropCancel} color="red">
            <X />
          </ActionIcon>
          <ActionIcon onClick={handleCropDone} color="green">
            <Check />
          </ActionIcon>
        </>
      )}
    </Group>
  );
};

function getRoundedCanvas(sourceCanvas: HTMLCanvasElement) {
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  let width = sourceCanvas.width;
  let height = sourceCanvas.height;

  canvas.width = width;
  canvas.height = height;
  if (context) {
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
    context.fill();
  }
  return canvas;
}
