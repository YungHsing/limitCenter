import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './f01001confirm.component.html',
  styleUrls: ['./f01001confirm.component.css']
})
export class F01001confirmComponent {
  constructor(public dialogRef: MatDialogRef<F01001confirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
