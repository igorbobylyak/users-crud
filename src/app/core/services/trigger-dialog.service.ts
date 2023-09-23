import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/api/models/user';

export interface DialogData {
  mode: DialogMode;
  user?: User
  callback: () => void;
}

export enum DialogMode {
  Create = 'create',
  Edit = 'edit'
}

@Injectable({
  providedIn: 'root'
})
export class TriggerDialogService {

  private triggerSubject: BehaviorSubject<DialogData> = new BehaviorSubject<DialogData>(null);
  data$: Observable<DialogData> = this.triggerSubject.asObservable();

  constructor() { }

  open(value: DialogData) {
    this.triggerSubject.next(value);
  }

  close() {
    this.triggerSubject.next(null);
  }
}
