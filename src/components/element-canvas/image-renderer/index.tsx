import { Element, Image, ImageState } from '@/stores/elements';
import { getImageDimensions, uuid } from '@/utils';
import { LoadingOverlay } from '@mantine/core';
import { SetStateAction } from 'jotai';
import { useEffect } from 'react';
import { BorderRenderer } from './border-renderer';
import { CropImage } from './crop-renderer';

type Props = {
  element: Element & Image;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  setElement: (update: SetStateAction<Element & Image>) => void;
};

export function ImageRenderer({ element, setElement, onSelect, isSelected }: Props) {
  // useEffect(() => {
  //   console.log('ImageRenderer useEffect');
  //   async function setImageDimensions(src: string) {
  //     setElement((el) => ({ ...el, state: ImageState.Loading }));

  //     try {
  //       const { width, height } = await getImageDimensions(src);
  //       setElement((el) => ({
  //         ...el,
  //         width,
  //         height
  //       }));
  //       setElement((el) => ({ ...el, state: ImageState.Normal }));
  //     } catch (error) {
  //       console.error('Failed to set image dimensions:', error);
  //     }
  //   }

  //   setImageDimensions(element.url);
  // }, []);

  const handleClick = (e: React.MouseEvent) => {
    onSelect(e);
  };

  const { width, height, x, y } = element;
  const id = uuid();
  const s = element.border.strokeWidth;

  return (
    <>
      {element.state === ImageState.Loading && (
        <div style={{ width, height, border: '1px solid rgba(0,0,0,.2)', borderRadius: 5 }}>
          <LoadingOverlay visible overlayOpacity={0.1} overlayColor="black" />
        </div>
      )}
      {element.state === ImageState.Normal && (
        <>
          <svg
            x="0"
            y="0"
            xmlSpace="preserve"
            style={{ position: 'absolute' }}
            enableBackground={`new ${-s} ${-s} ${width + s * 2} ${height + s * 2}`}
          >
            <defs>
              <clipPath id={id}>
                <BorderRenderer width={width} height={height} border={element.border} uid={id} />
              </clipPath>
            </defs>
          </svg>
          <svg viewBox={`${-s} ${-s} ${width + s * 2} ${height + s * 2}`}>
            <image
              onClick={handleClick}
              clipPath={id}
              preserveAspectRatio="xMidYMid slice"
              href={element.currentUrl ?? element.url}
              width={width}
              height={height}
            />
            <use href={`#${element.border.id}-${id}`} />
          </svg>
        </>
      )}
      {element.state === ImageState.Cropping && <CropImage element={element} />}
    </>
  );
}
