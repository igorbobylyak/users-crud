import { Component, Input } from '@angular/core';

export interface PopupConfig {
  text: string;
  classes: string[];
  timeout: number;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input() config: PopupConfig;
}
