import { Box, Button, Group, Modal, SegmentedControl } from '@mantine/core';
import { atom, useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import {
  selectedElementAtomsAtom,
  ElementType,
  Draggable,
  elementAtomsAtom,
  dimensionAtom,
  positionAtom
} from '@/components/canvas/store';
import { elementCompMap } from '@/components/canvas';
import { showNotification, updateNotification } from '@mantine/notifications';
import domToImage from 'dom-to-image-more';
import { RenderCurve } from './canvas/render-curve';
import { uuid } from '@/utils';

function serialize(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'function') {
      return value.toString();
    }
    return value;
  });
}

const templateAtom = atom((get) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const allElementAtoms = get(elementAtomsAtom);
  const selectedEls = reorderArrays(allElementAtoms, selectedElementAtoms);
  const elements = selectedEls.map((a) => {
    let el: any = get(a);

    if (el.type === 'svg-curve') {
      el = { ...el, points: el.points.map((p: any) => get(p)) };
    }

    return el;
  });

  return serialize(elements);
});

const SCALE = 1.2;

function reorderArrays<T>(array1: T[], array2: T[]): T[] {
  const orderedArray: T[] = [];

  array1.forEach((element) => {
    if (array2.includes(element)) {
      orderedArray.push(element);
    }
  });

  return orderedArray;
}

export function UploadSelection() {
  const selectedElementAtoms = useAtomValue(selectedElementAtomsAtom);
  const allElementAtoms = useAtomValue(elementAtomsAtom);
  const selection = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const position = useAtomValue(positionAtom);
  const dimension = useAtomValue(dimensionAtom);
  const [error, setError] = useState<Error | null>(null);
  const [type, setType] = useState<'curves' | 'shapes' | 'text'>('curves');

  if (selectedElementAtoms.length === 0) return null;

  // const handleTemplateUpload = async () => {
  //   const dataURL = await domToImage.toBlob(document.getElementById('canvas-selection')!);
  //   const filename = `template-${Date.now()}.png`;
  // const storageRef = ref(storage, `images/${filename}`);
  // const uploadTask = uploadBytesResumable(storageRef, dataURL);

  // uploadTask.on(
  //   'state_changed',
  //   () => {
  //     // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     // setProgress(progress);
  //     showNotification({
  //       id: 'upload-selection-photo',
  //       loading: true,
  //       title: 'Uploading your selection photo',
  //       message: 'Your selection-photo is being uploaded...',
  //       autoClose: false
  //     });
  //   },
  //   (err) => {
  //     // Handle unsuccessful uploads
  //     console.error(err);
  //     setError(err);
  //     updateNotification({
  //       id: 'upload-selection-photo',
  //       color: 'red',
  //       title: 'Upload failed!',
  //       message: error!.message,
  //       icon: <X size={16} />,
  //       autoClose: 2000
  //     });
  //   },
  //   () => {
  //     // Handle successful uploads on complete
  //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  //     getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
  //       await postSelection(url);
  //     });
  //     updateNotification({
  //       id: 'upload-selection-photo',
  //       color: 'teal',
  //       title: 'Selection Photo Uploaded Successfully',
  //       message: 'Your photo has been uploaded successfully',
  //       icon: <Check size={16} />,
  //       autoClose: 2000
  //     });
  //   }
  // );
  const id = uuid();
  //   async function postSelection(url: string) {
  //     try {
  //       showNotification({
  //         id: 'upload-selection',
  //         loading: true,
  //         title: 'Uploading your selection',
  //         message: 'Your selection is being uploaded...',
  //         autoClose: false,
  //         disallowClose: true
  //       });
  //       setLoading(true);
  //       await addTemplate({ id, selection, type, url }, 'selections');
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //       updateNotification({
  //         id: 'upload-selection',
  //         color: 'teal',
  //         title: 'Selection Uploaded Successfully',
  //         message: 'Your selection has been uploaded successfully',
  //         icon: <Check size={16} />,
  //         autoClose: 2000
  //       });
  //     }
  //   }
  // };

  return (
    <>
      <Button size="xs" leftIcon={<CloudUpload />} onClick={() => setOpened(true)}>
        Upload Selection
      </Button>

      <Modal size="auto" opened={opened} onClose={() => setOpened(false)} title="Upload Selection">
        <Box
          id="canvas-selection"
          sx={(theme) => ({
            background: 'white',
            // margin: 25,
            width: dimension.width * SCALE,
            height: dimension.height * SCALE,
            position: 'relative'
          })}
        >
          {reorderArrays(allElementAtoms, selectedElementAtoms).map((elementAtom) => (
            <RenderElement
              canvasPosition={position}
              key={elementAtom.toString()}
              elementAtom={elementAtom}
            />
          ))}
        </Box>
        <Group position="right">
          <SegmentedControl
            value={type}
            onChange={(val) => setType(val as 'shapes' | 'curves' | 'text')}
            size="xs"
            data={['text', 'shapes', 'curves']}
          />
          <Button size="xs" variant="outline" color="red" onClick={() => setOpened(false)}>
            Cancel
          </Button>

          <Button size="xs" variant="light" loading={loading}>
            Upload
          </Button>
        </Group>
      </Modal>
    </>
  );
}

export function RenderElement({
  elementAtom,
  canvasPosition
}: {
  elementAtom: ElementType;
  canvasPosition: Draggable;
}) {
  const [element, setElement] = useAtom(elementAtom);
  const ElementComponent = elementCompMap[element.type];

  if (element.type === 'svg-curve') {
    return (
      <RenderCurve
        isSelected={false}
        element={element}
        setElement={setElement}
        onSelect={() => {}}
        position={canvasPosition}
      />
    );
  }

  return (
    <ElementComponent
      element={{ ...element, x: element.x - canvasPosition.x, y: element.y - canvasPosition.y }}
      setElement={setElement}
      onSelect={() => {}}
      isSelected={false}
    />
  );
}
