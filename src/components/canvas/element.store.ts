import { atom } from 'jotai';
import { CanvasElementType, CanvasItemType } from './types';

export const elementsAtom = atom<CanvasElementType[]>([]);
export const selectedElementsAtom = atom<CanvasElementType[]>([]);
export const activeElementAtom = atom<CanvasElementType | null>(null);
export const groupsByIdAtom = atom<{ [key: string]: CanvasElementType[] }>({});

export const addElementAtom = atom(null, (_, set, newEl: CanvasItemType) => {
    set(elementsAtom, (elements) => [...elements, atom(newEl)]);
});