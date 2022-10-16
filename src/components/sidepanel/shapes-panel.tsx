import { Text, Space, createStyles, SimpleGrid } from "@mantine/core";
import { useSetAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getShapes } from "../../api";
import { CanvasElement, addElementAtom } from "../../components/canvas/store";

const useStyles = createStyles(() => ({
  shape: {
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
      transform: "scale(1.1)",
      transition: "transform 0.3s",
    },
  },
}));

export function ShapesPanel() {
  const query = useQuery(["shapes"], getShapes);
  const addElement = useSetAtom(addElementAtom);
  const { classes } = useStyles();

  const handleAddElement = (newEl: CanvasElement) => {
    addElement(newEl);
  };

  return (
    <>
      <Text sx={{ opacity: 0.7 }} size="lg">
        Shapes
      </Text>
      <Space h="xl" />
      <SimpleGrid cols={3}>
        {query.data?.data?.map((item) => (
          <svg
            key={item.id}
            className={classes.shape}
            width={75}
            onClick={() => handleAddElement(item.data)}
            fill={item.data.props?.fill}
            stroke={item.data.strokeProps.stroke}
            strokeWidth={item.data.strokeProps.strokeWidth}
            viewBox={item.data.props?.viewBox}
          >
            <path {...item.data.path} />
          </svg>
        ))}
      </SimpleGrid>
    </>
  );
}
