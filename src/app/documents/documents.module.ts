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
import {DialogService} from "primeng/dynamicdialog";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InputNumberModule} from "primeng/inputnumber";
import { CommonModule as MsrdCommon } from '../common/common.module';
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";


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
    FormsModule,
    MultiSelectModule,
    OverlayPanelModule,
    InputNumberModule,
    MsrdCommon,
    DropdownModule,
    ToastModule
  ],
  providers: [DialogService]
})
export class DocumentsModule { }
