// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit, OnChanges } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportselectionComponent implements OnInit, OnChanges {
  dropdownList = [];
  optionCustomDate = false;
  dateTo = '';
  dateFrom = '';
  serializedDate = new FormControl((new Date()).toISOString());
  selectedItems = [];
  unselected = [];
  barData: any;
  stackedData: any;
  showCharts = false;
  yAxisLabel: any;
  meta: any;
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
  topics: any[] = [];
  modelSelected: any;
  dataArray: any[];
  newDataArray: any[] = [];
  newLocationArray = ['Andhra Pradesh',
  'Arunachal pradesh',
  'Assam',
  'Sikkim',
  'Nagaland',
  'Manipur',
  'Meghalaya',
  'Jammu kashmir',
  'Karnataka',
  'Madhya Pradesh',
  'Manipur',
  'Punjab',
  'Rajasthan',
  'Uttar Pradesh',
  'Chhattisgarh'
];
newTimeArray = ['Last 6 months',
  'Last 3 months',
  'Last 1 month',
  'Last 2 weeks',
  'Last 1 week',
  'Custom Date'];
  changeStackChart: boolean;

  constructor(private dataService: DataService, private router: Router) {
    let extras = this.router.getCurrentNavigation().extras;
    if (!!extras.state) {
      let selectedmetric = extras['state']['id'];
      this.selectedVerticalValue = selectedmetric;
      this.selectedHorizontalValue = 'Time Period';
      setTimeout(() => {
        this.showReports();
      });
    }
  }

  ngOnInit() {
    this.dataService.getDummyTopics().subscribe((data) => {
      let alltopics = [];
      data['data'].forEach(element => {
        alltopics.push(element['topic_name']);
      });
      console.log('topics', _.uniq(alltopics));
      this.newDataArray = _.uniq(alltopics);
    });
  }

  ngOnChanges() {
  }

  onKey(value) {
    this.dataArray = [];
    this.selectSearch(value);
  }
  selectSearch(value: any) {
    let filter = value.toLowerCase();
    this.dropdownList.forEach(option => {
      if (option.toLowerCase().indexOf(filter) >= 0) {
        this.dataArray.push(option);
      }
    });
    this.newDataArray = this.dataArray; /*  === 0 ? this.dropdownList : this.dataArray; */
  }

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
  clearAll() {
    this.selectedItems = [];
    this.showReports();
  }

  onTopicChange(event) {
    console.log('Event on Topic : ', event);
    this.changeStackChart = false;
  }

  onLocationChange(event) {
    console.log('Event on Location : ', event);
  }

  onTimeChange(event) {
    console.log('Event on Time : ', event);
    if (event === 'Custom Date') {
      this.optionCustomDate = true;
    } else {
      this.optionCustomDate = false;
      this.dateFrom = '';
      this.dateTo = '';
    }
  }
}
