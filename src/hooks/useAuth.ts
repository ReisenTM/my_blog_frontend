import { useSyncExternalStore } from 'react';
import type { AuthState } from '../utils/auth';
import { readAuthState, subscribeAuth } from '../utils/auth';

const emptyState: AuthState = {
  token: null,
  role: null,
  username: null,
  payload: null,
};

const subscribe = typeof window === 'undefined' ? () => () => {} : subscribeAuth;
const getServerSnapshot = () => emptyState;

export const useAuth = () =>
  useSyncExternalStore(subscribe, readAuthState, getServerSnapshot);
