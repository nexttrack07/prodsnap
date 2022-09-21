import React from "react";
import { Text, Space, createStyles, SimpleGrid, Image } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../api";
import { renderElement } from "../../components/canvas";
import { elementsAtom, CanvasElement, MoveableElement, ImageType } from "../../components/canvas/store";

const useStyles = createStyles(() => ({
  shape: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s"
    },
  },
}));

const data: { id: number; data: MoveableElement & ImageType }[] = [
  {
    id: 0,
    data: {
      type: "image",
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      url: "https://media.kohlsimg.com/is/image/kohls/4637183_Navy_Blue?wid=600&hei=600&op_sharpen=1"
    }
  }
]

export function PhotosPanel() {
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    setElements((items) => [...items, atom(newEl)]);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Photos
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {data.map((item) => (
          <Image
            key={item.id}
            className={classes.shape}
            width={75}
            onClick={() => handleAddElement(item.data)}
            height={
              (item.data.height * 75) / item.data.width
            }
            src={item.data.url}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
