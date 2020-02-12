import { Component, OnInit, OnChanges } from '@angular/core';
import { DataService } from "../../data.service"
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as _ from 'lodash'

@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportselectionComponent implements OnInit, OnChanges {
  dropdownList = [];
  selectedItems = [];
  unselected = [];
  barData: any;
  stackedData: any;
  showCharts = false;
  yAxisLabel: any;
  meta: any;
  faCheck = faCheck;
  verticalArr = ["Number of Sessions Completed",
    "Number of Attestation Generated",
    "Number of Unique Participants",
    "Number of Unique Trainers",
    "Number of Content Views"];

  horizontalArr = ["Time Period", "Location"];

  selectedHorizontalValue: string;
  selectedVerticalValue: string;
  multiLineData: any;
  topics: any[];
  modelSelected: any;
  dataArray: any[];
  newDataArray: any[];

  constructor(private dataService: DataService, private router: Router) {
    let extras = this.router.getCurrentNavigation().extras;
    if (extras.state != undefined) {
      let selectedmetric = extras['state']['id'];
      this.selectedVerticalValue = selectedmetric;
      this.selectedHorizontalValue = "Time Period";
      setTimeout(() => {
        this.showReports();
      });
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  onKey(value) {
    this.dataArray = [];
    this.selectSearch(value);
  }
  selectSearch(value: any) {
    let filter = value.toLowerCase();
    for (let i = 0; i < this.dropdownList.length; i++) {
      let option = this.dropdownList[i];
      if (option.toLowerCase().indexOf(filter) >= 0) {
        this.dataArray.push(option);
      }
    }
    this.newDataArray = this.dataArray;/*  === 0 ? this.dropdownList : this.dataArray; */
  }

  onHorizontalAxisSelect(key) {
    this.selectedItems = [];
    this.dropdownList = []
    this.showCharts = false;
    this.selectedHorizontalValue = key;
  }

  onVerticalAxisSelect(key) {
    this.selectedItems = [];
    this.dropdownList = [];
    this.showCharts = false;
    this.selectedVerticalValue = key
  }

  getSelectedHorizontalAxis() {
    return this.selectedHorizontalValue
  }

  getSelectedVerticalAxis() {
    return this.selectedVerticalValue;
  }

  showReports() {

    if (this.selectedItems.length > 0) {
      this.dataService.seletedTopics.next(this.selectedItems)
    }

    this.dataService.setAllSelectedAxis({ dimension: this.selectedHorizontalValue, metric: this.selectedVerticalValue }, this.selectedItems)
    if (this.selectedVerticalValue === "Number of Sessions Completed") {
      this.yAxisLabel = this.selectedVerticalValue
    }
    else if (this.selectedVerticalValue === "Number of Attestation Generated") {
      this.yAxisLabel = this.selectedVerticalValue;
    }
    else if (this.selectedVerticalValue === "Number of Content Views") {
      this.yAxisLabel = this.selectedVerticalValue;
    }
    else if (this.selectedVerticalValue === "Number of Unique Participants") {
      this.yAxisLabel = this.selectedVerticalValue
    }
    else if (this.selectedVerticalValue === "Number of Unique Trainers") {
      this.yAxisLabel = this.selectedVerticalValue
    }
    this.getDataforCharts();
  }

  getDataforCharts() {
    this.dataService.$barChartData.subscribe((bardata) => {
      this.barData = bardata;
    })
    this.dataService.$stackedChartData.subscribe((stackdata) => {
      this.stackedData = stackdata;
    })
    this.dataService.$multiLineChartData.subscribe((multilinedata) => {
      this.multiLineData = multilinedata;
    })
    this.dataService.$allTopics.subscribe((topics: any[]) => {
      this.topics = topics;
      let topics2 = [];
      topics2 = topics;
      this.dropdownList = [];

      setTimeout(() => {
        this.dropdownList = this.topics;
        this.newDataArray = this.topics;
      }, 500);
    })
    setTimeout(() => {
      this.showCharts = true;
    });
  }
  clearAll() {
    this.selectedItems = [];
    this.showReports();
  }
}