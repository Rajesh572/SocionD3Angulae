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
    let filterData = this.filterService.getFilterData();
    if (Object.keys(filterData).length === 0) {
      try {
        this.filterService.getDataForFilters().subscribe((data) => {
          console.log('data for filter', data);
          this.filterService.setFilterData(data['result']);
          this.topicArray = data['result']['topic_name'];
          this.locationArray = data['result']['location'];
          this.timeArray = this.filterService.getTimeArrayObject();
        });
      } catch (e) {
        console.log('Error in Filter Component while getting the filter menu data : ', e);
      }
    } else {
      this.topicArray = filterData['topic_name'];
      this.locationArray = filterData['location'];
      this.timeArray = this.filterService.getTimeArrayObject();
    }
    const filter = this.filterService.getFilterObject();
    this.setFilterObjectParams(filter);
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
    this.filterService.clearFilterObject();
    // this.ngOnInit();
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
      endTime: this.endDate
    });
  }


  setFilterObjectParams(filter) {
    console.log(filter);
    if (Object.keys(filter).length > 0) {
      // const [location, topic_name, time, start_time, end_time] = filter;
      if (filter.location) {
        this.selectedLocations = filter.location;
      }
      if (filter.topic_name) {
        this.selectedTopics = filter.topic_name;
      }
      if (filter.time) {
        this.selectedTime = filter.time;
      }
      if (filter.start_time) {
        this.startDate = filter.start_time;
      }
      if (filter.end_time) {
        this.endDate = filter.end_time;
      }
    }
  }

}
