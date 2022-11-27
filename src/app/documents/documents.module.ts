import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import { DocumentComponent } from './document/document.component';
import {InputTextModule} from "primeng/inputtext";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    CheckboxModule,
    FormsModule
  ]
})
export class DocumentsModule { }
