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

type ImageFile = {
  filname: string;
  url: string;
};

const metadata = {
  contentType: 'image/jpeg'
};

export function UploadPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const query = useQuery(['images'], getImages);

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleUploadImage = (file: File) => {
    // formdata and add url to it
    const formData = new FormData();
    formData.append('file', file);

    async function postSelection(url: string) {
      try {
        showNotification({
          id: 'upload-image',
          title: 'Uploading image',
          message: 'Your image is being uploaded',
          autoClose: false,
          disallowClose: true
        });
        setLoading(true);
        await uploadPhoto(formData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        }
      } finally {
        setLoading(false);
        updateNotification({
          id: 'upload-image',
          title: 'Image uploaded',
          message: 'Your image has been uploaded',
          icon: <Check size={18} />,
          autoClose: 5000,
          disallowClose: false
        });
        query.refetch();
      }
    }
  };

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
            src={image.image}
            onClick={() => {
              const el: CanvasElementWithPointAtoms = {
                ...defaultImage,
                url: image.image
              };

              handleAddElement(el);
            }}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
