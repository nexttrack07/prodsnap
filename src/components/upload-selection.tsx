import { Button } from '@mantine/core';
import { addTemplate } from '../api/template';
import { atom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import { selectedElementAtomsAtom } from './canvas/store';
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
  const allElementAtoms = get(selectedElementAtomsAtom);
  const elements = allElementAtoms.map((a) => {
    let el: any = get(a);

    if (el.type === 'svg-curve') {
      el = { ...el, points: el.points.map((p: any) => get(p)) };
    }

    return el;
  });

  return serialize(elements);
});

export function UploadSelection() {
  const selectedElementAtoms = useAtomValue(selectedElementAtomsAtom);
  const selection = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);

  if (selectedElementAtoms.length === 0) return null;

  const handleTemplateUpload = async () => {
    const id = uuid();

    try {
      showNotification({
        id: 'upload-selection',
        loading: true,
        title: 'Uploading your selection',
        message: 'Your selection is being uploaded...',
        autoClose: false,
        disallowClose: true
      });
      setLoading(true);
      await addTemplate({ id, selection }, 'selections');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      updateNotification({
        id: 'upload-selection',
        color: 'teal',
        title: 'Selection Uploaded Successfully',
        message: 'Your selection has been uploaded successfully',
        icon: <Check size={16} />,
        autoClose: 2000
      });
    }
  };

  return (
    <>
      <Button size="xs" leftIcon={<CloudUpload />} onClick={handleTemplateUpload} loading={loading}>
        Upload Selection
      </Button>
    </>
  );
}
