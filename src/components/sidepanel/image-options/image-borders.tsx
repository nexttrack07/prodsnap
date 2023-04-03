import { ImageType } from '@/components/canvas/store';
import React from 'react';
import { Circle, Pentagon, Star, Rectangle, WashDrycleanOff } from 'tabler-icons-react';

export const BORDERS: { id: ImageType['border']['id']; icon: React.ReactNode }[] = [
  {
    id: 'none',
    icon: <WashDrycleanOff />
  },
  {
    id: 'circle',
    icon: <Circle />
  },
  // {
  //   id: 'pentagon',
  //   icon: <Pentagon />
  // },
  {
    id: 'rectangle',
    icon: <Rectangle />
  }
  // {
  //   id: 'star',
  //   icon: <Star />
  // }
];
