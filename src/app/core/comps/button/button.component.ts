import { Component, Input } from '@angular/core';

export interface ButtonConfig {
  label: string;
  backgroundColor: string;
  color: string;
  boxShadow: string;
  action: () => void;
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() config: ButtonConfig;
  @Input() disabled: boolean;

  getButtonBg(): string {
    return this.disabled ? 'var(--unnamed-color-ccd2e2)' : this.config.backgroundColor;
  }
}
