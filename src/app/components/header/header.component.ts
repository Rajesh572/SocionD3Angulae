import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  searchText: string;


  constructor(private route: Router) { }

  ngOnInit() {
  }
  getSearch() {
    this.route.navigate(['search'], {queryParams: {usertext: this.searchText}});
  }

}
