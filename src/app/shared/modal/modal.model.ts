// Extend size support if needed
export type ModalSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface ModalOptions {
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  id?: string;
  data?: any;
}

// ✅ Make ModalRef generic so it works with any return type
export interface ModalRef<T = any> {
  close(result?: T): void;
  afterClosed(): Promise<T | null>;
}

export interface ModalComponentInstance {
  open: boolean | { set: (value: boolean) => void };
  openChange?: { subscribe: (fn: (open: boolean) => void) => void };
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  id?: string;
  data?: any;
}
