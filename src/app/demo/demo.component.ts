import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalComponent } from "../shared/modal/modal.component";
import { ModalHeaderDirective } from "../shared/modal/modal-header.directive";
import { ModalContentDirective } from "../shared/modal/modal-content.directive";
import { ModalFooterDirective } from "../shared/modal/modal-footer.directive";
import { ModalService } from "../shared/modal/modal.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { ResponsiveMenuComponent } from "../shared/responsive-menu/responsive-menu.component";

@Component({
  selector: "app-demo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    ModalHeaderDirective,
    ModalContentDirective,
    ModalFooterDirective,
    ResponsiveMenuComponent,
    AlertComponent,
  ],
  templateUrl: "./demo.component.html",
  styleUrls: ["./demo.component.css"],
})
export class DemoComponent {
  isModalOpen = false;
  isProgrammaticModalOpen = false;
  selectedSize: "small" | "medium" | "large" = "medium";
  isInfoAlertVisible = true;

  menuItems = [
    { label: "Home", route: "/" },
    { label: "About", route: "/about" },
    { label: "Services", route: "/services" },
    { label: "Portfolio", route: "/portfolio" },
    { label: "Blog", route: "/blog" },
    { label: "Careers", route: "/careers" },
    { label: "Contact", route: "/contact" },
  ];

  constructor(private modalService: ModalService) {}

  openModalProgrammatically() {
    const modalRef = this.modalService.open(ProgrammaticModalComponent, {
      size: this.selectedSize,
      closeOnBackdropClick: true,
      closeOnEscape: true,
      showCloseButton: true,
      id: "programmatic-modal",
      data: {
        title: "Programmatically Opened Modal",
        message: "This modal was opened using the ModalService",
      },
    });

    this.isProgrammaticModalOpen = true;

    modalRef.afterClosed().then((result: any) => {
      console.log("Modal closed with result:", result);
      this.isProgrammaticModalOpen = false;
    });
  }

  onBeforeClose() {
    console.log("Modal is about to close");
  }

  onAfterOpen() {
    console.log("Modal has opened");
  }

  alertDismissed() {
    this.isInfoAlertVisible = false;
  }
}

@Component({
  selector: "app-programmatic-modal",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="usa-modal-wrapper">
      <div class="usa-modal-overlay"></div>
      <div
        class="usa-modal"
        [class.usa-modal--sm]="size === 'small'"
        [class.usa-modal--lg]="size === 'large'"
      >
        <div class="usa-modal__content">
          <div class="usa-modal__main">
            <div class="usa-modal__header">
              <h2 class="usa-modal__heading">
                {{ data?.title || "Modal Heading" }}
              </h2>
              <button
                *ngIf="showCloseButton"
                type="button"
                class="usa-button usa-modal__close"
                aria-label="Close this modal"
                (click)="close()"
              >
                <span class="usa-sr-only">Close</span>
                ×
              </button>
            </div>
            <div class="usa-modal__body">
              <p>{{ data?.message || "Modal content goes here" }}</p>
            </div>
            <div class="usa-modal__footer">
              <ul class="usa-button-group">
                <li class="usa-button-group__item">
                  <button class="usa-button" (click)="close('confirmed')">
                    Confirm
                  </button>
                </li>
                <li class="usa-button-group__item">
                  <button
                    class="usa-button usa-button--outline"
                    (click)="close('cancelled')"
                  >
                    Cancel
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class ProgrammaticModalComponent {
  size: "small" | "medium" | "large" = "medium";
  closeOnBackdropClick = true;
  closeOnEscape = true;
  showCloseButton = true;
  data: any;
  open = true;

  constructor(private modalService: ModalService) {}

  close(result?: any) {
    const modalRef = this.modalService.getModalRef("programmatic-modal");
    if (modalRef) {
      modalRef.close(result);
    }
  }
}
