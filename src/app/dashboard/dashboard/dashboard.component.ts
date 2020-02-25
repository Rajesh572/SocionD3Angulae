// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedItems = [];
  selectedLocations = [];
  selectedTime = '';
  constructor(private http: HttpClient, private dataService: DataService, private route: Router) { }
  dataArr = [];
  optionCustomDate = false;
  dateFrom = '';
  dateTo = '';
  serializedDate = new FormControl((new Date()).toISOString());
  newDataArray = [];
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
  ngOnInit() {

    this.dataService.menuItems.forEach((menuItem) => {
      let info = menuItem['info'];
      let ngroute = menuItem['ngroute'];
      let color = menuItem['color'];
      let index = menuItem['index'];
      let extra = menuItem['extra'];
      this.http.get(this.dataService.apiUrl + menuItem['route']).subscribe((data) => {
        let obj = {};
        obj['info'] = info;
        obj['value'] = data[0]['value'];
        obj['ngroute'] = ngroute;
        obj['color'] = color;
        obj['index'] = index;
        obj['extra'] = extra;
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
      this.newDataArray = _.uniq(alltopics);
    });

  }

  onTopicChange(event) {
    console.log('Event on Topic : ', event);
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

  // onKey(value) {
  //   this.dataArray = [];
  //   this.selectSearch(value);
  // }
  // selectSearch(value: any) {
  //   let filter = value.toLowerCase();
  //   for (let i = 0; i < this.dropdownList.length; i++) {
  //     let option = this.dropdownList[i];
  //     if (option.toLowerCase().indexOf(filter) >= 0) {
  //       this.dataArray.push(option);
  //     }
  //   }
  //   this.newDataArray = this.dataArray;/*  === 0 ? this.dropdownList : this.dataArray; */
  // }
}
