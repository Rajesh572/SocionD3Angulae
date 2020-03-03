// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

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

    this.dataService.menuItems.forEach((menuItem) => {
      // let info = menuItem['info'];
      // let ngroute = menuItem['ngroute'];
      // let color = menuItem['color'];
      // let index = menuItem['index'];
      // let extra = menuItem['extra'];
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
    });

    this.dataService.getDummyTopics().subscribe((data) => {
      let alltopics = [];
      data['data'].forEach(element => {
        alltopics.push(element['topic_name']);
      });
      console.log('topics', _.uniq(alltopics));
    });

  }

}
