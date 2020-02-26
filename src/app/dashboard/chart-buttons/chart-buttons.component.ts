import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faStar} from '@fortawesome/free-solid-svg-icons';

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
  timeFilter = 'month';
  locationFilter = 'state';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.url.subscribe((url) => {
      console.log(url[1].path);
      if (url[1].path !== 'favourite') {
        this.showButtons = true;
      }
    });
  }

  setFavourite() {
    this.markFavourite = !this.markFavourite;
  }
}
