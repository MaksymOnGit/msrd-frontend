import { Component, OnInit } from '@angular/core';
import {StockRecord, StockService} from "../../services/stock.service";
import {LazyLoadEvent} from "primeng/api";
import {DynamicDialogConfig} from "primeng/dynamicdialog";

@Component({
  selector: 'app-product-stocks-history',
  templateUrl: './product-stocks-history.component.html',
  styleUrls: ['./product-stocks-history.component.css']
})
export class ProductStocksHistoryComponent implements OnInit {

  lastEvent: LazyLoadEvent = {};
  stockRecords: StockRecord[] = [];
  totalRecords: number = 0;

  constructor(private stockService: StockService, private config: DynamicDialogConfig) { }

  ngOnInit(): void {
  }
  private forceUpdateTable(){
    this.loadStockRecords(this.lastEvent);
  }

  loadStockRecords(event: LazyLoadEvent) {
    this.lastEvent = event;
    this.stockService.queryProductStockHistory(this.config.data,{
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sort_field: event.sortField,
      sort_order: event.sortOrder
    }).subscribe(response => {
      this.stockRecords = response.result;
      this.totalRecords = response.total_records_count;
      event.forceUpdate?.();
    });
  }
}
