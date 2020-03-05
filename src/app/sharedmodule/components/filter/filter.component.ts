import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as _ from 'lodash';
import { FilterDataService } from '../../services/filter-data/filter-data.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  selectedTopics = [];
  selectedLocations = [];
  selectedTime;
  dataArray: any[];
  dropdownList: any;
  optionCustomDate = false;
  startDate = '';
  endDate = '';
  serializedDate = new FormControl((new Date()).toISOString());
  newDataArray = [];
  topicArray = [];
  locationArray = [];
  timeArray = [];


  constructor(private dataService: DataService, private filterService: FilterDataService) { }

  ngOnInit() {
    try {
    this.filterService.getDataForFilters().subscribe((data) => {
      console.log('data ofr filter', data);
      this.topicArray = data['result']['topic_name'];
      this.locationArray = data['result']['location'];
      this.timeArray = this.filterService.getTimeArrayObject();
      console.log('Time : ', this.timeArray);
    });
  } catch (e) {
    console.log('Error in Filter Component while getting the filter menu data : ', e);
  }

    // this.dataService.getDummyTopics().subscribe((data) => {
    //   let alltopics = [];
    //   console.log('data ofr filter', data);
    //   data['data'].forEach(element => {
    //     alltopics.push(element['topic_name']);
    //   });
    //   console.log('topics', _.uniq(alltopics));
    //   this.newDataArray = _.uniq(alltopics);
    // });
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
      this.startDate = '';
      this.endDate = '';
    }
  }

  clearAll() {
    this.selectedTopics = [];
    this.selectedLocations = [];
    this.selectedTime = undefined;
    this.optionCustomDate = false;
    this.startDate = '';
    this.endDate = '';
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

  applyFilter() {
    this.filterService.addToFilterObject({
      locations: this.selectedLocations,
      topics: this.selectedTopics,
      time: this.selectedTime,
      startTime: this.startDate,
      endTime: this.endDate});
  }



}
