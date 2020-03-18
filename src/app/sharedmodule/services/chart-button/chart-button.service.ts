import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartButtonService {

  constructor() { }

  private chartButtonChange = new Subject<any>();
  public $chartButtonChange = this.chartButtonChange.asObservable();
  timeViewBy = [];
  locationViewBy = [];

  updateViewByForChart(viewBy, chartId) {
    if(viewBy.key === 'location') {
      this.locationViewBy[chartId] = viewBy.value;
    } else {
      this.timeViewBy[chartId] = viewBy.value;
    }
    this.chartButtonChange.next(viewBy);
  }

  getTimeViewBy(chartId) {
    return this.timeViewBy[chartId] ? this.timeViewBy[chartId] : 'month';
  }

  getLocationViewBy(chartId) {
    return this.locationViewBy[chartId] ? this.locationViewBy[chartId] : 'district';
  }

}
