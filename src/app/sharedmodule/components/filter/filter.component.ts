import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import * as _ from 'lodash';
import { FilterDataService } from '../../services/filter-data/filter-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  selectedTopics = [];
  selectedLocations = [];
  selectedTime;
  dataArray: any[];
  dropdownList: any;
  optionCustomDate = false;
  startDate = '';
  startDateTime = '';
  endDate = '';
  serializedStartDate = new FormControl((new Date()).toISOString());
  serializedEndDate = new FormControl((new Date()).toISOString());
  // newDataArray = [];
  topicArray = [];
  filteredTopicArray = [];
  locationArray = [];
  filteredLocationArray = [];
  timeArray = [];
  filteredTimeArray = [];
  filterServiceSubscription: Subscription;


  constructor(private filterService: FilterDataService) { }

  ngOnInit() {
    // console.log('Serialzied date value :', this.serializedDate);
    const filterData = this.filterService.getFilterData();
    if (Object.keys(filterData).length === 0) {
      try {
        this.filterServiceSubscription = this.filterService.getDataForFilters().subscribe((data) => {
          console.log('data for filter', data);
          this.filterService.setFilterData(data['result']);
          this.topicArray = data['result']['topic_name'];
          this.locationArray = data['result']['location'];
          this.timeArray = this.filterService.getTimeArrayObject();
          this.filteredTopicArray = this.topicArray;
          this.filteredLocationArray = this.locationArray;
          this.filteredTimeArray = this.timeArray;
        });
      } catch (e) {
        console.log('Error in Filter Component while getting the filter menu data : ', e);
      }
    } else {
      this.topicArray = filterData['topic_name'];
      this.locationArray = filterData['location'];
      this.filteredTopicArray = this.topicArray;
      this.filteredLocationArray = this.locationArray;
      this.timeArray = this.filterService.getTimeArrayObject();
      this.filteredTimeArray = this.timeArray;
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

  // onKey(value) {
  //   this.dataArray = [];
  //   this.selectSearch(value);
  // }

  onKey(value, key) {
    // this.dataArray = [];
    // this.selectSearch(value, );
    console.log('Value: ', value);
    switch (key) {
      case 'location': {
        this.filteredLocationArray = this.sortArrayOnKey(value, this.locationArray);
        break;
      }
      case 'topic': {
        this.filteredTopicArray = this.sortArrayOnKey(value, this.topicArray);
        break;
      }
      case 'time': {
        this.filteredTimeArray = this.sortArrayOnKey(value, this.timeArray);
        break;
      }
      default: {
      }
    }
  }

  sortArrayOnKey(value, arrayToSort) {
    const newArraySort = arrayToSort.filter((element) => {
      if ((element.toLowerCase()).startsWith(value.toLowerCase())) {
        return true;
      }
    });
    return newArraySort;
  }

  // selectSearch(value: any) {
  //   let filter = value.toLowerCase();
  //   this.dropdownList.forEach(option => {
  //     if (option.toLowerCase().indexOf(filter) >= 0) {
  //       this.dataArray.push(option);
  //     }
  //   });
  //   this.newDataArray = this.dataArray;
  //   /*  === 0 ? this.dropdownList : this.dataArray; */
  // }

  applyFilter() {
    console.log(this.startDate);
    this.filterService.addToFilterObject({
      locations: this.selectedLocations,
      topics: this.selectedTopics,
      time: this.selectedTime,
      startTime: this.startDate,
      endTime: this.endDate
    });
  }

  onStartDateChange(event) {
    this.startDate = event;
  }

  onEndDateChange(event) {
    this.endDate = event;
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
        if(this.selectedTime === 'Custom Date') {
          this.optionCustomDate = true;
        } else {
          this.serializedStartDate = new FormControl((new Date()).toISOString());
          this.serializedEndDate = new FormControl((new Date()).toISOString());
          this.optionCustomDate = false;
        }
      }
      if (filter.start_time) {
        this.startDate = filter.start_time;
        if (!!this.startDate) {
          this.serializedStartDate = new FormControl(this.startDate);
        }
      }
      if (filter.end_time) {
        this.endDate = filter.end_time;
        if (!!this.endDate) {
          this.serializedEndDate = new FormControl(this.endDate);
        }
      }
    }
  }

  ngOnDestroy() {
    if(!!this.filterServiceSubscription) {
      this.filterServiceSubscription.unsubscribe();
    }  }
}
