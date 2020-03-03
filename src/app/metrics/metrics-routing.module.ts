import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportselectionComponent } from './reportselection/reportselection.component';


const routes: Routes = [
  {
    path: '',
    component: ReportselectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetricsRoutingModule { }
