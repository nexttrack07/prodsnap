import React from 'react';
import { ImageType } from '../store';

type Props = {
  width: number;
  height: number;
  border: ImageType['border'];
  uid: string;
};

const BorderMap: Record<ImageType['border']['id'], React.FC<any>> = {
  none: () => null,
  circle: RenderCircleBorder,
  rectangle: RenderRectangleBorder
  // pentagon: RenderPentagonBorder,
  // star: RenderStarBorder
};

export const RenderBorder = ({ width, height, border, uid }: Props) => {
  return BorderMap[border.id]({ width, height, border, uid });
};

function RenderCircleBorder({
  width,
  height,
  border,
  uid
}: {
  width: number;
  height: number;
  border: ImageType['border'];
  uid: string;
}) {
  const radius = Math.max(width, height) / 2;
  return (
    <circle
      cx={radius}
      cy={radius}
      r={radius}
      fill="none"
      stroke={border.stroke}
      strokeWidth={border.strokeWidth}
      id={`circle-${uid}`}
    />
  );
}

function RenderRectangleBorder({
  width,
  height,
  border,
  uid
}: {
  width: number;
  height: number;
  border: ImageType['border'];
  uid: string;
}) {
  return (
    <rect
      width={width}
      height={height}
      fill="none"
      stroke={border.stroke}
      strokeWidth={border.strokeWidth}
      id={`rectangle-${uid}`}
    />
  );
}

function RenderPentagonBorder({
  width,
  height,
  border,
  uid
}: {
  width: number;
  height: number;
  border: ImageType['border'];
  uid: string;
}) {
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
      stroke={border.stroke}
      strokeWidth={border.strokeWidth}
      id={`pentagon-${uid}`}
    />
  );
}

function RenderStarBorder({
  width,
  height,
  border,
  uid
}: {
  width: number;
  height: number;
  border: ImageType['border'];
  uid: string;
}) {
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
      stroke={border.stroke}
      strokeWidth={border.strokeWidth}
      id={`star-${uid}`}
    />
  );
}
