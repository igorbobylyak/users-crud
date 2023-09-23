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
      return validateEmail(control.value);
    } else if (this.validationType === ValidationType.PASSWORD) {
      return validatePassword(control.value, control.parent.get('repeatPassword'));
    } else if (this.validationType === ValidationType.REPEAT_PASSWORD) {
      return validateRepeatPassword(control.parent.get('password'), control.value);
    } else if (this.validationType === ValidationType.USERNAME) {
      return this.usersService.checkUsernameUniqueness(control.value).pipe(
        map((isUnique) => (isUnique ? null : { username: true })),
        catchError(() => of(null))
      );
    }

    return of(null);
  }
}

function validateEmail(email: string): Observable<ValidationErrors | null> {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const match = emailPattern.test(email);
  return of(isNil(email) || match ? null : { email: true });
}

function validatePassword(password: string, repeatControl: AbstractControl): Observable<ValidationErrors | null> {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasMinLength = password?.length >= 8;
  const matchPattern = hasNumber && hasLetter && hasMinLength;
  if (matchPattern) {
    const equal = password === repeatControl.value;
    if (equal) {
      repeatControl.setErrors(null);
    }
    return of(isNil(repeatControl.value) || equal ? null : { mismatch: true });
  }
  return of(matchPattern ? null : { password: true });
}

function validateRepeatPassword(passwordControl: AbstractControl, repeatPassword: string): Observable<ValidationErrors | null> {
  const equal = passwordControl.value === repeatPassword;
  if (equal) {
    passwordControl.setErrors(null);
  }
  return of(equal ? null : { repeatPassword: true });
}