import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'src/app/api/models/user';
import { UserService } from 'src/app/api/services/user.service';
import { fadeInOut200ms } from 'src/app/core/animations/fadeInOut.animation';
import { ButtonConfig } from 'src/app/core/comps/button/button.component';
import { SimpleTableConfig } from 'src/app/core/comps/simple-table/simple-table.component';
import { DialogMode } from 'src/app/core/services/trigger-dialog.service';
import { TriggerDialogService } from 'src/app/core/services/trigger-dialog.service';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [fadeInOut200ms]
})
export class UsersComponent implements OnInit {

  users: User[];

  tableConfig: SimpleTableConfig;
  buttonConfig: ButtonConfig = {
    label: 'Create User',
    backgroundColor: 'var(--unnamed-color-2e8ff0)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: '0px 5px 8px var(--unnamed-color-2e8ff0)',
    action: this.handleCreateUser.bind(this)
  }

  constructor(
    public triggerDialogService: TriggerDialogService,
    private usersService: UserService
  ) {}

  ngOnInit(): void {
    this.getData();
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
}
