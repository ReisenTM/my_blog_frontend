const STORAGE_KEY = 'reisen-token';
export const ROLE_ADMIN = 2;

type Listener = () => void;

export interface AuthState {
  token: string | null;
  role: number | null;
  username: string | null;
  payload: { username?: string; role?: number } | null;
}

const listeners = new Set<Listener>();

const hasWindow = typeof window !== 'undefined';

const getStorage = (): Storage | null => {
  if (!hasWindow) return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const decodeJwtPayload = (token: string) => {
  if (!hasWindow) return null;
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = window.atob(normalized);
    const json = decodeURIComponent(
      decoded
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as { username?: string; role?: number };
  } catch {
    return null;
  }
};

const defaultState: AuthState = {
  token: null,
  role: null,
  username: null,
  payload: null,
};

const computeState = (): AuthState => {
  const storage = getStorage();
  if (!storage) return defaultState;
  const token = storage.getItem(STORAGE_KEY);
  if (!token) {
    return defaultState;
  }
  const payload = decodeJwtPayload(token);
  return {
    token,
    payload,
    role: payload?.role ?? null,
    username: payload?.username ?? null,
  };
};

let currentState = computeState();

const payloadEquals = (a: AuthState['payload'], b: AuthState['payload']) =>
  (a?.username ?? null) === (b?.username ?? null) && (a?.role ?? null) === (b?.role ?? null);

const stateEquals = (next: AuthState) =>
  currentState.token === next.token &&
  currentState.role === next.role &&
  currentState.username === next.username &&
  payloadEquals(currentState.payload, next.payload);

const notify = () => {
  listeners.forEach((listener) => listener());
};

const updateState = () => {
  const next = computeState();
  if (!stateEquals(next)) {
    currentState = next;
    notify();
  }
  return currentState;
};

export const readAuthState = (): AuthState => currentState;

export const setAuthToken = (token: string | null) => {
  const storage = getStorage();
  if (!storage) return;
  if (token) {
    storage.setItem(STORAGE_KEY, token);
  } else {
    storage.removeItem(STORAGE_KEY);
  }
  updateState();
};

export const getAuthToken = () => {
  const storage = getStorage();
  return storage?.getItem(STORAGE_KEY) ?? null;
};

export const subscribeAuth = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

if (hasWindow) {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      updateState();
    }
  });
}
