import React from 'react';
import { ImageType } from '../store';

type Props = {
  width: number;
  height: number;
  mask: ImageType['mask'];
  uid: string;
};

const MaskMap: Record<ImageType['mask']['id'], React.FC<any>> = {
  none: () => null,
  circle: RenderCircleMask,
  rectangle: RenderRectangleMask
  // pentagon: RenderPentagonMask,
  // star: RenderStarMask
};

export const RenderMask = ({ width, height, mask, uid }: Props) => {
  return MaskMap[mask.id]({ width, height, mask, uid });
};

function RenderCircleMask({
  width,
  mask,
  uid
}: {
  width: number;
  mask: ImageType['mask'];
  uid: string;
}) {
  return (
    <circle
      cx={width / 2}
      cy={width / 2}
      r={width / 2}
      fill="none"
      stroke={mask.stroke}
      strokeWidth={mask.strokeWidth}
      id={`circle-${uid}`}
    />
  );
}

function RenderRectangleMask({
  width,
  height,
  mask,
  uid
}: {
  width: number;
  height: number;
  mask: ImageType['mask'];
  uid: string;
}) {
  console.log('helo', mask);
  return (
    <rect
      width={width}
      height={height}
      fill="none"
      stroke={mask.stroke}
      strokeWidth={mask.strokeWidth}
      id={`rectangle-${uid}`}
    />
  );
}

function RenderPentagonMask({
  width,
  height,
  mask,
  uid
}: {
  width: number;
  height: number;
  mask: ImageType['mask'];
  uid: string;
}) {
  console.log('hello', mask);

  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;

  const angleIncrement = (2 * Math.PI) / 5;
  let angle = -Math.PI / 2;

  const points = Array(5)
    .fill(null)
    .map((_, i) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      angle += angleIncrement;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <polygon
      points={points}
      fill="none"
      stroke={mask.stroke}
      strokeWidth={mask.strokeWidth}
      id={`pentagon-${uid}`}
    />
  );
}

function RenderStarMask({
  width,
  height,
  mask,
  uid
}: {
  width: number;
  height: number;
  mask: ImageType['mask'];
  uid: string;
}) {
  console.log('hello', mask);

  const outerRadius = Math.min(width, height) / 2;
  const innerRadius = outerRadius * 0.381966; // Golden ratio approximation
  const centerX = width / 2;
  const centerY = height / 2;

  const numPoints = 10; // 5 points for star and 5 for inner vertices
  const angleIncrement = (2 * Math.PI) / numPoints;
  let angle = -Math.PI / 2;

  const points = Array(numPoints)
    .fill(null)
    .map((_, i) => {
      const isOuter = i % 2 === 0;
      const radius = isOuter ? outerRadius : innerRadius;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      angle += angleIncrement;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <polygon
      points={points}
      fill="none"
      stroke={mask.stroke}
      strokeWidth={mask.strokeWidth}
      id={`star-${uid}`}
    />
  );
}
