import { ElementAtom, ElementGroupAtom } from '@/stores/elements';
import { useAtom } from 'jotai';

type Props = {
  group: ElementGroupAtom;
};

export function ElementGroup({ group }: Props) {
  const [elementGroup, setElementGroup] = useAtom(group);

  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      {elementGroup.elements.map((element) => (
        <Element key={element.toString()} elementAtom={element} />
      ))}
    </div>
  );
}

function Element({ elementAtom }: { elementAtom: ElementAtom }) {
  const [element, setElement] = useAtom(elementAtom);

  return (
    <div
      style={{
        position: 'absolute',
        top: element.y,
        left: element.x,
        width: element.width,
        height: element.height,
        backgroundColor: 'red'
      }}
    ></div>
  );
}
