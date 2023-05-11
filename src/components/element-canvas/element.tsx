import {
  Element,
  ElementAtom,
  ElementGroupAtom,
  Position,
  dimensionAtom,
  positionAtom,
  selectedElementGroupAtomsAtom
} from '@/stores/elements';
import { useAtom, useAtomValue } from 'jotai';
import { TextRenderer } from './text-renderer';
import { PathRenderer } from './path-renderer';
import { DragHandler } from './drag-handler';
import { useShiftKeyPressed } from '@/utils';

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
        onPositionChange={handlePositionChange}
        attrs={{
          x,
          y,
          width,
          height,
          angle: elementGroup.angle
        }}
      >
        {elementGroup.elements.map((element) => (
          <ElementComponent position={{ x, y }} key={element.toString()} elementAtom={element} />
        ))}
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
  const [element, setElement] = useAtom(elementAtom);
  const ElementComp = elementCompMap[element.type];
  return (
    <div
      style={{
        position: 'absolute',
        top: element.y - position.y,
        left: element.x - position.x,
        width: element.width,
        height: element.height
      }}
    >
      <ElementComp element={element} />
    </div>
  );
}
