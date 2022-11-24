import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";


@NgModule({
  declarations: [
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    ButtonModule,
    TableModule
  ]
})
export class DocumentsModule { }
