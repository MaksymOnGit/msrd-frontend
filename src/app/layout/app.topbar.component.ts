import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from "../core/services/auth.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    menuItems: MenuItem[] = [
      {
        label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: event => this.authService.logout()
      }
    ];

    constructor(public layoutService: LayoutService, private authService: AuthService) { }
}
