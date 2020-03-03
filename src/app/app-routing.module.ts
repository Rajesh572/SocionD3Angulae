import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
// import { ReportselectionComponent } from './metrics/reportselection/reportselection.component';
// import { FavouriteComponent } from './favourite/favourite/favourite.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'reports/select',
    loadChildren: './metrics/metrics.module#MetricsModule'
  },
  {
    path: 'reports/favourite',
    loadChildren: './favourite/favourite.module#FavouriteModule'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
