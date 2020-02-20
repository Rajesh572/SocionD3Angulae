import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportselectionComponent } from './reportselection/reportselection.component';


const routes: Routes = [
  /* {
    path: "reports",
    children: [
      { path: "report1", component: ReportsComponent },
      { path: "select", component: ReportselectionComponent }
    ]
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
