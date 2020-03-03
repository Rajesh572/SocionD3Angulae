import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  selectedItems = [];
  selectedLocations = [];
  selectedTime;
  dataArray: any[];
  dropdownList: any;
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

  constructor(private dataService: DataService) { }

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

  clearAll() {
    this.selectedItems = [];
    this.selectedLocations = [];
    this.selectedTime = undefined;
    this.optionCustomDate = false;
    this.dateFrom = '';
    this.dateTo = '';
    this.ngOnInit();
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
    this.newDataArray = this.dataArray;
    /*  === 0 ? this.dropdownList : this.dataArray; */
  }

}
