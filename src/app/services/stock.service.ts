import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AppConfigService} from "../core/services/app-config.service";

@Injectable()
export class StockService {

  private urlBase?: string;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {
    this.urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      this.urlBase = this.urlBase + '/stocks';
  }

  queryProductStockHistory(productId: string, query: StockRecordQueryRequest): Observable<StockRecordQueryResponse> {
    const params = new HttpParams()
      .set('product_id', productId);
    return this.httpClient.post<StockRecordQueryResponse>(`${this.urlBase}/query`, query, {params: params})
  }
}

export interface StockRecordQueryRequest {
  rows: number
  offset: number
  sort_field?: string
  sort_order?: number
}

export interface StockRecordQueryResponse {
  result: StockRecord[]
  page: number
  total_pages_count: number
  total_records_count: number
  records_per_page_count: number
  is_next: boolean
  is_prev: boolean
}

export interface StockRecord {
  stock_record_id: string,
  product_id: string,
  change_source_id: string,
  quantity_change: number,
  quantity_change_direction: number,
  quantity_before: number,
  quantity_actual: number,
  change_datetime: Date
}

