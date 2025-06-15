import { Component, output, input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * The AlertComponent provides a reusable alert component that follows the USWDS design system.
 * It supports multiple alert types and can be configured with various options.
 *
 * Example usage:
 * ```html
 * <app-alert
 *   type="success"
 *   heading="Success Alert"
 *   [isSlim]="true"
 *   [isNoIcon]="false"
 *   [isDismissible]="true"
 *   (dismissed)="handleDismiss()"
 * >
 *   <p>This is the alert content. You can put any HTML here.</p>
 * </app-alert>
 * ```
 */
@Component({
  selector: "app-alert",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.scss"],
})
export class AlertComponent {
  /**
   * The type of alert to display. Supports the following values:
   * - "success": Green alert for successful actions
   * - "warning": Yellow alert for warnings
   * - "error": Red alert for errors
   * - "info": Blue alert for informational messages
   * - "emergency": Dark red alert for emergency notifications
   *
   * @default "info"
   * @example <app-alert type="success"></app-alert>
   */
  type = input<"success" | "warning" | "error" | "info" | "emergency">("info");

  /**
   * Optional heading text for the alert. If not provided, the heading will not be shown.
   *
   * @default ""
   * @example <app-alert heading="Alert Heading"></app-alert>
   */
  heading = input<string>("");

  /**
   * Whether to display the alert in a slim variation with reduced padding.
   *
   * @default false
   * @example <app-alert [isSlim]="true"></app-alert>
   */
  isSlim = input<boolean>(false);

  /**
   * Whether to hide the icon in the alert. When true, no icon will be shown.
   *
   * @default false
   * @example <app-alert [isNoIcon]="true"></app-alert>
   */
  isNoIcon = input<boolean>(false);

  /**
   * Whether to show a dismiss button that allows users to close the alert.
   * When the dismiss button is clicked, the `dismissed` event will be emitted.
   *
   * @default false
   * @example <app-alert [isDismissible]="true"></app-alert>
   */
  isDismissible = input<boolean>(false);

  /**
   * Event emitted when the alert's dismiss button is clicked.
   * The parent component should handle this event to remove the alert from the DOM.
   *
   * @example
   * ```html
   * <app-alert (dismissed)="handleDismiss()"></app-alert>
   * ```
   */
  dismissed = output<void>();

  /**
   * Handles the dismiss action when the alert's dismiss button is clicked.
   * Emits the `dismissed` event to notify the parent component.
   */
  dismiss(): void {
    this.dismissed.emit();
  }
}
