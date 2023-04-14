import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/dips/pages/page-not-found/page-not-found.component';
import { HeaderComponent } from './shared/header/header.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dips/list',
    pathMatch: 'full'
  },
  {
    path: 'dips',
    loadChildren: () => import('./modules/dips/dips.module').then(m => m.DipsModule)
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
