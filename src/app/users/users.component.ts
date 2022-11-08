import { Component, OnInit } from '@angular/core';
import {User, UserService} from "../services/user.service";
import {ConfirmationService, LazyLoadEvent, MessageService} from "primeng/api";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  totalRecords: number = 0;
  emailDialog: boolean = false;
  email: string = '';
  emailDialogSubmitted: boolean = false;
  lastEvent: LazyLoadEvent = {};
  suspendDialog: boolean = false;
  suspendDialogSubmitted: boolean = false;
  suspendUntil: Date = new Date(Date.now());
  suspendUserEmail: string = '';

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  loadUsers(event: LazyLoadEvent) {
    this.lastEvent = event;
    this.userService.queryUsers({
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    }).subscribe(response => {
      this.users = response.result;
      this.totalRecords = response.totalRecordsCount;
      event.forceUpdate?.();
    });
  }

  inviteNewUserDialog() {
    this.email = '';
    this.emailDialogSubmitted = false;
    this.emailDialog = true;
  }

  inviteUser() {
    this.userService.inviteNewUser(this.email).subscribe({
      next: _ => {
        this.forceUpdateTable();
        this.emailDialog = false;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unsuccessful',
          detail:  error.status == 400 ? error.error[0].message : 'User not invited',
          life: 3000
        });
      }
    });
  }

  private forceUpdateTable(){
    this.loadUsers(this.lastEvent);
  }

  reInviteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to resend the confirmation email for ${user.email}?`,
      accept: () => {
        if (user.email == null)
          return;
        this.userService.resendInvitation(user.email).subscribe({
          next: _ => {
            this.loadUsers(this.lastEvent);
            this.emailDialog = false;
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Unsuccessful',
              detail:  error.status == 400 ? error.error[0].message : 'User not invited',
              life: 3000
            });
          }
        });
      }
    });
  }

  suspendUser(user: User) {
    if (user.email == null)
      return;
    this.suspendUserEmail = user.email;
    this.suspendDialog = true;
  }

  suspenUserUntil() {
    this.userService.lockoutUser(this.suspendUserEmail, this.suspendUntil).subscribe({
      next: _ => {
        this.forceUpdateTable();
        this.suspendDialog = false;
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unsuccessful',
          detail: error.status == 400 ? error.error[0].message : 'User not suspended',
          life: 3000
        });
      }
    });
  }

  unsuspendUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to unsuspend ${user.email}?`,
      accept: () => {
        if (user.email == null)
          return;
        this.userService.unsuspendUser(user.email).subscribe({
          next: _ => {
            this.loadUsers(this.lastEvent);
            this.emailDialog = false;
          },
          error: error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Unsuccessful',
              detail: error.status == 400 ? error.error[0].message : 'User unsuspension failed',
              life: 3000
            });
          }
        });
      }
    });
  }

}
