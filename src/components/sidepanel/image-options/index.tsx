import React from 'react';
import { ActionIcon, Button, SimpleGrid, Stack, Title } from '@mantine/core';
import { WashDrycleanOff } from 'tabler-icons-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/utils/firebase';
import { ImageState, imageUrlAtom, selectedImageAtom } from '@/components/canvas/store';
import { useAtom, useAtomValue } from 'jotai';
import { ImageCropper } from './crop-image';
import { MASKS } from './image-masks';

const removeBackground = httpsCallable(functions, 'removeBackground');

export function ImageOptions() {
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const url = useAtomValue(imageUrlAtom);

  if (!selectedImage) {
    return null;
  }

  const handleRemoveBg = () => {
    if (url) {
      setSelectedImage({ state: ImageState.Loading });
      removeBackground({ url })
        .then()
        .catch()
        .finally(() => {
          setSelectedImage({ state: ImageState.Normal });
        });
    }
  };

  return (
    <Stack>
      <Button leftIcon={<WashDrycleanOff />} fullWidth variant="outline" onClick={handleRemoveBg}>
        Remove Background
      </Button>
      <ImageCropper />
      <br />
      <Title order={6}>Image Masks</Title>
      <SimpleGrid cols={4}>
        {MASKS.map((b) => (
          <ActionIcon
            color="dark"
            variant={selectedImage.mask === b.id ? 'light' : 'default'}
            size={70}
            key={b.id}
            onClick={() => {}}
          >
            {b.icon}
          </ActionIcon>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
