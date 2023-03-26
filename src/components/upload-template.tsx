import { Button } from '@mantine/core';
import { addTemplate } from '../api/template';
import { atom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { storage } from '../utils/firebase';
import domToImage from 'dom-to-image-more';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import { CanvasElement, CanvasElementWithPointAtoms, elementAtomsAtom } from './canvas/store';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
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

  const handleTemplateUpload = async () => {
    const dataURL = await domToImage.toBlob(document.getElementById('canvas')!);
    const filename = `template-${Date.now()}.png`;
    const storageRef = ref(storage, `images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, dataURL);

    uploadTask.on(
      'state_changed',
      () => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setProgress(progress);
        showNotification({
          id: 'upload-photo',
          loading: true,
          title: 'Uploading your photo',
          message: 'Your photo is being uploaded...',
          autoClose: false,
          disallowClose: true
        });
      },
      (err) => {
        // Handle unsuccessful uploads
        console.error(err);
        setError(err);
        updateNotification({
          id: 'upload-photo',
          color: 'red',
          title: 'Upload failed!',
          message: error!.message,
          icon: <X size={16} />,
          autoClose: 2000
        });
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          await postTemplate(url);
        });
        updateNotification({
          id: 'upload-photo',
          color: 'teal',
          title: 'Photo Uploaded Successfully',
          message: 'Your photo has been uploaded successfully',
          icon: <Check size={16} />,
          autoClose: 2000
        });
      }
    );
    const id = uuid();
    async function postTemplate(url: string) {
      try {
        showNotification({
          id: 'upload-template',
          loading: true,
          title: 'Uploading your template',
          message: 'Your template is being uploaded...',
          autoClose: false,
          disallowClose: true
        });
        setLoading(true);
        await addTemplate({ id, template, url });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        updateNotification({
          id: 'upload-template',
          color: 'teal',
          title: 'Template Uploaded Successfully',
          message: 'Your template has been uploaded successfully',
          icon: <Check size={16} />,
          autoClose: 2000
        });
      }
    }
  };
  return (
    <>
      <Button size="xs" leftIcon={<CloudUpload />} onClick={handleTemplateUpload} loading={loading}>
        Upload Template
      </Button>
    </>
  );
}
