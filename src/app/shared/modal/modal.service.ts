import {
  Injectable,
  ComponentRef,
  createComponent,
  inject,
  ApplicationRef,
  EnvironmentInjector,
  Type,
} from '@angular/core';
import { ModalComponentInstance,  ModalOptions, ModalRef } from './modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private modals = new Map<string, { componentRef: ComponentRef<any>; modalRef: ModalRef }>();

  open<T extends ModalComponentInstance, R = any>(
    component: Type<T>,
    options: ModalOptions = {}
  ): ModalRef<R> {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const componentRef = createComponent(component, {
      hostElement: container,
      environmentInjector: this.envInjector,
    });

    const instance = componentRef.instance;

    // Apply options to component inputs
    Object.assign(instance, {
      size: options.size ?? instance.size,
      closeOnBackdropClick: options.closeOnBackdropClick ?? instance.closeOnBackdropClick,
      closeOnEscape: options.closeOnEscape ?? instance.closeOnEscape,
      showCloseButton: options.showCloseButton ?? instance.showCloseButton,
      ariaLabelledBy: options.ariaLabelledBy ?? instance.ariaLabelledBy,
      ariaDescribedBy: options.ariaDescribedBy ?? instance.ariaDescribedBy,
      id: options.id ?? instance.id,
      data: options.data ?? instance.data,
    });

    // Open the modal
    if (isSignalOpen(instance.open)) {
      instance.open.set(true);
    } else {
      instance.open = true;
    }

    // Handle close promise
    let resolveClose!: (result: R | null) => void;
    const closePromise = new Promise<R | null>((resolve) => (resolveClose = resolve));

    const modalRef: ModalRef<R> = {
      close: (result?: R) => {
        if (isSignalOpen(instance.open)) {
          instance.open.set(false);
        } else {
          instance.open = false;
        }

        setTimeout(() => {
          this.cleanup(componentRef, container, options.id);
          resolveClose(result ?? null);
        }, 300);
      },
      afterClosed: () => closePromise,
    };

    // Detect component-side close (via signal or emitter)
    instance.openChange?.subscribe?.((isOpen: boolean) => {
      if (!isOpen) {
        this.cleanup(componentRef, container, options.id);
        resolveClose(null);
      }
    });

    if (options.id) {
      this.modals.set(options.id, { componentRef, modalRef });
    }

    this.appRef.attachView(componentRef.hostView);
    return modalRef;
  }

  closeAll(): void {
    this.modals.forEach(({ modalRef }) => modalRef.close());
    this.modals.clear();
  }

  getModalRef(id: string): ModalRef | undefined {
    return this.modals.get(id)?.modalRef;
  }

  private cleanup(componentRef: ComponentRef<any>, container: HTMLElement, id?: string): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    container.remove();

    if (id) this.modals.delete(id);
  }
}

function isSignalOpen(open: unknown): open is { set: (v: boolean) => void } {
  return typeof open === 'object' && open !== null && 'set' in open;
}
