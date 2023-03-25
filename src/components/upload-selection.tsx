import { Box, Button, Group, Modal, SegmentedControl } from '@mantine/core';
import { addTemplate } from '../api/template';
import { atom, useAtom, useAtomValue } from 'jotai';
import React, { useState } from 'react';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import { selectedElementAtomsAtom, ElementType, Draggable } from './canvas/store';
import { dimensionAtom, positionAtom, elementCompMap } from './canvas';
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

const SCALE = 1.2;

export function UploadSelection() {
  const selectedElementAtoms = useAtomValue(selectedElementAtomsAtom);
  const selection = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const position = useAtomValue(positionAtom);
  const dimension = useAtomValue(dimensionAtom);
  const [type, setType] = useState<'curves' | 'shapes' | 'text'>('curves');

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
      await addTemplate({ id, selection, type }, 'selections');
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
      <Button size="xs" leftIcon={<CloudUpload />} onClick={() => setOpened(true)}>
        Upload Selection
      </Button>

      <Modal size="auto" opened={opened} onClose={() => setOpened(false)} title="Upload Selection">
        <Box
          sx={(theme) => ({
            background: 'white',
            // margin: 25,
            width: dimension.width * SCALE,
            height: dimension.height * SCALE,
            position: 'relative'
          })}
        >
          {selectedElementAtoms.map((elementAtom) => (
            <Element
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

          <Button size="xs" variant="light" onClick={handleTemplateUpload} loading={loading}>
            Upload
          </Button>
        </Group>
      </Modal>
    </>
  );
}

function Element({
  elementAtom,
  canvasPosition
}: {
  elementAtom: ElementType;
  canvasPosition: Draggable;
}) {
  const [element, setElement] = useAtom(elementAtom);
  const ElementComponent = elementCompMap[element.type];

  return (
    <ElementComponent
      element={{ ...element, x: element.x - canvasPosition.x, y: element.y - canvasPosition.y }}
      setElement={setElement}
      onSelect={() => {}}
      isSelected={false}
    />
  );
}
