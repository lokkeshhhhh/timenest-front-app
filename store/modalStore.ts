import { create } from 'zustand';

export type AppModalVariant = 'success' | 'error' | 'warning' | 'info';

export interface AppModalAction {
  label: string;
  onPress?: () => void;
  /** Renders this action (must be the last one) in the error color. */
  destructive?: boolean;
}

export interface ShowAppModalOptions {
  variant?: AppModalVariant;
  title: string;
  message?: string;
  /** Defaults to a single "OK" button. The LAST action renders as the primary button; any earlier ones render as plain text (e.g. "Cancel"). */
  actions?: AppModalAction[];
}

interface ModalState {
  visible: boolean;
  variant: AppModalVariant;
  title: string;
  message?: string;
  actions: AppModalAction[];
  show: (options: ShowAppModalOptions) => void;
  hide: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  visible: false,
  variant: 'info',
  title: '',
  message: undefined,
  actions: [{ label: 'OK' }],
  show: ({ variant = 'info', title, message, actions }) =>
    set({
      visible: true,
      variant,
      title,
      message,
      actions: actions && actions.length > 0 ? actions : [{ label: 'OK' }],
    }),
  hide: () => set({ visible: false }),
}));

/**
 * Imperative entry point mirroring Alert.alert's ergonomics — callable from
 * anywhere (including outside React, e.g. a catch block) with no local
 * `visible` state needed per screen — but rendered through the single
 * <AppModal/> mounted at the root layout, using the app's own design system
 * instead of an unstyled OS dialog.
 */
export function showAppModal(options: ShowAppModalOptions) {
  useModalStore.getState().show(options);
}
