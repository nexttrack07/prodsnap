import { Text, Space, createStyles, SimpleGrid, Center } from "@mantine/core";
import { atom, useSetAtom } from "jotai";
import { addElementAtom, CanvasElement } from "../../components/canvas/store";

const useStyles = createStyles((theme) => ({
  shape: {
    cursor: "pointer",
    border: `1px solid ${theme.colors.gray[2]}`,
    boxShadow: "0 0 1px rgba(0,0,0,0.3)",
    borderRadius: 5,
    padding: 8,
    "&:hover": {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s",
    },
  },
}));

const data: {
  id: number;
  data: CanvasElement;
}[] = [
  {
    id: 0,
    data: {
      x: 200,
      y: 100,
      type: "text" as const,
      width: 300,
      height: 50,
      content: "heading",
      props: {
        fontSize: 50,
      },
    },
  },
];

export function TextPanel() {
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Text
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={1}>
        {data.map((item) => {
          if (item.data.type === "text") {
            return (
              <Center key={item.id} className={classes.shape}>
                <Text
                  onClick={() => handleAddElement(item.data)}
                  style={{ ...item.data.props }}
                >
                  {item.data.content}
                </Text>
              </Center>
            );
          }
          return null;
        })}
      </SimpleGrid>
    </>
  );
}
