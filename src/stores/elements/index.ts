import { atom } from "jotai";
import { ElementGroupAtom } from "./type";

export * from './type';
export const elementGroupAtomsAtom = atom<ElementGroupAtom[]>([]);
export const activeElementGroupAtom = atom<ElementGroupAtom | null>(null);