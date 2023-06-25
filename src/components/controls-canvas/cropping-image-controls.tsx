import { SetStateAction } from 'jotai';
import { Draggable, Resizable, ImageState, ImageType, MaskType } from '../canvas/store';
import { uuid } from '@/utils';
import { DragHandler } from '../canvas/drag-handler';

export type MaskedImageType = ImageType & { state: ImageState.Cropping; mask: MaskType };

type Props = {
  element: MaskedImageType;
  setElement: (update: SetStateAction<MaskedImageType>) => void;
};

export function MaskedImageControls({ element, setElement }: Props) {
  const id = uuid();
  const s = element.border.strokeWidth;
  const { x, y, width, height, rotation = 0 } = element;

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
    console.log('handleMaskResize: ', x, y, width, height);
    setElement((prev) => ({
      ...prev,
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
    <>
      <svg
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }}
        viewBox={`${-s} ${-s} ${width + s * 2} ${height + s * 2}`}
      >
        <image
          clipPath={id}
          preserveAspectRatio="xMidYMid slice"
          href={element.currentUrl ?? element.url}
          width={width}
          height={height}
          mask="url(#svgmask1)"
        />
        <use href={`#${element.border.id}-${id}`} />
        {element.mask && (
          <mask id="svgmask1">
            <circle
              fill="#ffffff"
              cx={element.mask.x}
              cy={element.mask.y}
              r={element.mask.width / 2}
            ></circle>
            <rect
              opacity={0.4}
              x="0"
              y="0"
              width={element.width}
              height={element.height}
              fill="white"
            />
          </mask>
        )}
      </svg>
      <DragHandler
        position={{
          x: element.mask.x + element.x - element.mask.width / 2,
          y: element.mask.y + element.y - element.mask.height / 2
        }}
        onMove={handleMaskMove}
        onResize={handleMaskResize}
        hide={false}
        dimension={{
          width: element.mask.width,
          height: element.mask.height
        }}
      ></DragHandler>
    </>
  );
}
