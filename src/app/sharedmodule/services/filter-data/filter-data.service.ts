import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterDataService {

  timeArray = ['Last 6 months',
  'Last 3 months',
  'Last 1 month',
  'Last 2 weeks',
  'Last 1 week',
  'Custom Date'];

  constructor(private http: HttpClient) { }


  private filterObjectChange = new Subject<any>();
  public $filterObjectChange = this.filterObjectChange.asObservable();
  
  programDetails = {
    progrma_name: 'Hepatitis - c Awareness',
    program_id: 236
};
  filterKeys = ['location', 'topic_name'];
  filter = {};

  getDataForFilters() {
    const requestBody = this.generateRequestBody();
    console.log('Request : ', requestBody);
    return this.http.post('/v1/api/event/unique/read', requestBody);
  }

  getTimeArrayObject() {
    return [...this.timeArray];
  }

  generateRequestBody() {
    const requestObject = {};
    requestObject['filter'] = {};
    requestObject['filter']['program_id'] = this.programDetails.program_id;
    requestObject['params'] = this.filterKeys;
    return requestObject;
  }

  setFilterObject(filter) {
    this.filter = filter;
  }

  getFilterObject() {
    return {...this.filter};
  }

  addToFilterObject(filter) {
    this.filter = {};
    console.log('Filter in addToFilterObject: ', filter);
    // check if location filter is selected or not
    if (!!filter.locations && filter.locations.length > 0) {
      this.filter['location'] = filter.locations;
    }

    // check if topic filter is selected or not
    if (!!filter.topics && filter.topics.length > 0) {
      this.filter['topic_name'] = filter.topics;
    }

    // check if time filter is selected or not
    if (!!filter.time) {
      let end = new Date();
      let start: Date;
      switch (filter.time) {
        case 'Custom Date': {
          start = filter.startTime;
          end = filter.endTime;
          break;
        }
        case 'Last 6 months': {
          start = new Date();
          start.setMonth(start.getMonth() - 6);
          break;
        }
        case 'Last 3 months': {
          start = new Date();
          start.setMonth(start.getMonth() - 3);
          break;
        }
        case 'Last 1 month': {
          start = new Date();
          start.setMonth(start.getMonth() - 1);
          break;
        }
        case 'Last 2 weeks': {
          start = new Date();
          start.setDate(start.getDate() - 14);
          break;
        }
        case 'Last 1 week': {
          start = new Date();
          start.setDate(start.getDate() - 7);
          break;
        }
        default : {}
      }
      this.filter['start_time'] = start;
      this.filter['end_time'] = end;
    }
    console.log('Filter in Filter Service: ', this.filter);
    this.filterObjectChange.next(this.filter);
  }
}
