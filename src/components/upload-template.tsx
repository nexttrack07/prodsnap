import { Button } from '@mantine/core';
import { atom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import domToImage from 'dom-to-image-more';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import { CanvasElement, CanvasElementWithPointAtoms, elementAtomsAtom } from './canvas/store';
import { showNotification, updateNotification } from '@mantine/notifications';

function serialize(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });
}

function uuid(): string {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  const uniqueId = `${timestamp}-${randomNum}`;

  return uniqueId;
}

const templateAtom = atom((get) => {
  const allElementAtoms = get(elementAtomsAtom);
  const elements = allElementAtoms.map((a) => {
    let el: CanvasElement | CanvasElementWithPointAtoms = get(a);

    if (el.type === 'svg-curve') {
      el = { ...el, points: el.points.map((p) => get(p)) } as CanvasElement;
    }

    return el;
  });

  return serialize(elements);
});

export function UploadTemplate() {
  const allElementAtoms = useAtomValue(elementAtomsAtom);
  const [error, setError] = useState<Error | null>(null);

  const template = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);

  if (allElementAtoms.length === 0) return null;

  const handleTemplateUpload = async () => {};
  return (
    <>
      <Button size="xs" leftIcon={<CloudUpload />} onClick={handleTemplateUpload} loading={loading}>
        Upload Template
      </Button>
    </>
  );
}
