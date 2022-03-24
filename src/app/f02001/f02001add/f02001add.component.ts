import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F02001Service } from '../f02001.service';

@Component({
  selector: 'app-f02001add',
  templateUrl: './f02001add.component.html',
  styleUrls: ['./f02001add.component.css','../../../assets/css/f02.css']
})
export class F02001addComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F02001addComponent>,
    public f02001Service: F02001Service,
    public dialog: MatDialog
  ) { }

  ynCode: OptionsCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  hidden: string = "hidden";

  ngOnInit(): void {
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
    this.formControl.hasError('email') ? 'Not a valid email' :
    '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f02/f02001action2';
    this.hidden = "hidden";
    if( isNaN( this.data.codeSort ) ) {
      this.hidden = "";
    } else {
      msgStr = await this.f02001Service.addOrEditSystemCodeSet(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '儲存成功！') { this.dialogRef.close({ event:'success' }); }
    }
  }
}
