import React from "react";
import { Text, Space, createStyles, SimpleGrid, Image, Center } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import { elementsAtom, CanvasElement, MoveableElement, ImageType, TextType } from "../../components/canvas/store";

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: 'pointer',
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    borderRadius: 5,
    padding: 8,
    '&:hover': {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s"
    },
  },
}));

const data: { id: number; data: MoveableElement & TextType }[] = [
  {
    id: 0,
    data: {
      type: "text",
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      content: "heading",
      props: {
        fontSize: 50,
        textTransform: "uppercase"
      }
    }
  },
  {
    id: 1,
    data: {
      type: "text",
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      content: "sub-heading",
      props: {
        fontSize: 30,
        textTransform: "uppercase",
        fontFamily: 'serif'
      }
    }
  },
  {
    id: 2,
    data: {
      type: "text",
      x: 200,
      y: 200,
      width: 300,
      height: 200,
      content: "Add a paragraph",
      props: {
        fontSize: 20,
      }
    }
  }
]

export function TextPanel() {
  const setElements = useSetAtom(elementsAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    setElements((items) => [...items, atom(newEl)]);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Text
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={1}>
        {data.map((item) => (
          <Center
            key={item.id}
            className={classes.shape}
          >
            <Text
              onClick={() => handleAddElement(item.data)}
              style={{ ...item.data.props }}
            >
              {item.data.content}
            </Text>
          </Center>
        ))}
      </SimpleGrid>
    </>
  );
}
