import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type AppState = {
  balance: number | null;
  alias: string | null;
  isBalanceLoading: boolean;
  toasts: Toast[];
};

type AppActions = {
  setBalance: (balance: number) => void;
  setAlias: (alias: string) => void;
  setBalanceLoading: (loading: boolean) => void;
  pushToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
  resetClientState: () => void;
};

const initialState: AppState = {
  balance: null,
  alias: null,
  isBalanceLoading: false,
  toasts: [],
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,
  setBalance: (balance) => set({ balance }),
  setAlias: (alias) => set({ alias }),
  setBalanceLoading: (isBalanceLoading) => set({ isBalanceLoading }),
  pushToast: (message, variant = "info") =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
          message,
          variant,
        },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
  resetClientState: () => set(initialState),
}));
