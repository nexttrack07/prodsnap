import React from 'react';
import { ActionIcon, Button, Group, SegmentedControl } from '@mantine/core';
import {
  CanvasElement,
  ImageState,
  ImageType,
  MoveableElement,
  selectedElementAtomsAtom
} from '@/components/canvas/store';
import { httpsCallable } from 'firebase/functions';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { functions } from '@/utils/firebase';
import { Check, Circle, Rectangle, X } from 'tabler-icons-react';
import { cropperAtom } from '@/components/canvas/render-image';

const removeBackground = httpsCallable(functions, 'removeBackground');

const selectedImageAtom = atom(
  (get) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    if (selectedElementAtoms.length === 1) {
      const selectedElement = get(selectedElementAtoms[0]);
      return selectedElement.type === 'image' ? selectedElement : null;
    }

    return null;
  },
  (get, set, update: Partial<MoveableElement & ImageType>) => {
    const selectedElementAtoms = get(selectedElementAtomsAtom);
    if (selectedElementAtoms.length === 1) {
      set(selectedElementAtoms[0], (el) =>
        el.type === 'image'
          ? ({
              ...el,
              ...update
            } as CanvasElement)
          : el
      );
    }
  }
);

const imageUrlAtom = atom((get) => {
  return get(selectedImageAtom)?.url ?? '';
});

const imageStateAtom = atom((get) => {
  return get(selectedImageAtom)?.state ?? ImageState.Normal;
});

export const circleCropAtom = atom(false);

export const imageDimensionsAtom = atom((get) => {
  const image = get(selectedImageAtom);
  if (image) {
    return {
      width: image.width,
      height: image.height
    };
  }

  return { width: 0, height: 0 };
});

export const isCroppingAtom = atom(false);

export function ImageToolbar() {
  const url = useAtomValue(imageUrlAtom);
  const [_, setSelectedImage] = useAtom(selectedImageAtom);
  const imageState = useAtomValue(imageStateAtom);
  const [circleCrop, setCircleCrop] = useAtom(circleCropAtom);
  const cropper = useAtomValue(cropperAtom);
  const setIsCropping = useSetAtom(isCroppingAtom);
  const handleRemoveBg = () => {
    if (url) {
      setSelectedImage({ state: ImageState.Loading });
      removeBackground({ url })
        .then((result) => {
          console.log(result);
        })
        .catch(console.log)
        .finally(() => {
          setSelectedImage({ state: ImageState.Normal });
        });
    }
  };

  const handleCropImage = () => {
    setSelectedImage({ state: ImageState.Cropping });
    setIsCropping(true);
  };

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
      currentUrl: url
    });
    setIsCropping(false);
  };

  return (
    <Group>
      {imageState === ImageState.Normal && (
        <>
          <Button variant="outline" onClick={handleRemoveBg}>
            Remove Background
          </Button>
          <Button variant="outline" onClick={handleCropImage}>
            Crop
          </Button>
        </>
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
}

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
