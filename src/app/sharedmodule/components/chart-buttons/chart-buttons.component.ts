import { Component, OnInit, Input } from '@angular/core';
import { Router  } from '@angular/router';
import { faStar} from '@fortawesome/free-solid-svg-icons';
import { ChartButtonService } from '../../services/chart-button/chart-button.service';

@Component({
  selector: 'app-chart-buttons',
  templateUrl: './chart-buttons.component.html',
  styleUrls: ['./chart-buttons.component.scss']
})
export class ChartButtonsComponent implements OnInit {

  @Input() dimension;
  showButtons = false;
  // faCheckCircle = faCheckCircle;
  faStar = faStar;
  markFavourite;
  timeViewBy;
  locationViewBy;
  constructor(private route: Router, private chartButtonService: ChartButtonService) { }

  ngOnInit() {
    // this.route.url.subscribe((url) => {
    //   console.log('URL : ', url);
    //   console.log(url[1].path);
    //   if (url[1].path !== 'favourite') {
    //     this.showButtons = true;
    //   }
    // });

    console.log(this.route.url);
    if (!this.route.url.includes('favourite')) {
        this.showButtons = true;
    }
    this.timeViewBy = this.chartButtonService.getTimeViewBy();
    // console.log('timeViewBy : ', this.timeViewBy);
    this.locationViewBy = this.chartButtonService.getLocationViewBy();
  }

  setFavourite() {
    this.markFavourite = !this.markFavourite;
  }

  timeViewByChange(event) {
    // console.log('Event : ', event.value);
    this.chartButtonService.updateViewByForChart({key: 'Time Period', value: this.timeViewBy});
  }

  locationViewByChange(event) {
    // console.log('Event : ', event.value);
    this.chartButtonService.updateViewByForChart({key: 'location', value: this.locationViewBy});
  }

}
