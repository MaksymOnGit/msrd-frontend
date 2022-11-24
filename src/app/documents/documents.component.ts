import { Component, OnInit } from '@angular/core';
import {DocumentService, Document} from "../services/document.service";
import {LazyLoadEvent} from "primeng/api";

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  documents: Document[] = [];

  statuses: any[] = [];

  totalRecords: number = 0;
  lastEvent: LazyLoadEvent = {};

  all: boolean = true;

  expandedRows: expandedRows = {};
  isExpanded: boolean = false;

  constructor(private documentServic: DocumentService) { }

  ngOnInit(): void {
    this.statuses = [
      {label: 'PROCESSING', value: 'processing'},
      {label: 'ACCEPTED', value: 'accepted'},
      {label: 'INSUFFICIENT STOCK', value: 'insufficient_stock' },
      {label: 'UNKNOWN ITEMS', value: 'unknown_items' },
      {label: 'DUPLICATE ITEMS', value: 'duplicate_items' },
      {label: 'REJECTED', value: 'rejected' }
    ];
  }

  private forceUpdateTable(){
    this.loadDocuments(this.lastEvent);
  }

  loadDocuments(event: LazyLoadEvent) {
    this.lastEvent = event;
    this.documentServic.queryDocuments(this.all,{
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    }).subscribe(response => {
      this.documents = response.result;
      this.totalRecords = response.totalRecordsCount;
      event.forceUpdate?.();
    });
  }

  expandAll() {
    if (!this.isExpanded) {
      this.documents.forEach(document => document && document.id ? this.expandedRows[document.id] = true : '');

    } else {
      this.expandedRows = {};
    }
    this.isExpanded = !this.isExpanded;
  }

}
