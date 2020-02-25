import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { CommingexpiryComponent } from './commingexpiry/commingexpiry.component';
import { ActiveuserComponent } from './activeuser/activeuser.component';
import { OverviewComponent } from './overview/overview.component';
import { ReportsComponent } from './reports/reports.component';
import { AttestationreportsComponent } from './attestationreports/attestationreports.component';
import { ReportselectionComponent } from './reportselection/reportselection.component';
import { BarchartComponent } from './barchart/barchart.component';
import { StackedchartComponent } from './stackedchart/stackedchart.component';
import { MultilinechartComponent } from './multilinechart/multilinechart.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [DashboardComponent, CommingexpiryComponent, ActiveuserComponent, OverviewComponent,
    ReportsComponent, AttestationreportsComponent, ReportselectionComponent, BarchartComponent,
    StackedchartComponent, MultilinechartComponent],
  imports: [FormsModule, ReactiveFormsModule,
    CommonModule, MatSelectModule,
    DashboardRoutingModule,
    SharedmoduleModule,
    FontAwesomeModule,
    AngularMultiSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ]
})
export class DashboardModule { }
