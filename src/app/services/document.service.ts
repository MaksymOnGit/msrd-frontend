import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "../core/services/app-config.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private urlBase?: string;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {
    this.urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      this.urlBase = this.urlBase + '/documents';
  }

  getDocument(id: string): Observable<Document> {
    return this.httpClient.get<Document>(`${this.urlBase}/${id}`)
  }

  queryDocuments(all: boolean, query: DocumentQueryRequest): Observable<DocumentQueryResponse> {
    return this.httpClient.post<DocumentQueryResponse>(`${this.urlBase}/query?all=${all}`, query)
  }

  createProduct(newDocument: Document): Observable<Document> {
    return this.httpClient.put<Document>(`${this.urlBase}/`, newDocument)
  }
}

export interface DocumentQueryRequest {
  rows: number
  offset: number
  sortField?: string
  sortOrder?: number
}

export interface DocumentQueryResponse {
  result: Document[]
  //page: number
  //totalPagesCount: number
  totalRecordsCount: number
  //recordsPerPageCount: number
  //isNext: boolean
  //isPrev: boolean
}

export interface Document {
  id?: string;
  price?: number;
  owner?: string;
  status?: string;
  date?: Date;
  items?: DocumentItem[];
  direction?: number;
  validateStockAvailability?: boolean;
  partnerName?: string;
}

export interface DocumentItem {
  productId: string;
  productName: string;
  quantitativeUnit?: string;
  price: number;
  quantity: number;
}
