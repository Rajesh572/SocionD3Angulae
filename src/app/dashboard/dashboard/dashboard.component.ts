// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DashboardDataService } from './../services/dashboard-data/dashboard-data.service';
import { forkJoin } from 'rxjs';
import { FilterDataService } from 'src/app/sharedmodule/services/filter-data/filter-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dropdownList: any;
  constructor(
    private dashboardService: DashboardDataService,
    private filterService: FilterDataService) { }
  dashboardData = [];
  requestBody = [];

  ngOnInit() {
    try {

      this.filterService.$filterObjectChange.subscribe((filter) => {
        console.log('filter: ', filter);
        const filterKeys = Object.keys(filter);
        if (!!filterKeys && filterKeys.length > 0) {
          this.dashboardService.applyFiltersToRequestBody(filter);
        } else {
          this.dashboardService.initializeRequestBody();
        }
        this.requestBody = this.dashboardService.getRequestBody();
        console.log('Request Body: ', this.requestBody);
        this.collectDashboardData();
      });
    } catch (e) {
      console.log('Error in Dashboard Component while fetching Dashboard Item Data : ', e);
    }
  }

  collectDashboardData() {
    const dashboardRequests = [];
    // console.log('Request Bodies : ', this.dashboardData);
    this.requestBody.forEach((requestEach) => {
      dashboardRequests.push(this.dashboardService.getDashboardData(requestEach));
    });

    forkJoin(dashboardRequests).subscribe((dashboardData) => {
      console.log(dashboardData);
      if (this.dashboardData.length > 0) {
        this.dashboardData = [];
      }
      console.log('dashboardData : ', dashboardData);

      dashboardData.forEach((dashboardDataEach) => {
        dashboardDataEach.result.forEach((data) => {
          this.dashboardData.push(data);
        });
      });
      this.dashboardData = this.dashboardService.addColorsAndTitle(this.dashboardData);
      console.log('Data : ', this.dashboardData);

    });
  }
}
