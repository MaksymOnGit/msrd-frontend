import { Component, OnInit } from '@angular/core';
import {DocumentItem, DocumentService} from "../../services/document.service";

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {

  documentItems: DocumentItem[] = [];

  clonedProducts: { [s: string]: DocumentItem; } = {};

  constructor(private documentService: DocumentService) { }

  onRowEditInit(product: DocumentItem) {
    this.clonedProducts[product.productId] = {...product};
  }

  onRowEditSave(product: DocumentItem) {
    if (product.price > 0) {
      delete this.clonedProducts[product.productId];
    }
    else {
    }
  }

  onRowEditCancel(product: DocumentItem, index: number) {
    this.documentItems[index] = this.clonedProducts[product.productId];
    delete this.clonedProducts[product.productId];
  }
}
