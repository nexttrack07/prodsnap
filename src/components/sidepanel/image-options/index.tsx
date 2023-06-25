import { ActionIcon, Button, Flex, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { WashDrycleanOff } from 'tabler-icons-react';
import {
  imageBorderAtom,
  ImageState,
  imageUrlAtom,
  MaskType,
  selectedImageAtom
} from '@/components/canvas/store';
import { useAtom, useAtomValue } from 'jotai';
import { removeBackground } from '@/api/photos';
import { BORDERS } from './image-borders';
import remove_bg from '@/assets/remove_bg.png';

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
        .then((res) => {
          console.log('RES: ', res);
          setSelectedImage({
            url: res.url
          });
        })
        .catch()
        .finally(() => {
          setSelectedImage({ state: ImageState.Normal });
        });
    }
  };

  const handleCropImage = (type: MaskType['type'] | 'none') => {
    if (type === 'none') {
      setSelectedImage({
        state: ImageState.Normal,
        mask: undefined
      });
    } else {
      setSelectedImage({
        state: ImageState.Cropping,
        mask: {
          type,
          x: 200,
          y: 200,
          width: 200,
          height: 200,
          stroke: 'none',
          strokeWidth: 0
        }
      });
    }
  };

  const handleCropDone = () => {
    setSelectedImage({
      state: ImageState.Normal
    });
  };

  return (
    <Stack>
      <Flex
        sx={(theme) => ({
          border: `1px solid ${theme.colors.gray[4]}`,
          borderRadius: 2,
          cursor: 'pointer',
          '&:hover': {
            border: `1px solid ${theme.colors.gray[9]}`,
            boxShadow: `0 0 0 1px ${theme.colors.gray[9]}`
          }
        })}
        onClick={handleRemoveBg}
      >
        <Image src={remove_bg} width={70} />
        <Flex direction="column" justify="center" sx={{ marginLeft: 10 }}>
          <Title order={6}>Remove Background</Title>
          <Text size="xs" color="gray">
            Remove the background of your image with one click.
          </Text>
        </Flex>
      </Flex>
      <div>
        <Title order={6}>Crop Image</Title>
        <Text size="sm" color="gray">
          Make a selection to crop your image to its shape.
        </Text>
      </div>
      <SimpleGrid cols={4}>
        {BORDERS.map((b) => (
          <Flex direction="column" gap={5} align="center" key={b.id}>
            <ActionIcon
              color="dark"
              variant={selectedImage.mask?.type === b.id ? 'light' : 'default'}
              size={70}
              key={b.id}
              onClick={() => handleCropImage(b.id)}
            >
              {b.icon}
            </ActionIcon>
            <Text size="xs" color="gray">
              {b.desc}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>

      {selectedImage.state === ImageState.Cropping && (
        <Flex
          gap="lg"
          align="center"
          sx={(theme) => ({
            border: `1px solid ${theme.colors.gray[4]}`,
            borderRadius: 2,
            padding: 8
          })}
        >
          <Text size="sm" color="gray.8">
            Adjust the crop area to your liking then click Done.
          </Text>
          <Button onClick={handleCropDone} variant="filled" size="xs">
            Done
          </Button>
        </Flex>
      )}
    </Stack>
  );
}
