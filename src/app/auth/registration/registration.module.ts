import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {RegistrationRoutingModule} from "./registration-routing.module";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ToastModule
  ],
  declarations: [RegistrationComponent],
  providers: [MessageService]
})
export class RegistrationModule { }
