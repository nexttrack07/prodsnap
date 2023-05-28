import React, { useEffect, useState } from 'react';
import {
  FileButton,
  createStyles,
  Button,
  Space,
  SimpleGrid,
  Image,
  LoadingOverlay,
  Divider
} from '@mantine/core';
import { useSetAtom } from 'jotai';
import { addElementAtom, CanvasElementWithPointAtoms, defaultImage } from '../canvas/store';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Check, CloudUpload, X } from 'tabler-icons-react';
import { useQuery } from '@tanstack/react-query';
import { getImages, uploadPhoto } from '@/api/photos';

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    // border: `1px solid ${theme.colors.gray[2]}`,
    // boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    // padding: 1,
    '&:hover': {
      opacity: 0.7,
      transform: 'scale(1.1)',
      transition: 'transform 0.3s'
    }
  }
}));

export function UploadPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const query = useQuery(['images'], getImages);

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      showNotification({
        title: 'Uploading Image',
        message: 'Uploading your image...',
        loading: true,
        autoClose: false,
        disallowClose: false,
        id: 'uploading-image'
      });
      const _ = await uploadPhoto(formData);
      updateNotification({
        id: 'uploading-image',
        title: 'Image Uploaded',
        message: 'Your image has been uploaded!',
        icon: <Check />,
        autoClose: 2000
      });
      query.refetch();
    } catch (error) {
      updateNotification({
        id: 'uploading-image',
        title: 'Image Upload Error',
        message: 'Error uploading your image. Please try again.',
        icon: <X />,
        autoClose: 2000
      });
    }
  };

  // cloudinary image url
  const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_IMAGE_URL;

  return (
    <>
      <FileButton onChange={handleUploadImage} accept="image/png,image/jpeg">
        {(props) => (
          <Button
            size="md"
            leftIcon={<CloudUpload />}
            variant="gradient"
            uppercase
            fullWidth
            {...props}
          >
            Upload image
          </Button>
        )}
      </FileButton>
      <Divider my="xl" />
      <LoadingOverlay visible={query.isLoading} />
      <SimpleGrid cols={3}>
        {query.data?.results.map((image) => (
          <Image
            key={image.id}
            className={classes.shape}
            src={CLOUDINARY_URL + image.image}
            onClick={() => {
              const el: CanvasElementWithPointAtoms = {
                ...defaultImage,
                url: CLOUDINARY_URL + image.image
              };

              handleAddElement(el);
            }}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
