import {
  Element,
  ElementAtom,
  ElementGroupAtom,
  Position,
  activeElementAtomAtom,
  dimensionAtom,
  positionAtom,
  selectedElementGroupAtomsAtom
} from '@/stores/elements';
import { useAtom, useAtomValue } from 'jotai';
import { TextRenderer } from './text-renderer';
import { PathRenderer } from './path-renderer';
import { DragHandler } from './drag-handler';
import { useShiftKeyPressed } from '@/utils';
import { useMantineTheme } from '@mantine/core';

type ElementGroupProps = {
  group: ElementGroupAtom;
};

export function ElementGroup({ group }: ElementGroupProps) {
  const elementGroup = useAtomValue(group);
  const [{ x, y }, setPosition] = useAtom(positionAtom(elementGroup.elements));
  const [{ width, height }] = useAtom(dimensionAtom(elementGroup.elements));
  const [selectedGroupAtoms, setSelectedGroupAtoms] = useAtom(selectedElementGroupAtomsAtom);
  const isShiftPressed = useShiftKeyPressed();

  const handleClick = () => {
    // if the group is already selected, do nothing
    if (selectedGroupAtoms.includes(group)) {
      return;
    }

    // if shift key is pressed, concat the group to the selected groups
    // else set the selected groups to the group
    if (isShiftPressed) {
      setSelectedGroupAtoms((prev) => [...prev, group]);
    } else {
      setSelectedGroupAtoms([group]);
    }
  };

  const handlePositionChange = (position: Position) => {
    setPosition(position);
  };

  return (
    <div onClick={handleClick}>
      <DragHandler
        show={selectedGroupAtoms.includes(group)}
        onPositionChange={handlePositionChange}
        attrs={{
          x,
          y,
          width,
          height,
          angle: elementGroup.angle
        }}
      >
        <div>
          {elementGroup.elements.map((element) => (
            <ElementComponent position={{ x, y }} key={element.toString()} elementAtom={element} />
          ))}
        </div>
      </DragHandler>
    </div>
  );
}

export const elementCompMap: Record<Element['type'], React.FC<any>> = {
  text: TextRenderer,
  path: PathRenderer
};

type ElementComponentProps = {
  elementAtom: ElementAtom;
  position: Position;
};

function ElementComponent({ elementAtom, position }: ElementComponentProps) {
  const element = useAtomValue(elementAtom);
  const [activeElement, setActiveElement] = useAtom(activeElementAtomAtom);
  const ElementComp = elementCompMap[element.type];
  const theme = useMantineTheme();

  const handleClick = () => {
    setActiveElement(elementAtom);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: element.y - position.y,
        left: element.x - position.x,
        width: element.width,
        height: element.height,
        border: activeElement === elementAtom ? `2px solid ${theme.colors.blue[5]}` : 'none'
      }}
    >
      <ElementComp element={element} />
    </div>
  );
}
