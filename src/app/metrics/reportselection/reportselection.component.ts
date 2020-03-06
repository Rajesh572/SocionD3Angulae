// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FilterDataService } from 'src/app/sharedmodule/services/filter-data/filter-data.service';
import { ReportDataService } from '../services/report-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportselectionComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  unselected = [];
  barData: any;
  stackedData: any;
  showCharts = false;
  yAxisLabel: any;
  faCheck = faCheck;
  verticalArr = ['Sessions Completed',
    'Participant Attestations',
    'Unique Participants',
    'Unique Trainers',
    'Content Views'];

  horizontalArr = ['Time Period', 'Location'];

  selectedHorizontalValue: string;
  selectedVerticalValue: string;
  multiLineData: any;
  topics: any[] = [ '3qwq',
  'Check Again',
  'Check for Multiple Topic',
  'Generattor',
  'Offline Test',
  'Topic',
  'Why Springs',
  'fgfdf',
  'gfgh',
  'hhh',
  'lkkjsflksjfsfsdlkj',
  'new topic',
  'topic',
  'topic 3',
  'topic2',
  'video check',
  'videos',
  'ಏಕೆ ಸ್ಪ್ರಿಂಗ್ಸ್ ಮತ್ತು ಬೇಸಿಕ್ ಹೈಡ್ರೋಜಾಲಜಿ' ];
  modelSelected: any;
  dataArray: any[];
  newDataArray: any[] = [];
  changeStackChart: boolean;
  chartData = [];

  requestBody = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private filterService: FilterDataService,
    private reportService: ReportDataService) {
    let extras = this.router.getCurrentNavigation().extras;
    if (!!extras.state) {
      let selectedmetric = extras['state']['id'];
      this.selectedVerticalValue = selectedmetric;
      this.selectedHorizontalValue = 'Time Period';
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
    console.log('HV', this.selectedVerticalValue);
    if (!this.selectedVerticalValue) {
      this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
  }
    // this.selectedVerticalValue = this.reportService.getSelectedVerticalAttr();
    // this.selectedHorizontalValue = this.reportService.getSelectedHorizontalAttr();
    try {
      this.filterService.$filterObjectChange.subscribe((filter) => {
        console.log('filter: ', filter);
        const filterKeys = Object.keys(filter);
        if (!!filterKeys && filterKeys.length > 0) {
          this.reportService.applyFiltersToRequestBody(filter);
        } else {
          this.reportService.initializeRequestBody();
        }
        this.requestBody = this.reportService.getRequestBody();
        console.log('Request Body: ', this.requestBody);
        this.collectReportData();
      });
    } catch (e) {
      console.log('Error in Report Selection Component while fetching Chart Data : ', e);
    }
  }

  collectReportData() {
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
      this.dataService.setChartData(this.chartData);
      this.barData = (chartData[0].result);
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
    this.dropdownList = [];
    this.showCharts = false;
    this.selectedHorizontalValue = key;
  }

  onVerticalAxisSelect(key) {
    this.selectedItems = [];
    this.dropdownList = [];
    this.showCharts = false;
    this.selectedVerticalValue = key;
  }

  getSelectedHorizontalAxis() {
    return this.selectedHorizontalValue;
  }

  getSelectedVerticalAxis() {
    return this.selectedVerticalValue;
  }

  showReports() {

    if (this.selectedItems.length > 0) {
      this.dataService.seletedTopics.next(this.selectedItems);
    }

    this.dataService.setAllSelectedAxis({ dimension: this.selectedHorizontalValue, metric: this.selectedVerticalValue },
       this.selectedItems);

       // change
    if (this.selectedVerticalValue === 'Sessions Completed') {
      this.yAxisLabel = this.selectedVerticalValue;
    } else if (this.selectedVerticalValue === 'Participant Attestations') {
      this.yAxisLabel = this.selectedVerticalValue;
    } else if (this.selectedVerticalValue === 'Content Views') {
      this.yAxisLabel = this.selectedVerticalValue;
    } else if (this.selectedVerticalValue === 'Unique Participants') {
      this.yAxisLabel = this.selectedVerticalValue;
    } else if (this.selectedVerticalValue === 'Unique Trainers') {
      this.yAxisLabel = this.selectedVerticalValue;
    }
    this.getDataforCharts();
  }

  getDataforCharts() {
    this.dataService.$barChartData.subscribe((bardata) => {
      this.barData = bardata;
    });
    this.dataService.$stackedChartData.subscribe((stackdata) => {
      this.stackedData = stackdata;
    });
    this.dataService.$multiLineChartData.subscribe((multilinedata) => {
      this.multiLineData = multilinedata;
    });
    // this.dataService.getAllTopics();
    this.dataService.$allTopics.subscribe((topics: any[]) => {
      this.topics = topics;
      this.dropdownList = [];

      setTimeout(() => {
        this.dropdownList = this.topics;
        this.newDataArray = this.topics;
      }, 500);
    });
    setTimeout(() => {
      this.showCharts = true;
      this.changeStackChart = true;
    });
  }

}
