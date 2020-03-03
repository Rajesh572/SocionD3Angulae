// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dropdownList: any;
  constructor(private http: HttpClient, private dataService: DataService) { }
  dataArr = [];


  ngOnInit() {
    try {
      this.dataService.menuItems.forEach((menuItem) => {
        this.http.get(this.dataService.apiUrl + menuItem['route']).subscribe((data) => {
          let obj = {};
          obj['info'] = menuItem['info'];
          obj['value'] = data[0]['value'];
          obj['ngroute'] = menuItem['ngroute'];
          obj['color'] = menuItem['color'];
          obj['index'] = menuItem['index'];
          obj['extra'] = menuItem['extra'];
          this.dataArr.push(obj);
          this.dataArr.sort((a, b) =>  a['index'] - b['index'] );
        });
      })
    } catch (e) {
      console.log('Error in Dashboard Component while fetching Dashboard Item Data : ', e);
    }

    try {
      this.dataService.getDummyTopics().subscribe((data) => {
        let alltopics = [];
        data['data'].forEach(element => {
          alltopics.push(element['topic_name']);
        });
        console.log('topics', _.uniq(alltopics));
      });
    } catch (e) {
      console.log('Error in Dashboard Component while fetching dummy Topics : ', e);
    }
  }

}
