import React from 'react';
import { ActionIcon, Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { WashDrycleanOff } from 'tabler-icons-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/utils/firebase';
import {
  imageBorderAtom,
  ImageState,
  imageUrlAtom,
  selectedImageAtom
} from '@/components/canvas/store';
import { useAtom, useAtomValue } from 'jotai';
import { ImageCropper } from './crop-image';
import { BORDERS } from './image-borders';

const removeBackground = httpsCallable(functions, 'removeBackground');

export function ImageOptions() {
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [border, setBorder] = useAtom(imageBorderAtom);
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
      <Button
        size="md"
        leftIcon={<WashDrycleanOff />}
        fullWidth
        variant="outline"
        onClick={handleRemoveBg}
      >
        Remove Background
      </Button>
      <ImageCropper />
      <br />
      <Title order={6}>Image Borders</Title>
      <Text size="sm" color="gray">
        Make sure to crop the image to a circle before using circle border
      </Text>
      <SimpleGrid cols={4}>
        {BORDERS.map((b) => (
          <ActionIcon
            color="dark"
            variant={border?.id === b.id ? 'light' : 'default'}
            size={70}
            key={b.id}
            onClick={() => {
              setBorder({ id: b.id });
            }}
          >
            {b.icon}
          </ActionIcon>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
