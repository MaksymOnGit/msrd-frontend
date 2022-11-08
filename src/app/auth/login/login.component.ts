import {Component, OnInit} from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {AuthService} from "../../core/services/auth.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {filter, switchMap, tap} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit{

    password!: string;
    private returnUrl?: string;

    constructor(public layoutService: LayoutService,
                public authService: AuthService,
                private messageService: MessageService,
                private router: Router,
                private route: ActivatedRoute
                ) { }

  ngOnInit(): void {
    this.forwarding();

    this.route.queryParams.subscribe(params =>{
      if (params['returnUrl'])
        this.returnUrl = params['returnUrl'];
    });
  }

  public login(email: string, password: string)
  {
    this.authService.login(email, password).then(
      succees => {
        this.forwarding();
      },
      error => {
        this.messageService.add({severity:'error', summary:'Error', detail:error.error.error_description});
      });
  }

  private forwarding(){
    this.authService.isDoneLoading.pipe(
      filter(isDone => isDone),
      switchMap(_ => this.authService.isAuthenticated)
    ).subscribe(isAuthenticated => isAuthenticated && this.router.navigateByUrl(this.returnUrl ?? '/'));
  }
}
