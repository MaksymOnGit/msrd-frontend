import {Routes} from "@angular/router";
import { AppLayoutComponent } from "../../layout/app.layout.component";
import {AuthGuard} from "../guards/auth.guard";
import {NotfoundComponent} from "../../notfound/notfound.component";
import {RoleGuard} from "../guards/role.guard";

export const routes: Routes = [
  { path: '', component: AppLayoutComponent,
    children: [
      { path: 'products', loadChildren: () => import('../../products/products.module').then(m => m.ProductsModule)},
      { path: 'users', loadChildren: () => import('../../users/users.module').then(m => m.UsersModule), canActivate: [RoleGuard]},
      { path: 'documents', loadChildren: () => import('../../documents/documents.module').then(m => m.DocumentsModule)}
    ],
    canActivate: [AuthGuard]
  },
  { path: 'auth', loadChildren: () => import('../../auth/auth.module').then(m => m.AuthModule) },
  { path: 'auth/access', loadChildren: () => import('../../auth/access/access.module').then(m => m.AccessModule) },
  { path: 'pages/notfound', component: NotfoundComponent },
  { path: '**', redirectTo: 'pages/notfound' },
];
