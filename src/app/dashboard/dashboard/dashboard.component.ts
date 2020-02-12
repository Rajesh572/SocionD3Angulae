import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../../data.service'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient, private dataService: DataService, private route: Router) { }
  dataArr = []
  ngOnInit() {
    
    this.dataService.menuItems.forEach((data) => {
      let info = data['info'];
      let ngroute = data['ngroute'];
      let color = data['color']
      let index = data['index']
      let extra = data['extra']
      this.http.get(this.dataService.apiUrl + data['route']).subscribe((data) => {
        let obj = {}
        obj['info'] = info;
        obj['value'] = data[0]['value'];
        obj['ngroute'] = ngroute;
        obj['color'] = color;
        obj['index'] = index;
        obj['extra'] = extra;
        this.dataArr.push(obj)
        this.dataArr.sort((a, b) => { return a['index'] - b['index'] })
      })
    })

  }
}
