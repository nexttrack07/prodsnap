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
import { firestore, storage } from '../../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';
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

// async function fetchImages() {
//   const docRef = collection(firestore, 'images');
//   const snap = await getDocs(docRef);
//   let newImages: ImageFile[] = [];
//   snap.forEach((doc) => {
//     newImages.push(doc.data() as ImageFile);
//   });
//   return newImages;
// }

export function UploadPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const [error, setError] = useState<Error | null>(null);
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
            key={image.image}
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
