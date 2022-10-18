import { Box, Button, Modal } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { CloudUpload } from "tabler-icons-react";
import { elementCompMap } from "./canvas";
import { dimensionAtom, positionAtom } from "./canvas/select-handler";
import { elementAtomsAtom, ElementType, selectedElementAtomsAtom } from "./canvas/store";

export function UploadTemplate() {
  const [opened, setOpened] = useState(false);
  const selectedElementAtoms = useAtomValue(selectedElementAtomsAtom);
  const allElementAtoms = useAtomValue(elementAtomsAtom);
  const elementAtoms = allElementAtoms.filter(a => selectedElementAtoms.includes(a));
  const { width, height } = useAtomValue(dimensionAtom);
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

  console.log('element: ', x, y, element.x, element.y)

  return (
    <Box sx={{
      left: element.x - x,
      top: element.y - y,
      width: element.width,
      height: element.height,
      position: "absolute"
    }}>
      <Comp element={element} setElement={() => {}} isSelected={false} />
    </Box>
  )
}
