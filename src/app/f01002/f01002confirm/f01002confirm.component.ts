import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-f01002confirm',
  templateUrl: './f01002confirm.component.html',
  styleUrls: ['./f01002confirm.component.css']
})
export class F01002confirmComponent {
  constructor(public dialogRef: MatDialogRef<F01002confirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
