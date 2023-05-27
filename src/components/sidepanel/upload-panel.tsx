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
import { uploadImage } from '@/api/images';
import { addTemplate } from '@/api/template';
// import { getImages, uploadPhoto } from '@/api/photos';

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

async function fetchImages() {
  const docRef = collection(firestore, 'images');
  const snap = await getDocs(docRef);
  let newImages: ImageFile[] = [];
  snap.forEach((doc) => {
    newImages.push(doc.data() as ImageFile);
  });
  return newImages;
}

const metadata = {
  contentType: 'image/jpeg'
};

export function UploadPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const query = useQuery(['images'], fetchImages);

  const handleAddElement = (newEl: CanvasElementWithPointAtoms) => {
    addElement(newEl);
  };

  const handleUploadImage = (file: File) => {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('Error uploading image', error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await postSelection(downloadURL);
        });
      }
    );

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
        await uploadImage(file.name, url);
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
        {query.data?.map((image) => (
          <Image
            key={image.url}
            className={classes.shape}
            src={image.url}
            onClick={() => {
              const el: CanvasElementWithPointAtoms = {
                ...defaultImage,
                url: image.url
              };

              handleAddElement(el);
            }}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
