import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuactiveDirective } from './directives/menuactivedirective/menuactive.directive';
import { OpendropdownDirective } from './directives/opendropdowndirective/opendropdown.directive';
import { BarchartComponent } from './components/barchart/barchart.component';
import { ChartsModule } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BackComponent } from './components/back/back.component';
import { PersonaldetailsformComponent } from './components/personaldetailsform/personaldetailsform.component';
import { AmcdetailsformComponent } from './components/amcdetailsform/amcdetailsform.component';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UseritemComponent } from './components/useritem/useritem.component';
import { PageheaderComponent } from './components/pageheader/pageheader.component';
import { FilterComponent } from './components/filter/filter.component';
import { MultilinechartComponent } from './components/multilinechart/multilinechart.component';
import { StackedchartComponent } from './components/stackedchart/stackedchart.component';
import { ChartButtonsComponent } from './components/chart-buttons/chart-buttons.component';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [MenuactiveDirective, OpendropdownDirective, PageheaderComponent,
     BarchartComponent, BackComponent, PersonaldetailsformComponent, AmcdetailsformComponent,
    UseritemComponent, PageheaderComponent, FilterComponent, MultilinechartComponent,
  StackedchartComponent, ChartButtonsComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  exports: [ MenuactiveDirective, OpendropdownDirective, PageheaderComponent,
     BarchartComponent, BackComponent, PersonaldetailsformComponent, AmcdetailsformComponent,
    UseritemComponent, FilterComponent, MultilinechartComponent, StackedchartComponent,
  FilterComponent, ChartButtonsComponent]
})
export class SharedmoduleModule { }
