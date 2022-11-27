import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AppConfigService} from "../core/services/app-config.service";

@Injectable()
export class ProductService {

  private urlBase?: string;

  constructor(private httpClient: HttpClient, private config: AppConfigService) {
    this.urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      this.urlBase = this.urlBase + '/products';
  }

  getProduct(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.urlBase}/${id}`)
  }

  queryProducts(query: ProductQueryRequest): Observable<ProductQueryResponse> {
    return this.httpClient.post<ProductQueryResponse>(`${this.urlBase}/query`, query)
  }

  deleteProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlBase}/${id}`)
  }

  batchDeleteProduct(ids: string[]): Observable<void> {
    return this.httpClient.post<void>(`${this.urlBase}/batchDelete`, ids)
  }

  createProduct(newProduct: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${this.urlBase}/`, newProduct)
  }

  updateProduct(newProduct: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.urlBase}/`, newProduct)
  }
}

export interface ProductQueryRequest {
  rows: number
  offset: number
  sortField?: string
  sortOrder?: number
}

export interface ProductQueryResponse {
  result: Product[]
  //page: number
  //totalPagesCount: number
  totalRecordsCount: number
  //recordsPerPageCount: number
  //isNext: boolean
  //isPrev: boolean
}

export interface Product {
  id?: string;
  code?: string;
  name: string;
  quantity?: number;
  created_at?: Date;
  updated_at?: Date;
  description?: string;
}

