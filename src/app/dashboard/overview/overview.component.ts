// tslint:disable: no-string-literal
// tslint:disable: prefer-const

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @Input() data;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
  }

  getColorCode() {
    const colorcodes = {
      background: this.data.color
    };
    return colorcodes;
  }

  onReportSelect(count) {
    try {
      if (count > 0) {
        if (this.dataService.attributeKeys.includes(this.data.title)) {
          this.router.navigateByUrl('/reports/select', { state: { id: this.data.title } });
        }
      }
    } catch (e) {
      console.log('Error while navigating to the report select page : ', e);
    }
  }
}


