import { Injectable } from '@angular/core';
import {Index, MeiliSearch, SearchResponse} from 'meilisearch'
import {AppConfigService} from "../core/services/app-config.service";
import {filter, from, map, Observable, of} from 'rxjs';
import {AuthService} from "../core/services/auth.service";
import {Product, ProductQueryRequest, ProductQueryResponse} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class MsrdmeiliService {


  private productsIndex?: Index<any>;
  private documentsIndex?: Index<any>;

  constructor(private config: AppConfigService, private authService: AuthService) {

    let urlBase = config.appSettings.apiRoot;
    if(!config.appSettings.withoutProxy)
      urlBase = urlBase + '/meilisearch/';

    authService.isAuthenticated.pipe(
      filter(value => value)).forEach(_ => {
      const client = new MeiliSearch({
        host: urlBase ?? '(notset)',
        apiKey: authService.getAccessToken(),
      });

      this.productsIndex = client.index('products')
      this.documentsIndex = client.index('documents')
    });

  }

  searchProduct(text: string, params: ProductQueryRequest): Observable<ProductQueryResponse> {
    if(this.productsIndex)
      return from(this.productsIndex.search(text,
        {
        offset: params.offset,
        limit: params.rows,
        sort: params.sortField && params.sortOrder ? [`${params.sortField}:${params.sortOrder < 0 ? 'desc' : 'asc'}`] : []
      }
      )).pipe(map<SearchResponse<Product>, ProductQueryResponse>(x => {
        return {
          totalRecordsCount: x.estimatedTotalHits,
          result: x.hits
        };
      }));
    return of()
  }

}
