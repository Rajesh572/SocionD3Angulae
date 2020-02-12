import { Component, OnInit, OnChanges } from '@angular/core';
import { faUser, faTachometerAlt, faUsers, faUserSecret,faTh} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  faUsers = faUsers;
  faUser = faUserSecret;
  faTachometerAlt = faTachometerAlt;
  faTh=faTh
  constructor() { }
  activatemenu = false;
  ngOnInit() {
  }

}
