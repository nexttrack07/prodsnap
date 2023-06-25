import { SetStateAction } from 'jotai';
import { Draggable, Resizable, ImageState, ImageType, MaskType } from '../canvas/store';
import { DragHandler } from '../canvas/drag-handler';

export type NormalImageType = ImageType & { state: ImageState.Normal; mask: MaskType };

type Props = {
  element: NormalImageType;
  setElement: (update: SetStateAction<NormalImageType>) => void;
};

export function MaskedImageControls({ element, setElement }: Props) {
  const handleMaskMove = (pos: Draggable) => {
    setElement((prev) => {
      if (prev.type === 'image' && prev.mask) {
        return {
          ...prev,
          mask: {
            ...prev.mask,
            x: prev.mask.x + pos.x,
            y: prev.mask.y + pos.y
          }
        };
      } else return prev;
    });
  };

  const handleMaskResize = ({ x, y, width, height }: Draggable & Resizable) => {
    setElement((prev) => ({
      ...prev,
      mask: {
        ...prev.mask,
        x: prev.mask.x + x,
        y: prev.mask.y + y,
        width: prev.mask.width + width,
        height: prev.mask.height + height
      }
    }));
  };

  return (
    <DragHandler
      position={{
        x: element.mask.x + element.x - element.mask.width,
        y: element.mask.y + element.y - element.mask.height
      }}
      onMove={handleMaskMove}
      onResize={handleMaskResize}
      hide={false}
      dimension={{
        width: element.mask.width * 2,
        height: element.mask.height * 2
      }}
    ></DragHandler>
  );
}
