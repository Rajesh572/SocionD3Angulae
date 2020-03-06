import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';

@NgModule({
  declarations: [DashboardComponent, OverviewComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedmoduleModule
  ]
})
export class DashboardModule { }
