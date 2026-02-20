import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  isVisible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  message: "",
  type: "info",
  duration: 3000,
  showToast: ({ message, type = "info", duration = 3000 }) => {
    set({ isVisible: true, message, type, duration });
  },
  hideToast: () => set({ isVisible: false }),
}));
