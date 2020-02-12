import { Component, OnInit, Input, Renderer2, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() ovrno;
  @Input() ovrtitle;
  @Input() colorcode;
  @Input() extra;

  barData: any;
  xd = []

  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { }

  ngOnInit() {
  }

  getColorCode() {
    const colorcodes = {
      'background': this.colorcode
    };
    return colorcodes;
  }

  onReportSelect() {
    if (this.ovrtitle === "Number of Content Views") {
      this.router.navigateByUrl("/reports/select", { state: { id: this.extra } })
    }

    if (this.ovrtitle === "Number of Attestation Generated") {
      this.router.navigateByUrl("/reports/select", { state: { id: this.ovrtitle } })

    }

    if (this.ovrtitle === "Number of Sessions Completed") {
      this.router.navigateByUrl("/reports/select", { state: { id: this.ovrtitle } })
    }

    if (this.ovrtitle === "Number of Unique Trainers") {
      this.router.navigateByUrl("/reports/select", { state: { id: this.ovrtitle } })
    }

    if (this.ovrtitle === "Number of Unique Participants") {
      this.router.navigateByUrl("/reports/select", { state: { id: this.ovrtitle } })
    }
  }
}


