// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { faCheck, faEye, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FilterDataService } from 'src/app/sharedmodule/services/filter-data/filter-data.service';
import { ReportDataService } from '../services/report-data.service';
import { forkJoin, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/sharedmodule/components/modal/modal.component';
import { ChartButtonService } from 'src/app/sharedmodule/services/chart-button/chart-button.service';

@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportselectionComponent implements OnInit, OnDestroy {
  selectedItems = [];
  unselected = [];
  barData: any;
  stackedData: any;
  showCharts = false;
  viewByEvent: any = {key: 'Time Period', value: 'month'};
  faCheck = faCheck;
  faPlusCircle = faPlusCircle;
  faEye = faEye;
  verticalArr = ['Sessions Completed',
    'Participant Attestations',
    'Unique Participants',
    'Unique Trainers',
    'Content Views'];

  horizontalArr = ['Time Period', 'location'];

  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


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
  manageSubscriptions: Subscription[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private filterService: FilterDataService,
    private reportService: ReportDataService,
    private chartButtonService: ChartButtonService,
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
      const handleSubscription = this.filterService.$filterObjectChange.subscribe((filter) => {
        console.log('filter: ', filter);
        this.reportService.setFilter(filter);
        const filterKeys = Object.keys(filter);
        if (!!filterKeys && filterKeys.length > 0) {
          this.reportService.initializeRequestBody();
          // this.viewByEvent = this.reportService.getView
          // this.viewByEvent = this.reportService.getViewBy();
          // this.reportService.setViewBy(this.viewByEvent);
          this.reportService.applyFiltersToRequestBody(filter);
        } else {
          this.reportService.initializeRequestBody();
          // this.viewByEvent = this.reportService.getViewBy();
          // this.reportService.setViewBy(this.viewByEvent);
        }
        this.collectReportData();
      });
      this.manageSubscriptions.push(handleSubscription);

      const manageSubs = this.chartButtonService.$chartButtonChange.subscribe((event) => {
        console.log('Event is :::: ', event);
        if (Object.keys(event).length > 0) {
          this.viewByEvent = event;
          this.reportService.setViewBy(event);
        }
        this.collectReportData();
      });
      this.manageSubscriptions.push(manageSubs);
    } catch (e) {
      console.log('Error in Report Selection Component while fetching Chart Data : ', e);
    }
  }

  collectReportData() {
    this.reportService.initializeRequestBody();
    this.viewByEvent = this.reportService.getViewBy();
    this.reportService.setViewBy(this.viewByEvent);
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

      // const newChartData = [];
      // chartData.forEach((chartDataEach) => {
      //   chartDataEach.result.forEach((data) => {
      //     newChartData.push(data);
      //   });
      // });
      if (!!this.viewByEvent && Object.keys(this.viewByEvent).length > 0) {
        chartData.forEach((chartDataEach) => {
          chartDataEach.result.map((data) => {
            if (this.viewByEvent.key === 'Time Period') {
              const date = new Date(data.date);
              switch (this.viewByEvent.value) {
                case 'month': {
                  data.month = this.monthNames[date.getMonth()];
                  break;
                }
                case 'week': {
                  // data.week = 'Week ' + this.getWeekNumber(date);
                  let weekText = 'Week ' + this.getWeekOfMonth(date).toString();
                  weekText += ' ';
                  weekText += date.toLocaleString('default', { month: 'short' });
                  // data.week = this.getWeekOfMonth(date) + ' Week of ' + date.toLocaleString('default', { month: 'short' });
                  data.week = weekText;
                  break;
                }
                case 'day': {
                  data.day = date.getDate() + ' ' + date.toLocaleDateString('en-US',{'month': 'short'});
                  break;
                }
                default : {}
              }
            } else if (this.viewByEvent.key === 'location') {
              switch (this.viewByEvent.value) {
                case 'state': {
                  break;
                }
                case 'district': {
                  break;
                }
                case 'city': {
                  break;
                }
                default : {}
              }
            }
          });
        });
      }
      this.chartData = chartData;
      console.log('Data : ', this.chartData);
      // this.dataService.setChartData(this.chartData);
      this.barData = (chartData[0].result);

    // this.BarchartComponent.dataChangeDetectCycle
      let stackedData = chartData[1].result;
      // console.log('stackedData: ', stackedData);
      // console.log(Object.keys(stackedData[0]));
      if (stackedData.length > 0) {
        if ((Object.keys(stackedData[0]).indexOf('location')) >= 0) {
          // console.log('stackedData');
          stackedData.forEach((data) => {
            data['Location'] = data.location;
            delete data['location'];
          });
        }
      }
      // console.log(stackedData);
      this.stackedData = stackedData;
      this.multiLineData = (chartData[1].result);
      this.showCharts = true;
    });
  }


  getWeekNumber(thisDate: Date) {
    // const dt = new Date(thisDate);
    const thisDay = thisDate.getDate();

    const newDate = thisDate;
    newDate.setDate(1); // first day of month
    const digit = newDate.getDay();

    const Q = (thisDay + digit) / 7;

    const R = (thisDay + digit) % 7;

    if (R !== 0) {
      return Math.ceil(Q);
    } else {
      return Q;
    }
  }

   getWeekOfMonth(date: Date) {
    const adjustedDate = date.getDate()+date.getDay();
    const prefixes = ['0', '1', '2', '3', '4', '5'];
    return (parseInt(prefixes[0 | adjustedDate / 7])+1);
   }


  getWeekNoISO(dt) {
  const tdt: any = new Date(dt.valueOf());
  const dayn = (dt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  const firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
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

  // showReports() {

  //   // if (this.selectedItems.length > 0) {
  //   //   this.dataService.seletedTopics.next(this.selectedItems);
  //   // }
  //   this.reportService.setSelectedHorizontalAttr(this.selectedHorizontalValue);
  //   this.reportService.setSelectedVerticalAttr(this.selectedVerticalValue);

  //   // this.dataService.setAllSelectedAxis({ dimension: this.selectedHorizontalValue, metric: this.selectedVerticalValue },
  //   //   this.selectedItems);
  //   // change
  //   // this.getDataforCharts();
  //   this.collectReportData();
  // }

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
    const width = this.getModalWidth(this.horizontalArr.length);
    const height = this.getModalHeigth(this.horizontalArr.length);
    console.log('Width for X : ', width);
    const dialogRef = this.dialog.open(ModalComponent, {
      height, width,
      data: {options: this.horizontalArr, selected: this.selectedHorizontalValue, modalTitle: 'Select Horizontal Axis'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.selectedHorizontalValue = result;
        this.reportService.setSelectedHorizontalAttr(this.selectedHorizontalValue);
        console.log('Result ::::::: ', result);
        if (result === 'location') {
          this.viewByEvent = {key: 'location', value: 'district'};
        } else if (result === 'Time Period') {
          this.viewByEvent = {key: 'Time Period', value: 'month'};
        }
        this.reportService.setViewBy(this.viewByEvent);
        this.collectReportData();

      }
      // console.log('fromxmodal', this.s electedHorizontalValue);
    });
  }

  openDialogForYAxis() {
    const width = this.getModalWidth(this.verticalArr.length);
    const height = this.getModalHeigth(this.verticalArr.length);
    console.log('Width for Y : ', width);
    const dialogRef = this.dialog.open(ModalComponent, {
      height, width,
      data: {options: this.verticalArr, selected: this.selectedVerticaltext, modalTitle: 'Select Vertical Axis'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.selectedVerticaltext = result;
        this.reportService.setSelectedVerticalAttrOnValue(result);
        this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
        this.reportService.setSelectedVerticalAttr(this.selectedVerticalValue);
        this.collectReportData();
      }
      // console.log(this.selectedVerticalValue);
    });
  }

  ngOnDestroy() {
    if (this.manageSubscriptions.length > 0) {
      this.manageSubscriptions.forEach((subsEach) => {
        subsEach.unsubscribe();
      });
    }
  }

  getModalWidth(optionsLength) {
    let width = '100%';
    if (optionsLength < 4) {
      width = '30%';
    } else if (optionsLength < 10) {
      width = '45%';
    } else if (optionsLength < 15) {
      width = '70%';
    }
    return width;
  }

  getModalHeigth(optionsLength) {
    let height = '100%';
    if (optionsLength < 3) {
      height = '30%';
    } else if (optionsLength < 7) {
      height = '45%';
    } else if (optionsLength < 12) {
      height = '70%';
    }
    return height;
  }
}
