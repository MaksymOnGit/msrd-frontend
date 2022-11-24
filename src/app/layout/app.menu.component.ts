import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import {AuthService} from "../core/services/auth.service";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private authService: AuthService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                      label: 'Users',
                      icon: 'pi pi-fw pi-users',
                      routerLink: ['/users'],
                      visible: this.authService.roles.includes("Admin")
                    },
                    {
                        label: 'Products',
                        icon: 'pi pi-fw pi-table',
                        routerLink: ['/products']
                    },
                  {
                    label: 'Documents',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/documents']
                  }
                ]
            }
        ];
    }
}
