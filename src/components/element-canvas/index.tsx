import { elementGroupAtomsAtom, selectedElementGroupAtomsAtom } from '@/stores/elements';
import { Box } from '@mantine/core';
import { useAtomValue, useSetAtom } from 'jotai';
import { ElementGroup } from './element';

export function Canvas() {
  const elementGroupAtoms = useAtomValue(elementGroupAtomsAtom);
  const setSelectedElementGroupAtoms = useSetAtom(selectedElementGroupAtomsAtom);

  const handleCanvasClick = () => {
    setSelectedElementGroupAtoms([]);
  };

  return (
    <Box
      id="canvas"
      onMouseDown={handleCanvasClick}
      sx={(theme) => ({
        width: 900,
        height: 700,
        border: `1px solid ${theme.colors.gray[4]}`,
        boxShadow: '0px 0px 0.8px rgba(0,0,0,0.3)',
        position: 'relative',
        backgroundColor: 'white',
        overflow: 'hidden'
      })}
    >
      {elementGroupAtoms.map((elementGroupAtom) => (
        <ElementGroup key={elementGroupAtom.toString()} group={elementGroupAtom} />
      ))}
    </Box>
  );
}
