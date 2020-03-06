// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as _ from 'lodash';
import { DashboardDataService } from 'src/app/sharedmodule/services/dashboard-data/dashboard-data.service';
import { Observable, forkJoin } from 'rxjs';
import { FilterDataService } from 'src/app/sharedmodule/services/filter-data/filter-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dropdownList: any;
  constructor(
    private http: HttpClient,
    //  private dataService: DataService,
    private dashboardService: DashboardDataService,
    private filterService: FilterDataService) { }
  dashboardData = [];
  requestBody = [];
  // dataArr = [];

  ngOnInit() {
    try {
      const programId = this.dashboardService.getProgramDetails().program_id;
      const menuOptions = this.dashboardService.getMenuOptions();

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
        // this.requestBody.forEach((item) => {
        //   if (!!filter.location) {
        //     item.filter['location'] = filter.location;
        //   }
        //   if (!!filter.topic_name) {
        //     item.filter['location'] = filter.topic_name;
        //   }
        // });
      });

      // console.log(menuOptions);
      // menuOptions.forEach((option) => {
      //   // console.log('option : ', option);
      //   const requestBody = this.dashboardService.checkUniqueOption(option);
      //   const paramObject = this.dashboardService.createParamsObject(option.params);
      //   requestBody['params'] = paramObject;

      //   const filterObject = this.dashboardService.createFilterObject(programId);
      //   // console.log('Filter : ', filterObject);
      //   requestBody['filter'] = filterObject;
      //   // console.log('Request : ', requestBody);
      //   this.requestBody.push(requestBody);
      // });
      // this.collectDashboardData();
    } catch (e) {
      console.log('Error in Dashboard Component while fetching Dashboard Item Data : ', e);
    }
  }

  collectDashboardData() {
    const dashboardRequests = [];
    console.log('Request Bodies : ', this.dashboardData);
    this.requestBody.forEach((requestEach) => {
      dashboardRequests.push(this.dashboardService.getDashboardData(requestEach));
    });

    forkJoin(dashboardRequests).subscribe((dashboardData) => {
      console.log(dashboardData);
      if (this.dashboardData.length > 0) {
        this.dashboardData = [];
      }
      console.log('dashboardData : ', dashboardData);

      // check if array is empty
      const keys = ['event_type', 'role'];
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
