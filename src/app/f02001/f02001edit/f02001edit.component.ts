import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F02001Service } from '../f02001.service';

@Component({
  selector: 'app-f02001edit',
  templateUrl: './f02001edit.component.html',
  styleUrls: ['./f02001edit.component.css','../../../assets/css/f02.css']
})
export class F02001editComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F02001editComponent>,
    public dialog: MatDialog,
    public f02001Service: F02001Service
  ) { }

  ngOnInit(): void {
  }

  ynCode: OptionsCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  hidden: string = "hidden";

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' : '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async stopEdit(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f02/f02001action3';
    this.hidden = "hidden";
    if( isNaN( this.data.codeSort ) ) {
      this.hidden = "";
      return;
    } else {
      msgStr = await this.f02001Service.addOrEditSystemCodeSet(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '編輯成功!') { this.dialogRef.close({ event:'success' }); }
    }
  }

  min = 1;
  max = 1;
  test1() {
    // this.min = 10;
    this.min = this.data.codeTag.length / (document.getElementById('test').clientWidth / 10);
  }

  test2() {
   this.min = 1;
  }

  change() {
    this.min = this.data.codeTag.length / (document.getElementById('test').clientWidth / 10);
  }

}
