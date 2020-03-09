import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarchartComponent } from './components/barchart/barchart.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackComponent } from './components/back/back.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageheaderComponent } from './components/pageheader/pageheader.component';
import { FilterComponent } from './components/filter/filter.component';
import { MultilinechartComponent } from './components/multilinechart/multilinechart.component';
import { StackedchartComponent } from './components/stackedchart/stackedchart.component';
import { ChartButtonsComponent } from './components/chart-buttons/chart-buttons.component';
import {MatRadioModule} from '@angular/material/radio';
import { MenuactiveDirective } from './directives/menuactivedirective/menuactive.directive';
import { OpendropdownDirective } from './directives/opendropdowndirective/opendropdown.directive';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [PageheaderComponent,
     BarchartComponent, BackComponent,
     PageheaderComponent, FilterComponent, MultilinechartComponent,
  StackedchartComponent, ChartButtonsComponent, MenuactiveDirective, OpendropdownDirective, ModalComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  exports: [PageheaderComponent,
     BarchartComponent, BackComponent,
     FilterComponent, MultilinechartComponent, StackedchartComponent,
  FilterComponent, ChartButtonsComponent, MenuactiveDirective, OpendropdownDirective, ModalComponent]
})
export class SharedmoduleModule { }
