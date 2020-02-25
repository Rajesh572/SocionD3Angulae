import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ReportselectionComponent } from './dashboard/reportselection/reportselection.component';
import { FavouriteComponent } from './dashboard/favourite/favourite.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }, {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'reports/select',
    component: ReportselectionComponent
  },
  {
    path: 'reports/favourite',
    component: FavouriteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
