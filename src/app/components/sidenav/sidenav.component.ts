import { Component, OnInit } from '@angular/core';
import { faTachometerAlt, faTh, faStar} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  // faUsers = faUsers;
  // faUser = faUserSecret;
  faTachometerAlt = faTachometerAlt;
  faTh = faTh;
  faStar = faStar;
  constructor() { }
  activatemenu = false;
  ngOnInit() {
  }

}
