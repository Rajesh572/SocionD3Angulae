import { Component, OnInit } from '@angular/core';
import { faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadmodalComponent } from '../../../../uploadmodal/uploadmodal.component';
@Component({
  selector: 'app-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.scss']
})
export class UsermenuComponent implements OnInit {
  faUser = faUser;
  falogout = faPowerOff;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  openModal(): void {
    const dialogRef = this.dialog.open(UploadmodalComponent, {
      minWidth: 400,
      minHeight: 200
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
