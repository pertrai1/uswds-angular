import {
  Component,
  AfterViewInit,
  ElementRef,
  input,
  viewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface ResponsiveMenuItem {
  label: string;
  route: string;
}

@Component({
  selector: "responsive-menu",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./responsive-menu.component.html",
  styleUrls: ["./responsive-menu.component.css"],
})
export class ResponsiveMenuComponent implements AfterViewInit {
  readonly items = input<ResponsiveMenuItem[]>();

  readonly menuListRef = viewChild<ElementRef<HTMLUListElement>>("menuList");
  readonly moreMenuRef = viewChild<ElementRef<HTMLLIElement>>("moreMenu");
  readonly moreDropdownRef =
    viewChild<ElementRef<HTMLUListElement>>("moreDropdown");

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit(): void {
    this.updateMenu();
    this.resizeObserver = new ResizeObserver(() => this.updateMenu());
    this.resizeObserver.observe(this.menuListRef()?.nativeElement as Element);
    this.setupKeyboardSupport();
  }

  updateMenu(): void {
    const menuList = this.menuListRef()?.nativeElement;
    const moreMenu = this.moreMenuRef()?.nativeElement;
    const moreDropdown = this.moreDropdownRef()?.nativeElement;

    if (!menuList || !moreMenu || !moreDropdown) return;

    Array.from(moreDropdown.children).forEach((li) => {
      menuList.insertBefore(li, moreMenu);
    });

    const items = Array.from(menuList.querySelectorAll("li")).filter(
      (li) => li !== moreMenu
    );

    moreMenu.classList.remove("hidden");
    void menuList.offsetWidth;

    const availableWidth = menuList.offsetWidth;
    let totalWidth = moreMenu.offsetWidth;
    const overflow: HTMLLIElement[] = [];

    for (const li of items) {
      totalWidth += li.offsetWidth;
      if (totalWidth > availableWidth) {
        overflow.push(li);
      }
    }

    if (overflow.length > 0) {
      overflow.forEach((li) => moreDropdown.appendChild(li));
      moreMenu.classList.remove("hidden");
      requestAnimationFrame(() => {
        if ((moreDropdown as any).matches?.(":popover-open")) {
          this.trapFocusInsidePopover();
        }
      });
    } else {
      moreMenu.classList.add("hidden");
      if ((moreDropdown as any).matches?.(":popover-open")) {
        (moreDropdown as any).hidePopover();
      }
    }
  }

  trapFocusInsidePopover(): void {
    const popover = this.moreDropdownRef()?.nativeElement;
    if (!popover) return;

    const focusable = popover.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      if (event.key === "Escape") {
        (popover as any).hidePopover?.();
        this.moreMenuRef()?.nativeElement.querySelector("button")?.focus();
      }
    };

    popover.addEventListener("keydown", handleKeydown);
    const cleanup = () => {
      popover.removeEventListener("keydown", handleKeydown);
      popover.removeEventListener("toggle", cleanup);
    };
    popover.addEventListener("toggle", cleanup);
  }

  setupKeyboardSupport(): void {
    const menuListEl = this.menuListRef()?.nativeElement;
    const dropdown = this.moreDropdownRef()?.nativeElement;
    const moreButton =
      this.moreMenuRef()?.nativeElement.querySelector("button");

    if (!menuListEl || !dropdown || !moreButton) return;

    menuListEl.addEventListener("keydown", (event: KeyboardEvent) => {
      const focusable = menuListEl.querySelectorAll(
        '[role="menuitem"]'
      ) as NodeListOf<HTMLElement>;
      const index = Array.from(focusable).indexOf(
        document.activeElement as HTMLElement
      );

      if (event.key === "ArrowRight") {
        const next = focusable[(index + 1) % focusable.length];
        next.focus();
        event.preventDefault();
      } else if (event.key === "ArrowLeft") {
        const prev =
          focusable[(index - 1 + focusable.length) % focusable.length];
        prev.focus();
        event.preventDefault();
      } else if (event.key === "Escape") {
        if ((dropdown as any).matches?.(":popover-open")) {
          (dropdown as any).hidePopover();
          moreButton.focus();
        }
      }
    });
  }
}
