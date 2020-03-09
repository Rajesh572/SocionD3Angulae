// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { faCheck, faEye, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FilterDataService } from 'src/app/sharedmodule/services/filter-data/filter-data.service';
import { ReportDataService } from '../services/report-data.service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/sharedmodule/components/modal/modal.component';

@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportselectionComponent implements OnInit {
  selectedItems = [];
  unselected = [];
  barData: any;
  stackedData: any;
  showCharts = false;
  faCheck = faCheck;
  faPlusCircle = faPlusCircle;
  faEye = faEye;
  verticalArr = ['Sessions Completed',
    'Participant Attestations',
    'Unique Participants',
    'Unique Trainers',
    'Content Views'];

  horizontalArr = ['Time Period', 'Location'];

  selectedHorizontalValue: string;
  selectedVerticalValue: string;
  selectedVerticaltext: string;
  multiLineData: any;
  modelSelected: any;
  dataArray: any[];
  changeStackChart: boolean;
  chartData = [];
  // fromxmodal: any;
  // fromymodal: any;
  requestBody = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private filterService: FilterDataService,
    private reportService: ReportDataService,
    private dialog: MatDialog) {
    let extras = this.router.getCurrentNavigation().extras;
    console.log('Extras : ', extras);
    if (!!extras.state) {
      let selectedmetric = extras['state']['id'];
      this.selectedVerticaltext = selectedmetric;
      this.selectedHorizontalValue = 'Time Period';
      this.reportService.setSelectedHorizontalAttr(this.selectedHorizontalValue);
      this.reportService.setSelectedVerticalAttrOnValue(selectedmetric);
      this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
      // setTimeout(() => {
      //   this.showReports();
      // });
    }
  }

  ngOnInit() {
    console.log('HV', this.selectedHorizontalValue);
    if (!this.selectedHorizontalValue) {
      this.selectedHorizontalValue = this.reportService.getSelectedHorizontalAttr();
    }
    console.log('VV', this.selectedVerticalValue);
    if (!this.selectedVerticalValue) {
      this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
      this.selectedVerticaltext = this.reportService.getSelectedVerticalAttrText();
    }
    // this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
    // this.selectedHorizontalValue = this.reportService.getSelectedHorizontalAttr();
    try {
      this.filterService.$filterObjectChange.subscribe((filter) => {
        console.log('filter: ', filter);
        this.reportService.setFilter(filter);
        const filterKeys = Object.keys(filter);
        if (!!filterKeys && filterKeys.length > 0) {
          this.reportService.initializeRequestBody();
          this.reportService.applyFiltersToRequestBody(filter);
        } else {
          this.reportService.initializeRequestBody();
        }
        this.collectReportData();
      });
    } catch (e) {
      console.log('Error in Report Selection Component while fetching Chart Data : ', e);
    }
  }

  collectReportData() {
    this.reportService.initializeRequestBody();
    this.requestBody = this.reportService.getRequestBody();
    console.log('Request Body: ', this.requestBody);
    const chartRequests = [];
    // console.log('Request Bodies : ', this.dashboardData);
    this.requestBody.forEach((requestEach) => {
      console.log('requestEach: ', requestEach);
      chartRequests.push(this.reportService.getChartData(requestEach));
    });

    forkJoin(chartRequests).subscribe((chartData) => {
      console.log('chartData : ', chartData);
      if (this.chartData.length > 0) {
        this.chartData = [];
      }
      console.log('chartData : ', chartData);

      chartData.forEach((chartDataEach) => {
        chartDataEach.result.forEach((data) => {
          this.chartData.push(data);
        });
      });
      console.log('Data : ', this.chartData);
      // this.dataService.setChartData(this.chartData);
      this.barData = (chartData[0].result);

    // this.BarchartComponent.dataChangeDetectCycle
      this.stackedData = (chartData[1].result);
      this.multiLineData = (chartData[1].result);
      this.showCharts = true;
    });
  }


  // onKey(value) {
  //   this.dataArray = [];
  //   this.selectSearch(value);
  // }

  onHorizontalAxisSelect(key) {
    this.selectedItems = [];
    this.showCharts = false;
    this.selectedHorizontalValue = key;
  }

  onVerticalAxisSelect(key) {
    this.selectedItems = [];
    this.showCharts = false;
    this.selectedVerticalValue = key;
  }

  getSelectedHorizontalAxis() {
    return this.reportService.getSelectedHorizontalAttr();
  }

  getSelectedVerticalAxis() {
    return this.reportService.getSelectedVerticalAttr();
  }

  showReports() {

    // if (this.selectedItems.length > 0) {
    //   this.dataService.seletedTopics.next(this.selectedItems);
    // }
    this.reportService.setSelectedHorizontalAttr(this.selectedHorizontalValue);
    this.reportService.setSelectedVerticalAttr(this.selectedVerticalValue);

    // this.dataService.setAllSelectedAxis({ dimension: this.selectedHorizontalValue, metric: this.selectedVerticalValue },
    //   this.selectedItems);
    // change
    // this.getDataforCharts();
    this.collectReportData();
  }

  // getDataforCharts() {
  //   this.dataService.$barChartData.subscribe((bardata) => {
  //     this.barData = bardata;
  //   });
  //   this.dataService.$stackedChartData.subscribe((stackdata) => {
  //     this.stackedData = stackdata;
  //   });
  //   this.dataService.$multiLineChartData.subscribe((multilinedata) => {
  //     this.multiLineData = multilinedata;
  //   });
  //   // this.dataService.getAllTopics();
  //   this.dataService.$allTopics.subscribe((topics: any[]) => {
  //     this.topics = topics;
  //   });
  //   setTimeout(() => {
  //     this.showCharts = true;
  //     this.changeStackChart = true;
  //   });
  // }



  openDialogForXAxis() {
    const dialogRef = this.dialog.open(ModalComponent, {
      height: '50%', width: '100%',
      data: {options: this.horizontalArr, selected: this.selectedHorizontalValue},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.selectedHorizontalValue = result;
      }
      // console.log('fromxmodal', this.selectedHorizontalValue);
    });
  }

  openDialogForYAxis() {
    const dialogRef = this.dialog.open(ModalComponent, {
      height: '50%', width: '100%',
      data: {options: this.verticalArr, selected: this.selectedVerticaltext},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.selectedVerticaltext = result;
        this.reportService.setSelectedVerticalAttrOnValue(result);
        this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
      }
      // console.log(this.selectedVerticalValue);
    });
  }

}
