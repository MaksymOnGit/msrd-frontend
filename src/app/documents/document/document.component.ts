import {Component, OnInit, ViewChild} from '@angular/core';
import {DocumentItem, DocumentService} from "../../services/document.service";
import {LazyLoadEvent, MessageService} from "primeng/api";
import {Product, ProductQueryRequest} from "../../services/product.service";
import {MsrdmeiliService} from "../../services/msrdmeili.service";
import {OverlayPanel} from "primeng/overlaypanel"
import {Table} from "primeng/table";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
  styles: [`
        :host ::ng-deep .p-cell-editing {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
    `],
  providers: [MessageService]
})
export class DocumentComponent implements OnInit {

  // @ts-ignore
  @ViewChild('op', { static: false }) overlay: OverlayPanel;
  // @ts-ignore
  @ViewChild('it', { static: false }) itemTable: Table;

  documentItems: DocumentItem[] = [];
  products: Product[] = [];
  selectedProduct?: Product;

  clonedProducts: { [s: string]: DocumentItem; } = {};
  lastEvent: LazyLoadEvent = {};
  totalRecords: number = 0;
  totalPrice: number = 0;
  addingProduct: boolean = false;
  partnerName: string = "";
  documentTypes = [
    { name: 'Sale', value: -1 },
    { name: 'Receipt', value: 1 }
  ];
  documentType: number = -1;
  inventoryControlOptions = [
    { name: 'With Inventory Control', value: true },
    { name: 'Without Inventory Control', value: false }
  ];
  inventoryControlOption: boolean = true;
  readonly: boolean = false;

  constructor(
    private documentService: DocumentService,
    private msrdMeiliService: MsrdmeiliService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) {
    this.calculateTotal();
  }

  ngOnInit(): void {
    if (this.config.data){
      this.readonly = true;
      this.documentService.getDocument(this.config.data).subscribe({
        next: (doc => {
          this.partnerName = doc.partnerName ?? '';
          this.documentItems = doc.items ?? [];
          this.documentType = doc.direction ?? -1;
          this.inventoryControlOption = doc.validateStockAvailability ?? true;
          this.calculateTotal();
        }),
        error: (_ => {
          this.messageService.add({
            severity: 'error',
            summary: 'Unsuccessful',
            detail: 'Document creation unsuccessful.',
            life: 3000
          });
          this.ref.close();
        })
      });
    }
  }

  loadProducts(event: LazyLoadEvent) {
    this.lastEvent = event;
    const query: ProductQueryRequest = {
      offset: event.first ?? 0,
      rows: event.rows ?? 10,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    };
    this.msrdMeiliService.searchProduct(event.globalFilter, query).subscribe(response => {
      this.products = response.result;
      this.totalRecords = response.totalRecordsCount;
      event.forceUpdate?.();
    });
  }

  onRowEditInit(product: DocumentItem) {
    this.clonedProducts[product.productId] = {...product};
  }

  validateItem(item: DocumentItem): boolean {
    if (item.price === undefined) return false;
    if (item.price < 0) return false;
    if (item.quantity === undefined) return false;
    if (item.quantity < 0) return false;

    return true;
  }

  onRowEditSave(product: DocumentItem) {
    this.addingProduct = false;
    if (product.price && product.price > 0) {
      delete this.clonedProducts[product.productId];
    }
    else {
    }
    this.calculateTotal();
  }

  onRowEditCancel(product: DocumentItem, index: number) {
    if(this.addingProduct){
      this.documentItems.splice(index, 1)
      this.addingProduct = false;
    }
    else
    {
      this.documentItems[index] = this.clonedProducts[product.productId];
      delete this.clonedProducts[product.productId];
    }
  }

  onProductSelect(product: Product) {
    if(this.documentItems.some(p => p.productId == product.id))
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Already exists',
        detail: 'This product already added to the document.',
        life: 3000
      })
      return;
    }
    this.addingProduct = true;
    const item: DocumentItem = {
      productId: product.id!,
      productName: product.name,
      quantity: undefined,
      price: undefined
    };

    this.documentItems.push(item);
    this.onRowEditInit(item)
    this.overlay.hide();
    this.itemTable.initRowEdit(item);
  }

  calculateTotal() {
    this.totalPrice = this.documentItems.reduce((a, b) => a + ((b.quantity?? 0) * (b.price ?? 0)), 0)
  }

  deleteItem(index: number) {
    this.documentItems.splice(index, 1);
    this.calculateTotal();
  }

  saveDocument() {
    if(!this.partnerName || this.partnerName == "")
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Partner Name field is mandatory.',
        life: 3000
      });
      return;
    }

    if(this.documentItems.length == 0)
    {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Document should contain at least one item.',
        life: 3000
      });
      return;
    }

    this.documentService.createDocument(
      {
        partnerName: this.partnerName,
        direction: this.documentType,
        validateStockAvailability: this.inventoryControlOption,
        items: this.documentItems
      }).subscribe({
      next: (_ => {
        this.ref.close(true);
      }),
      error: (_ => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unsuccessful',
          detail: 'Document creation unsuccessful.',
          life: 3000
        });
      })
    });
  }
}
