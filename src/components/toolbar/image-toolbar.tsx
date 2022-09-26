import { Button } from '@mantine/core';
import { elementsAtom, ImageType, MoveableElement, selectedElementsAtom } from '../../components/canvas/store';
import { httpsCallable } from 'firebase/functions';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import React from 'react';
import { functions } from '../../utils/firebase';

const imageUrlAtom = atom(
  (get) => {
    const selectedElements = get(selectedElementsAtom);
    const elements = selectedElements.map(id => get(elementsAtom)[id]);

    const el = get(elements[0]);
    if (elements.length === 1 && el.type === 'image') {
      return el.url;
    }

    return "";
  }
)

const removeBackground = httpsCallable(functions, 'removeBackground');

const selectedImageAtom = atom(
  null,
  (get, set, update: Partial<MoveableElement & ImageType>) => {
    const selectedElements = get(selectedElementsAtom).map(id => get(elementsAtom)[id]);
    if (selectedElements.length === 1 && get(selectedElements[0]).type === "image") {
      set(selectedElements[0], el => ({
        ...el,
        update
      }));
    }
  }
)

export function ImageToolbar() {
  const url = useAtomValue(imageUrlAtom);
  const setSelectedImage = useSetAtom(selectedImageAtom);
  const handleRemoveBg = () => {
    if (url) {
      setSelectedImage({ loading: true });
      removeBackground({ url })
        .then(result => {
          console.log(result);
        })
        .catch(console.log)
        .finally(() => {
          setSelectedImage({ loading: false });
        })
    }
  }

  return (
    <Button onClick={handleRemoveBg}>
      Remove Background
    </Button>
  )
}
