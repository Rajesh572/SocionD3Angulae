import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsRoutingModule } from './metrics-routing.module';
import { SharedmoduleModule } from '../sharedmodule/sharedmodule.module';
import { ReportselectionComponent } from './reportselection/reportselection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatFormFieldModule, MatTabsModule,
  MatDatepickerModule, MatNativeDateModule, MatInputModule,
  MatButtonModule, MatRadioModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ReportselectionComponent],
  imports: [
    FormsModule, ReactiveFormsModule,
    CommonModule, MatSelectModule,
    SharedmoduleModule,
    FontAwesomeModule,
    AngularMultiSelectModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatRadioModule,
    MetricsRoutingModule
  ]
})
export class MetricsModule { }
