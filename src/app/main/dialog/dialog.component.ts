import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TriggerDialogService } from '../../core/services/trigger-dialog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserType } from 'src/app/api/models/user';
import { ButtonConfig } from 'src/app/core/comps/button/button.component';
import { get, isEqual, omit, omitBy } from 'lodash-es';
import { DialogData, DialogMode } from 'src/app/core/services/trigger-dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserService } from 'src/app/api/services/user.service';
import { take } from 'rxjs';
import { ValidationType } from 'src/app/core/directives/form-validation.directive';
import { TriggerPopupService } from 'src/app/core/services/trigger-popup.service';


@UntilDestroy()
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  // Dialog modes
  Create = DialogMode.Create;
  Edit = DialogMode.Edit;

  isCreate: boolean;

  // User types
  Admin = UserType.ADMIN;
  Driver = UserType.DRIVER;

  // Validation types
  EMAIL = ValidationType.EMAIL;
  PASSWORD = ValidationType.PASSWORD;
  REPEAT_PASSWORD = ValidationType.REPEAT_PASSWORD;
  USERNAME = ValidationType.USERNAME;

  form: FormGroup<{
    username: FormControl<string>;
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    repeatPassword: FormControl<string>;
    type: FormControl<UserType>;
  }>;

  dialogData: DialogData;

  createButton: ButtonConfig = {
    label: 'Create',
    backgroundColor: 'var(--unnamed-color-2e8ff0)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: '0px 5px 8px var(--unnamed-color-2e8ff0)',
    action: this.handleCreate.bind(this)
  };

  saveButton: ButtonConfig = {
    label: 'Save',
    backgroundColor: 'var(--unnamed-color-2e8ff0)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: '0px 5px 8px var(--unnamed-color-2e8ff0)',
    action: this.handleSave.bind(this)
  };

  deleteButton: ButtonConfig = {
    label: 'Delete',
    backgroundColor: 'var(--unnamed-color-f44682)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: '0px 5px 8px var(--unnamed-color-f44682)',
    action: this.handleDelete.bind(this)
  };
  
  constructor(
    private fb: FormBuilder,
    private triggerDialogService: TriggerDialogService,
    private cd: ChangeDetectorRef,
    private usersService: UserService,
    private triggerPopupService: TriggerPopupService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.triggerDialogService.data$
      .pipe(
        untilDestroyed(this)
      ).subscribe((value: DialogData) => {
        this.form.reset();
        if (value) {
          this.dialogData = value;

          if (value.mode === this.Edit) {
            this.setFormValues(value.user);
          }
        }

        this.cd.detectChanges();
      });
  }

  private createForm() {
    this.form = this.fb.group({
      username: new FormControl<string>(null, [Validators.required]),
      firstName: new FormControl<string>(null, [Validators.required]),
      lastName: new FormControl<string>(null, [Validators.required]),
      email: new FormControl<string>(null, [Validators.required]),
      password: new FormControl<string>(null, Validators.required),
      repeatPassword: new FormControl<string>(null, Validators.required),
      type: new FormControl<UserType>(null, [Validators.required])
    });
  }

  private setFormValues(user: User) {
    for (const key of Object.keys(this.form.controls)) {
      const control = this.form.get(key);

      if (key === 'repeatPassword') {
        control?.setValue(user.password, { emitEvent: false });
        control?.setErrors(null);
        continue;
      }

      control?.setValue(get(user, key), { emitEvent: false });
      control?.setErrors(null);
    }
  }

  closeDialog() {
    this.triggerDialogService.close();
  }

  handleCreate() {
    const formValue = this.form.value;
    const newUser: User = omit(formValue, ['repeatPassword']) as User;

    this.usersService.createUser(newUser)
      .pipe(
        take(1)
      ).subscribe((value: User) => {
        this.dialogData.callback();
        this.triggerPopupService.showSuccess('User created');
        this.closeDialog();
      }, err => this.triggerPopupService.showError(err));
  }

  handleSave() {
    const original = this.dialogData.user;
    const edited = omit(this.form.value, ['repeatPassword']);
    const changes = omitBy(edited, (value, key) => isEqual(value, original[key as keyof User]));
    
    if (!changes) return;

    this.usersService.updateUser(this.dialogData.user, changes)
      .pipe(
        take(1)
      ).subscribe((value: User) => {
        this.dialogData.callback();
        this.triggerPopupService.showSuccess('User updated');
        this.closeDialog();
      }, err => this.triggerPopupService.showError(err));
  }

  handleDelete() {
    this.usersService.deleteUser(this.dialogData.user)
      .pipe(
        take(1)
      ).subscribe((value: string) => {
        this.dialogData.callback();
        this.triggerPopupService.showSuccess('User deleted');
        this.closeDialog();
      }, err => this.triggerPopupService.showError(err));
  }

  isInvalid() {
    return !this.form.valid;
  }

  hasError(controlName: string, errorName: string | string[]) {
    if (this.form) {
      if (Array.isArray(errorName)) {
        const hasError = errorName.reduce((acc: boolean, currErr: string) => {
          return acc = this.form.get(controlName)?.hasError(currErr);
        }, false);
        return hasError;
      }

      return this.form.get(controlName)?.hasError(errorName);
    }
  
    return false;
  }
}
