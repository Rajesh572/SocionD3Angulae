import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartButtonService {

  constructor() { }

  private chartButtonChange = new Subject<any>();
  public $chartButtonChange = this.chartButtonChange.asObservable();
  timeViewBy;
  locationViewBy;

  updateViewByForChart(viewBy) {
    if(viewBy.key === 'location') {
      this.locationViewBy = viewBy.value;
    } else {
      this.timeViewBy = viewBy.value;
    }
    this.chartButtonChange.next(viewBy);
  }

  getTimeViewBy() {
    return this.timeViewBy ? this.timeViewBy : 'month';
  }

  getLocationViewBy() {
    return this.locationViewBy ? this.locationViewBy : 'district';
  }

}
