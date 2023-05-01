import { create } from 'zustand';
import { SidepanelSearchState, createSidepanelSearchSlice } from './sidepanel-search.slice';

type BoundStore = SidepanelSearchState;

export const useStore = create<BoundStore>((...a) => ({
  ...createSidepanelSearchSlice(...a),
}))