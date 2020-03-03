import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { API_URL } from './../config/config';

@Component({
  selector: 'app-uploadmodal',
  templateUrl: './uploadmodal.component.html',
  styleUrls: ['./uploadmodal.component.scss']
})
export class UploadmodalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UploadmodalComponent>,
    private http: HttpClient) { }

  ngOnInit() {
  }

  onFilesAdded(e) {
    let formData = new FormData();
    let fileData: File = e.target.files[0]
    formData.append('file', fileData);
    this.http.post(API_URL + "upload", formData).subscribe((res) => {
      var blob = new Blob([res['data']], { type: 'text/json; charset=utf-8' });
      var downloadUrl = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "download.csv";
      document.body.appendChild(a);
      a.click();
    }
      , error => console.log("error", error))

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}
