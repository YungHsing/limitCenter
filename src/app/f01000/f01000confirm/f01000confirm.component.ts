import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './f01000confirm.component.html',
  styleUrls: ['./f01000confirm.component.css']
})
export class F01000confirmComponent {
  constructor(public dialogRef: MatDialogRef<F01000confirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
