import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { isNil } from '../utils/isNil';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from 'src/app/api/services/user.service';

export enum ValidationType {
  EMAIL = 'email',
  PASSWORD = 'password',
  REPEAT_PASSWORD = 'repeatPassword',
  USERNAME = 'username'
}

@Directive({
  selector: '[appFormValidation]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: FormValidationDirective,
      multi: true,
    },
  ],
})
export class FormValidationDirective implements AsyncValidator {
  @Input() validationType: ValidationType;

  constructor(
    private usersService: UserService
  ) {}

  validate(control: AbstractControl): Observable<ValidationErrors> | null {
    if (this.validationType === ValidationType.EMAIL) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const match = emailPattern.test(control.value);
      return of(isNil(control.value) || match ? null : { email: true });
    } else if (this.validationType === ValidationType.PASSWORD) {
      const password = control.value;
      const hasNumber = /\d/.test(password);
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasMinLength = password?.length >= 8;
      return of(isNil(password) || (hasNumber && hasLetter && hasMinLength) ? null : { password: true });
    } else if (this.validationType === ValidationType.REPEAT_PASSWORD) {
      const formGroup = control.parent;
      if (formGroup) {
        const password = formGroup.get('password').value;
        const repeatPassword = control.value;
        return of((isNil(password) || isNil(repeatPassword)) || password === repeatPassword ? null : { repeatPassword: true });
      }
    } else if (this.validationType === ValidationType.USERNAME) {
      return this.usersService.checkUsernameUniqueness(control.value).pipe(
        map((isUnique) => (isUnique ? null : { username: true })),
        catchError(() => of(null))
      );
    }

    return of(null);
  }
}
