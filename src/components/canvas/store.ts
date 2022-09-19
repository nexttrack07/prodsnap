import { atom, WritableAtom } from 'jotai';
import { SetStateAction } from 'react';

type Action<T> = SetStateAction<T>;

export type SVGAttributes = {
  width: number;
  height: number;
  left: number;
  top: number;
}

export type SVGType = {
  name: string;
  type: string;
  value: string,
  attributes: SVGAttributes,
  children?: SVGType[]
}

export type ElementType = WritableAtom<SVGType, Action<SVGType>>

function getRandomInt(min: number = 100, max: number = 500) {
  const n = Math.ceil(min);
  const x = Math.floor(max);
  return Math.floor(Math.random() * (x - n + 1)) + n;
}

type DefaultFn = () => ElementType;

const defaultEl: DefaultFn = () => atom<SVGType>({
  name: 'svg',
  type: 'element',
  value: '',
  attributes: {
    width: 100,
    height: 100,
    left: getRandomInt(),
    top: getRandomInt(),
  },
  children: [{
    type: 'element',
    name: 'rect',
    value: '',
    attributes: {
      top: 0,
      left: 0,
      width: 100,
      height: 100,
    },
  }],
});

export const elementsAtom = atom<ElementType[]>([]);
