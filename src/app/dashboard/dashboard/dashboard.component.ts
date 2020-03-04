// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as _ from 'lodash';
import { DashboardDataService } from 'src/app/sharedmodule/services/dashboard-data/dashboard-data.service';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dropdownList: any;
  constructor(private http: HttpClient, private dataService: DataService, private dashboardService: DashboardDataService) { }
  dashboardData = [];
  // dataArr = [];

  ngOnInit() {
    try {
      // console.log('INIT block');
      const programId = this.dashboardService.getProgramDetails().program_id;
      const menuOptions = this.dashboardService.getMenuOptions();


      const dashboardRequests = [];
      console.log(menuOptions);
      menuOptions.forEach((option) => {
        // console.log('option : ', option);
        const requestBody = this.dashboardService.checkUniqueOption(option);
        const filterObject = this.dashboardService.createFilterObject(option.filter, programId);
        // console.log('Filter : ', filterObject);
        requestBody['filter'] = filterObject;
        // console.log('Request : ', requestBody);
        dashboardRequests.push(this.dashboardService.getDashboardData(requestBody));
      });

      forkJoin(dashboardRequests).subscribe((dashboardData) => {
        console.log(dashboardData);
        dashboardData.forEach((dashboardDataEach) => {
          dashboardDataEach.result.forEach((data) => {
            this.dashboardData.push(data);
          });
        });
        this.dashboardData = this.dashboardService.addColorsAndTitle(this.dashboardData);
        console.log('Data : ', this.dashboardData);

      });
      // this.dataService.menuItems.forEach((menuItem) => {
      //   this.http.get(this.dataService.apiUrl + menuItem['route']).subscribe((data) => {
      //     let obj = {};
      //     obj['info'] = menuItem['info'];
      //     obj['value'] = data[0]['value'];
      //     obj['ngroute'] = menuItem['ngroute'];
      //     obj['color'] = menuItem['color'];
      //     obj['index'] = menuItem['index'];
      //     obj['extra'] = menuItem['extra'];
      //     this.dataArr.push(obj);
      //     this.dataArr.sort((a, b) =>  a['index'] - b['index'] );
      //   });
      // })
    } catch (e) {
      console.log('Error in Dashboard Component while fetching Dashboard Item Data : ', e);
    }

    // try {
    //   this.dataService.getDummyTopics().subscribe((data) => {
    //     let alltopics = [];
    //     data['data'].forEach(element => {
    //       alltopics.push(element['topic_name']);
    //     });
    //     console.log('topics', _.uniq(alltopics));
    //   });
    // } catch (e) {
    //   console.log('Error in Dashboard Component while fetching dummy Topics : ', e);
    // }
  }

}
