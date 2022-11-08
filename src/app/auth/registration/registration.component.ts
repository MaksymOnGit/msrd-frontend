import {Component, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {
  AuthService,
  ErrorResponse,
} from "../../core/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class RegistrationComponent implements OnInit {

  registrationFormData = new RegistrationFormData('', '', '', '')

  constructor(public layoutService: LayoutService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params =>{
      if (params['email'])
        this.registrationFormData.email = params['email'];

      if (params['token'])
        this.registrationFormData.invitationToken = params['token'];
    });
  }

  public onSubmit(){

    this.authService.registration({
      Email: this.registrationFormData.email,
      Password: this.registrationFormData.password,
      PasswordRepeat: this.registrationFormData.passwordRepeat,
      InvitationToken: this.registrationFormData.invitationToken
    }).subscribe({
        error: (err: HttpErrorResponse) => {
          let errorResponse: ErrorResponse[] = err.error;
          this.messageService.add({severity: 'error', summary: 'Error', detail: errorResponse[0].message});
        },
        next: _ => this.router.navigateByUrl('/auth/login')
      }
    );
  }
}

export class RegistrationFormData{
  constructor(public email: string,
              public invitationToken: string,
              public password: string,
              public passwordRepeat: string) {

  }
}
