import { Element, Path } from '@/stores/elements';
import { scalePathData } from '../canvas/render-path';

type Props = {
  element: Element & Path;
  onSelect: (e: React.MouseEvent) => void;
};

export function PathRenderer({ element, onSelect }: Props) {
  let {
    pathProps: { strokeWidth = 1 },
    width,
    height
  } = element;
  strokeWidth = Number(strokeWidth);
  const pathData = scalePathData(element.pathProps.d!, width, height, strokeWidth);
  return (
    <svg
      onClick={onSelect}
      viewBox={`${-strokeWidth} ${-strokeWidth} ${width + strokeWidth}, ${height + strokeWidth}`}
    >
      <clipPath id={element.clipPathId}>
        <path
          d={pathData}
          vectorEffect="non-scaling-stroke"
          stroke="transparent"
          strokeWidth={strokeWidth}
        />
      </clipPath>
      <path
        d={pathData}
        stroke={element.pathProps.stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={element.pathProps.strokeLinecap}
        strokeDasharray={element.pathProps.strokeDasharray}
        strokeMiterlimit={strokeWidth * 2}
        clipPath={element.clipPathId}
        fill={element.svgProps.fill}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
