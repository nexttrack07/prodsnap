import React, { useState } from "react";
import { FileButton, createStyles, Button, Space, SimpleGrid, Image } from "@mantine/core";
import { uploadImage } from "../../api/image-upload";

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

export function UploadPanel() {
  const [filename, setFilename] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { classes } = useStyles();

  const handleUploadImage = async (file: File) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async function () {
      setFilename(file.name);
      const secureUrl = await uploadImage(reader.result as string);
      setImageUrl(secureUrl);
    }

  }

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
        />
      </SimpleGrid>
    </>
  )
}