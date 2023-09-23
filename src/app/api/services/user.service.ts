import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  USERS_KEY = 'USERS';

  constructor(
    private localStorageService: LocalStorageService
  ) {}

  getUsers(): Observable<User[]> {
    return of(this.localStorageService.getItems(this.USERS_KEY));
  }

  createUser(user: User): Observable<User> {
    const users: User[] = this.localStorageService.getItems(this.USERS_KEY) || [];
    users.push(user);
    this.localStorageService.setItem(this.USERS_KEY, users);
    return of(user);
  }

  updateUser(oldUser: User, user: Partial<User>): Observable<User> {
    const users = this.localStorageService.getItems(this.USERS_KEY) || [];
    const index = users.findIndex(u => u.username === oldUser.username);
    users[index] = {
      ...users[index],
      ...user
    };
    this.localStorageService.setItem(this.USERS_KEY, users);
    return of(users[index]);
  }

  deleteUser(user: User): Observable<string> {
    const users = this.localStorageService.getItems(this.USERS_KEY) || [];
    this.localStorageService.setItem(this.USERS_KEY, users.filter(u => u.username !== user.username));
    return of('Success');
  }

  checkUsernameUniqueness(username: string): Observable<boolean> {
    const users: User[] = this.localStorageService.getItems(this.USERS_KEY) || [];
    const isUnique = !users.some(u => u.username === username);
    return of(isUnique);
  }
}
