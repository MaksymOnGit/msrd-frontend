import {Component, OnInit} from '@angular/core';
import {LazyLoadEvent, MessageService} from 'primeng/api';
import {Product, ProductQueryRequest, ProductService} from "../services/product.service";
import {DialogService} from "primeng/dynamicdialog";
import {ProductStocksHistoryComponent} from "./product-stocks-history/product-stocks-history.component";
import {MsrdmeiliService} from "../services/msrdmeili.service";

@Component({
  selector: 'app-users',
  templateUrl: './products.component.html',
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {

  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  product: Partial<Product> = {};

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  statuses: any[] = [];

  totalRecords: number = 0;
  lastEvent: LazyLoadEvent = {};

  constructor(private productService: ProductService, private messageService: MessageService, private dialogService: DialogService, private msrdMeiliService: MsrdmeiliService) {
  }

  ngOnInit() {

    this.statuses = [{label: 'INSTOCK', value: 'instock'}, {label: 'LOWSTOCK', value: 'lowstock'}, {
      label: 'OUTOFSTOCK',
      value: 'outofstock'
    }];
  }

  private forceUpdateTable(){
    this.loadProducts(this.lastEvent);
  }

  loadProducts(event: LazyLoadEvent) {
    this.lastEvent = event;
    const query: ProductQueryRequest = {
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    };
    if (event.globalFilter) {
      this.msrdMeiliService.searchProduct(event.globalFilter, query).subscribe(response => {
        this.products = response.result;
        this.totalRecords = response.totalRecordsCount;
        event.forceUpdate?.();
      });
    }
    else
    {
      this.productService.queryProducts(query).subscribe(response => {
        this.products = response.result;
        this.totalRecords = response.totalRecordsCount;
        event.forceUpdate?.();
      });
    }
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.deleteProductsDialog = true;
  }

  editProduct(product: Product) {
    if (!product.id)
      return;

    this.productService.getProduct(product.id).subscribe(respProd => {
      this.productDialog = true;
      this.product = {...respProd};
    });

  }

  deleteProduct(product: Product) {
    this.deleteProductDialog = true;
    this.product = {...product};
  }

  confirmDeleteSelected() {
    this.deleteProductsDialog = false;

    let tempSelectedProducts = [...this.selectedProducts];
    this.selectedProducts = [];

    // @ts-ignore
    this.productService.batchDeleteProduct(tempSelectedProducts.map(a => a.id)).subscribe({
      next: (_ => {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.forceUpdateTable();
      }),
      error: (_ => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unsuccessful',
          detail: 'Products Not Deleted',
          life: 3000
        });
      })
    })
  }

  confirmDelete() {
    this.deleteProductDialog = false;

    if (!this.product)
      return;

    let tempProduct: Partial<Product> = {...this.product};

    this.product = {};

    // @ts-ignore
    this.productService.deleteProduct(tempProduct.id).subscribe({
      next: (_ => {
        this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
        this.forceUpdateTable();
      }),
      error: (_ => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unsuccessful',
          detail: 'Product Not Deleted',
          life: 3000
        });
      })
    })
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (!this.product)
      return;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.productService.updateProduct(this.product as Product).subscribe({
          next: (_ => {
            // @ts-ignore
            this.forceUpdateTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Updated',
              life: 3000
            });
            this.productDialog = false;
          }),
          error: (_ => {
            this.messageService.add({
              severity: 'error',
              summary: 'Unsuccessful',
              detail: 'Product Not Updated',
              life: 3000
            });
          })
        });
      } else {
        this.productService.createProduct(this.product as Product).subscribe({
          next: (_ => {
            this.forceUpdateTable();
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Product Created',
              life: 3000
            });
            this.productDialog = false;
          }),
          error: (_ => {
            this.messageService.add({
              severity: 'error',
              summary: 'Unsuccessful',
              detail: 'Product Not Created',
              life: 3000
            });
          })
        });
      }
      this.product = {};
    }
  }

  showStocksHistory(product: Product) {
    this.dialogService.open(ProductStocksHistoryComponent, {
      header: `${product.name}'s stock history`,
      width: '70%',
      contentStyle: {"overflow": "auto"},
      baseZIndex: 10000,
      data: product.id
    });
  }
}
