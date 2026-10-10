import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  color?: 'error' | 'warning' | 'primary' | 'success';
  onConfirm: () => void | Promise<void>;
}

export interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  confirm: (options: ConfirmOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
