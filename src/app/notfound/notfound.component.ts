import { Component } from '@angular/core';
import {LayoutService} from "../layout/service/app.layout.service";

@Component({
    selector: 'app-notfound',
    templateUrl: './notfound.component.html',
    styles: [`
          :host ::ng-deep .pi-eye,
          :host ::ng-deep .pi-eye-slash {
              transform:scale(1.6);
              margin-right: 1rem;
              color: var(--primary-color) !important;
          }
      `]
})
export class NotfoundComponent {
  constructor(public layoutService: LayoutService) {
  }
}
