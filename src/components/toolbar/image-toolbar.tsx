import React from 'react';
import { Button, Group } from '@mantine/core';
import { selectedImageAtom, sidepanelAtom } from '@/components/canvas/store';
import { useAtom } from 'jotai';

export function ImageToolbar() {
  const [sidepanel, setSidepanel] = useAtom(sidepanelAtom);
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);

  if (!selectedImage) {
    return null;
  }

  return (
    <Group>
      <Button
        onClick={() => setSidepanel((s) => (s === 'image-editing' ? 'upload' : 'image-editing'))}
        size="xs"
        variant={sidepanel === 'image-editing' ? 'light' : 'outline'}
      >
        Edit Photo
      </Button>
    </Group>
  );
}
