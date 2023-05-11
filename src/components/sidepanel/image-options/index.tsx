import React, { useEffect, useState } from 'react';
import { ActionIcon, Button, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { WashDrycleanOff } from 'tabler-icons-react';
import {
  imageBorderAtom,
  ImageState,
  imageUrlAtom,
  selectedImageAtom
} from '@/components/canvas/store';
import { useAtom, useAtomValue } from 'jotai';
import { ImageCropper } from './crop-image';
import { BORDERS } from './image-borders';
import { getBackgroundRemovalStatus, removeBackground } from '@/api/photos';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ImageOptions() {
  const [selectedImage, setSelectedImage] = useAtom(selectedImageAtom);
  const [border, setBorder] = useAtom(imageBorderAtom);
  const [prediction, setPrediction] = useState<any | null>(null);
  const url = useAtomValue(imageUrlAtom);

  const handleRemoveBg = async () => {
    if (url) {
      try {
        setSelectedImage({ state: ImageState.Loading });
        const res = await removeBackground(url);
        setPrediction(res);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (!prediction) return;
      if (prediction?.status === 'succeeded') {
        setSelectedImage({ state: ImageState.Normal, url: prediction.output });
      } else if (prediction?.status === 'failed') {
        setSelectedImage({ state: ImageState.Normal });
      } else {
        await sleep(1000);
        const response = await getBackgroundRemovalStatus(prediction?.id);
        setPrediction(response);
      }
    };
    checkStatus();
  }, [prediction]);

  if (!selectedImage) {
    return null;
  }

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
