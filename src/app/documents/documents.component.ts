import { Component, OnInit } from '@angular/core';
import {DocumentService, Document, DocumentQueryRequest} from "../services/document.service";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {MsrdmeiliService} from "../services/msrdmeili.service";
import {DocumentComponent} from "./document/document.component";
import {DialogService} from "primeng/dynamicdialog";
import {ActivatedRoute, Router} from "@angular/router";

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [MessageService]
})
export class DocumentsComponent implements OnInit {

  documents: Document[] = [];

  statuses: any[] = [];

  totalRecords: number = 0;
  lastEvent: LazyLoadEvent = {};

  own: boolean = false;

  expandedRows: expandedRows = {};
  isExpanded: boolean = false;

  constructor(
    private documentServic: DocumentService,
    private msrdMeiliService: MsrdmeiliService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.statuses = [
      {label: 'PROCESSING', value: 'processing'},
      {label: 'ACCEPTED', value: 'accepted'},
      {label: 'INSUFFICIENT STOCK', value: 'insufficient_stock' },
      {label: 'UNKNOWN ITEMS', value: 'unknown_items' },
      {label: 'DUPLICATE ITEMS', value: 'duplicate_items' },
      {label: 'REJECTED', value: 'rejected' }
    ];

    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.openDocumentDialog(documentId);
    }
  }

  public forceUpdateTable(){
    this.loadDocuments(this.lastEvent);
  }

  loadDocuments(event: LazyLoadEvent) {
    this.lastEvent = event;
    const query: DocumentQueryRequest = {
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    };
    if (event.globalFilter) {
      this.msrdMeiliService.searchDocument(!this.own, event.globalFilter, query).subscribe(response => {
        this.documents = response.result;
        this.totalRecords = response.totalRecordsCount;
        event.forceUpdate?.();
      });
    }
    else
    {
      this.documentServic.queryDocuments(!this.own,query).subscribe(response => {
        this.documents = response.result;
        this.totalRecords = response.totalRecordsCount;
        event.forceUpdate?.();
      });
    }
  }

  expandAll() {
    if (!this.isExpanded) {
      this.documents.forEach(document => document && document.id ? this.expandedRows[document.id] = true : '');

    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

  newDocumentDialog() {
    this.dialogService.open(DocumentComponent, {
      header: `New document`,
      width: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000
    }).onClose.subscribe(response => {
      if(response)
      {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Document successfully created.', life: 3000});
        this.forceUpdateTable();
      }
    });
  }

  openDocumentDialog(docId: string) {
    this.dialogService.open(DocumentComponent, {
      header: `Document: ${docId}`,
      width: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: docId
    }).onClose.subscribe(cfg => {
      this.router.navigate(['..'], { relativeTo: this.route});
    });
  }

}
