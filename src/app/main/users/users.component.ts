import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'src/app/api/models/user';
import { UserService } from 'src/app/api/services/user.service';
import { ButtonConfig } from 'src/app/core/comps/button/button.component';
import { PopupConfig } from 'src/app/core/comps/popup/popup.component';
import { SimpleTableConfig } from 'src/app/core/comps/simple-table/simple-table.component';
import { DialogMode } from 'src/app/core/services/trigger-dialog.service';
import { TriggerDialogService } from 'src/app/core/services/trigger-dialog.service';
import { TriggerPopupService } from 'src/app/core/services/trigger-popup.service';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 })),
      ]),
    ]),
  ]
})
export class UsersComponent implements OnInit {

  users: User[];

  tableConfig: SimpleTableConfig;
  popupConfig: PopupConfig;
  buttonConfig: ButtonConfig = {
    label: 'Create User',
    backgroundColor: 'var(--unnamed-color-2e8ff0)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: 'box-shadow: 0px 5px 8px var(--unnamed-color-2e8ff0)',
    action: this.handleCreateUser.bind(this)
  }

  popupTimeout: any;

  constructor(
    public triggerDialogService: TriggerDialogService,
    private usersService: UserService,
    private triggerPopupService: TriggerPopupService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();

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
        this.cd.detectChanges();
      }
    });
  }

  getData() {
    this.usersService.getUsers()
      .pipe(
        untilDestroyed(this)
      ).subscribe((value: User[]) => {
        this.users = value || [];
        this.setTableConfig(this.users);
      });
  }

  handleEditUser(user: User) {
    this.triggerDialogService.open({ 
      mode: DialogMode.Edit, 
      user,
      callback: this.getData.bind(this)
    });
  }

  handleCreateUser() {
    this.triggerDialogService.open({ 
      mode: DialogMode.Create,
      callback: this.getData.bind(this)
    });
  }

  private setTableConfig(users: User[]) {
    this.tableConfig = {
      headers: ['Username', 'First Name', 'Last Name', 'Email', 'Type'],
      data: users,
      excludeFields: ['password']
    }
  }

  closePopup() {
    this.triggerPopupService.close();
  }

}
