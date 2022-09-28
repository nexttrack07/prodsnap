import { Button, Group } from '@mantine/core';
import { CanvasElement, elementsAtom, ImageState, ImageType, MoveableElement, selectedElementsAtom } from '../../components/canvas/store';
import { httpsCallable } from 'firebase/functions';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { functions } from '../../utils/firebase';
import { Check, X } from 'tabler-icons-react';
import { cropperAtom } from '../../components/canvas/render-image';

const removeBackground = httpsCallable(functions, 'removeBackground');

const selectedImageAtom = atom(
  get => {
    const selectedElements = get(selectedElementsAtom);
    const elements = selectedElements.map(id => get(elementsAtom)[id]);

    const el = get(elements[0]);
    if (elements.length === 1 && el.type === 'image') {
      return el;
    }
  },
  (get, set, update: Partial<MoveableElement & ImageType>) => {
    const selectedElements = get(selectedElementsAtom).map(id => get(elementsAtom)[id]);
    if (selectedElements.length === 1 && get(selectedElements[0]).type === "image") {
      set(selectedElements[0], el => ({
        ...el,
        ...update
      } as CanvasElement));
    }
  }
)

const imageUrlAtom = atom(
  (get) => {
    return get(selectedImageAtom)?.url ?? "";
  }
)

const imageStateAtom = atom(
  get => {
    return get(selectedImageAtom)?.state ?? ImageState.Normal
  }
)

const imageDimensionsAtom = atom(
  get => {
    const image = get(selectedImageAtom);
    if (image) {
      return {
        width: image.width,
        height: image.height
      }
    }

    return { width: 0, height: 0 }
  }
)

export function ImageToolbar() {
  const url = useAtomValue(imageUrlAtom);
  const [_, setSelectedImage] = useAtom(selectedImageAtom);
  const imageState = useAtomValue(imageStateAtom);
  const { width, height } = useAtomValue(imageDimensionsAtom)
  const cropper = useAtomValue(cropperAtom);
  const handleRemoveBg = () => {
    if (url) {
      setSelectedImage({ state: ImageState.Loading });
      removeBackground({ url })
        .then(result => {
          console.log(result);
        })
        .catch(console.log)
        .finally(() => {
          setSelectedImage({ state: ImageState.Normal });
        })
    }
  }

  const handleCropImage = () => {
    setSelectedImage({ state: ImageState.Cropping })
  }

  const handleCropDone = () => {
    if (cropper) {
      setSelectedImage({
        currentUrl: getRoundedCanvas(cropper.getCroppedCanvas()).toDataURL(),
        state: ImageState.Normal
      })
      return;
    }
    setSelectedImage({
      state: ImageState.Normal
    })
  }

  const handleCropCancel = () => {
    setSelectedImage({
      state: ImageState.Normal,
      currentUrl: url
    })
  }

  return (
    <Group>
      <Button variant='outline' onClick={handleRemoveBg}>
        Remove Background
      </Button>
      {imageState === ImageState.Normal && (
        <Button variant='outline' onClick={handleCropImage}>
          Crop
        </Button>
      )}
      {imageState === ImageState.Cropping && (
        <>
          <Button leftIcon={<X />} onClick={handleCropCancel} variant='outline'>Cancel</Button>
          <Button leftIcon={<Check />} onClick={handleCropDone} variant='light'>Done</Button>
        </>
      )}
    </Group>
  )
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