import { Component } from '@angular/core';
import { PopupConfig } from './core/comps/popup/popup.component';
import { TriggerPopupService } from './core/services/trigger-popup.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fadeInOut200ms } from './core/animations/fadeInOut.animation';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOut200ms]
})
export class AppComponent {

  popupConfig: PopupConfig;
  popupTimeout: any;

  constructor(
    private triggerPopupService: TriggerPopupService
  ) {
    this.triggerPopupService.message$.pipe(
      untilDestroyed(this)
    ).subscribe((value: PopupConfig) => {
      this.popupConfig = value;

      if (value) {
        if (this.popupTimeout) {
          clearTimeout(this.popupTimeout);
        }
  
        this.popupTimeout = setTimeout(() => {
          this.popupConfig = null;
        }, value.timeout);
      }
    });
  }

  closePopup() {
    this.triggerPopupService.close();
  }
}
