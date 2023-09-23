import { Injectable } from '@angular/core';
import { User } from 'src/app/api/models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  getItems(key: string): User[] | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
