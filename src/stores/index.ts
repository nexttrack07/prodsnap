import { create } from 'zustand';
import { LoginState, loginSlice } from './login.slice';

type BoundStore = LoginState;

export const useStore = create<BoundStore>((...a) => ({
  ...loginSlice(...a),
}))