import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { PopupConfig } from '../comps/popup/popup.component';
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TriggerPopupService {

  private messageSubject: Subject<PopupConfig> = new Subject<PopupConfig>(); 
  message$: Observable<PopupConfig> = this.messageSubject.asObservable();

  constructor() { }

  showSuccess(text: string, timeout: number = 3000) {
    this.messageSubject.next({
      text,
      classes: ['popup__success', 'popup__right'],
      timeout
    });
  }

  showError(err: any, timeout: number = 3000) {
    this.messageSubject.next({
      text: this.getErrorMessage(err),
      classes: ['popup__error', 'popup__left'],
      timeout
    });
  }

  close() {
    this.messageSubject.next(null);
  }

  getErrorMessage(err: any): string {
    let txt: string;
    if (typeof err === 'string') {
      txt = err;
    } else if (err instanceof HttpErrorResponse) {
      txt = err.error.message || err.message;
      txt = txt;
    } else if (err.message) {
      txt = err.message;
    } else {
      try {
        txt = JSON.stringify(err);
      } catch (e: any) {
        txt = err.toString();
      } finally {
        txt = 'Error';
      }
    }

    return txt;
  }
}
