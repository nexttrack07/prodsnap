import { SetStateAction } from 'jotai';
import { Draggable, Resizable, ImageState, ImageType, MaskType } from '../canvas/store';
import { DragHandler } from '../canvas/drag-handler';

export type NormalImageType = ImageType & { state: ImageState.Normal; mask: MaskType };

type Props = {
  isSelected: boolean;
  element: NormalImageType;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<NormalImageType>) => void;
};

export function NormalImageControls({ element, setElement, onSelect, isSelected }: Props) {
  const handleMaskMove = (pos: Draggable) => {
    setElement((prev) => {
      return {
        ...prev,
        x: pos.x + prev.x,
        y: pos.y + prev.y
      };
    });
  };

  const handleMaskResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => ({
      ...prev,
      x: prev.x + x,
      y: prev.y + y,
      width: prev.width + width,
      height: prev.height + height,
      mask: {
        ...prev.mask,
        x: prev.mask.x + x,
        y: prev.mask.y + y,
        width: prev.mask.width + width * 2,
        height: prev.mask.height + height * 2
      }
    }));
  };

  return (
    <DragHandler
      position={{
        x: element.mask.x + element.x - element.mask.width / 2,
        y: element.mask.y + element.y - element.mask.height / 2
      }}
      onMove={handleMaskMove}
      onResize={handleMaskResize}
      onClick={onSelect}
      hide={!isSelected}
      dimension={{
        width: element.mask.width,
        height: element.mask.height
      }}
    ></DragHandler>
  );
}
