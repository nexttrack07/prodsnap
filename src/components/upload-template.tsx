import { Box, Button, Divider, Group, Modal } from "@mantine/core";
import { addTemplate } from "../api/template";
import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import { CloudUpload } from "tabler-icons-react";
import { elementCompMap } from "./canvas";
import { dimensionAtom, positionAtom } from "./canvas/select-handler";
import {
  elementAtomsAtom,
  ElementType,
  selectedElementAtomsAtom,
} from "./canvas/store";

const templateAtom = atom((get) => {
  const selectedElementAtoms = get(selectedElementAtomsAtom);
  const allElementAtoms = get(elementAtomsAtom);
  const elementAtoms = allElementAtoms.filter((a) =>
    selectedElementAtoms.includes(a)
  );
  const elements = elementAtoms.map((a) => get(a));

  return JSON.stringify(elements);
});

export function UploadTemplate() {
  const [opened, setOpened] = useState(false);
  const selectedElementAtoms = useAtomValue(selectedElementAtomsAtom);
  const allElementAtoms = useAtomValue(elementAtomsAtom);
  const elementAtoms = allElementAtoms.filter((a) =>
    selectedElementAtoms.includes(a)
  );
  const template = useAtomValue(templateAtom);
  const [loading, setLoading] = useState(false);
  const { width, height } = useAtomValue(dimensionAtom);

  if (elementAtoms.length === 0) return null;

  const handleTemplateUpload = async () => {
    console.log('upload template')
    const id = elementAtoms.reduce((acc, item) => acc + item.toString(), "");
    try {
      setLoading(true);
      await addTemplate({ id, template });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setOpened(false);
    }
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Upload Partial Template"
        size="auto"
      >
        <Box
          id="canvas"
          sx={(theme) => ({
            width,
            height,
            border: `1px solid ${theme.colors.gray[3]}`,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.3)",
            position: "relative",
            backgroundColor: "white",
          })}
        >
          {elementAtoms.map((elementAtom) => (
            <Element key={elementAtom.toString()} elementAtom={elementAtom} />
          ))}
        </Box>
        <Divider my="xl" variant="dotted" />
        <Group>
          <div style={{ flex: 1 }} />
          <Button onClick={handleTemplateUpload} loading={loading} color="dark">
            Upload
          </Button>
        </Group>
      </Modal>
      <Button
        onClick={() => setOpened(true)}
        leftIcon={<CloudUpload size={18} />}
        color="dark"
      >
        Upload
      </Button>
    </>
  );
}

function Element({ elementAtom }: { elementAtom: ElementType }) {
  const element = useAtomValue(elementAtom);
  const { x, y } = useAtomValue(positionAtom);

  const Comp = elementCompMap[element.type];

  console.log("element: ", x, y, element.x, element.y);

  return (
    <Box
      sx={{
        left: element.x - x,
        top: element.y - y,
        width: element.width,
        height: element.height,
        position: "absolute",
      }}
    >
      <Comp element={element} setElement={() => {}} isSelected={false} />
    </Box>
  );
}
