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

  const handleTemplateUpload = async () => {
    const dataURL = await domToImage.toBlob(document.getElementById('canvas-selection')!);
    const filename = `template-${Date.now()}.png`;
  };

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

          <Button size="xs" variant="light" onClick={handleTemplateUpload} loading={loading}>
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
