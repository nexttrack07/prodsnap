import { Element, Graphic } from '@/stores/elements';
import { uuid } from '@/utils';

type Props = {
  element: Element & Graphic;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
};
export function GraphicRenderer({ element, isSelected, onSelect }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  const { width, height } = element;
  const id = uuid();

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <image
        onClick={handleClick}
        clipPath={id}
        preserveAspectRatio="xMidYMid slice"
        href={element.url}
        width={width}
        height={height}
      />
    </svg>
  );
}
