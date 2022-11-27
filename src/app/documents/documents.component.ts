import { Component, OnInit } from '@angular/core';
import {DocumentService, Document, DocumentQueryRequest} from "../services/document.service";
import {LazyLoadEvent} from "primeng/api";
import {MsrdmeiliService} from "../services/msrdmeili.service";

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

  own: boolean = false;

  expandedRows: expandedRows = {};
  isExpanded: boolean = false;

  constructor(private documentServic: DocumentService, private msrdMeiliService: MsrdmeiliService) { }

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

}
