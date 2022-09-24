import React, { useEffect, useState } from "react";
import { FileButton, createStyles, Button, Space, SimpleGrid, Image, Notification, Progress } from "@mantine/core";
import { uploadImage } from "../../api/image-upload";
import { atom, useSetAtom } from "jotai";
import { CanvasElement, elementsAtom, getDefaultMoveable } from "../canvas/store";
import { firestore, storage } from "../../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, doc } from "firebase/firestore";

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    padding: 8,
    '&:hover': {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s"
    },
  },
}));

export const useStorage = (file: File) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const storageRef = ref(storage, `images/${file.name}`);
    const collectionRef = collection(firestore, 'images');
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        setError(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          await addDoc(collectionRef, { filename: file.name, url, })
          setUrl(url);
        });
      }
    );
  })

  return { progress, url, error };
}

export function UploadPanel() {
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [imageUrl, setUrl] = useState("");

  const handleAddElement = (newEl: CanvasElement) => {
    setElements((items) => [...items, atom(newEl)]);
  };

  const handleUploadImage = (file: File) => {
    const storageRef = ref(storage, `images/${file.name}`);
    const collectionRef = collection(firestore, 'images');
    const uploadTask = uploadBytesResumable(storageRef, file);

    console.log('Hello uploading image: ', file)

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('progress: ', progress)
        setProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error(error);
        setError(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          await addDoc(collectionRef, { filename: file.name, url, })
          setUrl(url);
        });
      }
    );
  }

  // const handleUploadImage = async (file: File) => {
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = async function () {
  //     setFilename(file.name);
  //     const secureUrl = await uploadImage(reader.result as string);
  //     setImageUrl(secureUrl);
  //   }
  // }

  return (
    <>
      <FileButton onChange={handleUploadImage} accept="image/png,image/jpeg">
        {(props) => <Button fullWidth {...props}>Upload image</Button>}
      </FileButton>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        <Image
          radius="md"
          className={classes.shape}
          src={imageUrl}
          onClick={() => {
            const el: CanvasElement = {
              type: "image",
              url: imageUrl,
              ...getDefaultMoveable()
            }

            handleAddElement(el);
          }}
        />
      </SimpleGrid>
      <Progress value={progress} />
    </>
  )
}