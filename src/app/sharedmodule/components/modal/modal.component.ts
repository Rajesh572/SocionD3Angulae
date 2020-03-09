import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {


  faCheck = faCheck;
  selectedItems = [];
  selectedHorizontalValue: string;

  constructor(public dialogRef: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) { }

  dataArray = this.data.options;
  selectedKey = this.data.selected;

  ngOnInit() {
  }

  onHorizontalAxisSelect(key) {
    // console.log(this.dataArray);
    this.selectedItems = [];
    this.selectedHorizontalValue = key;
    this.dialogRef.close(this.selectedHorizontalValue);
  }

  getSelectedHorizontalAxis() {

    return this.selectedHorizontalValue;
  }

}
