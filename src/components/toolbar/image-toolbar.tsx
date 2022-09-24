import { Button } from '@mantine/core';
import { elementsAtom, selectedElementsAtom } from '../../components/canvas/store';
import { httpsCallable } from 'firebase/functions';
import { atom, useAtomValue } from 'jotai';
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

export function ImageToolbar() {
  const url = useAtomValue(imageUrlAtom);
  const handleRemoveBg = () => {
    if (url) {
      removeBackground({ url })
        .then(result => {
          console.log('Data: ', result);
        })
    }
  }

  return (
    <Button onClick={handleRemoveBg}>
      Remove Background
    </Button>
  )
}
