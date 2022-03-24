import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F02002Service } from '../f02002.service';

@Component({
  selector: 'app-f02002add',
  templateUrl: './f02002add.component.html',
  styleUrls: ['./f02002add.component.css','../../../assets/css/f02.css']
})
export class F02002addComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F02002addComponent>,
    public f02002Service: F02002Service,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) { }

  empunitlistValue: string;
  empdeptlistValue: string;
  dateType: OptionsCode[];
  levelStartDateValue: Date;
  levelEndDateValue: Date;
  date1:string;
  date2:string;
  check:boolean;

  ngOnInit(): void {
    this.dateType = this.data.levelStartDateTypeCode;
    this.data.levelStartDateTypeCode = [];
    this.data.levelEndDateTypeCode = [];
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  //沒日期 日期型態不可填
  changeDATE_TYPE(key: string,s:any) {
    if(key=='Start')
    {
      this.date1=this.datepipe.transform(new Date(s),'yyyy-MM-dd');
    }
    else
    {
      this.date2=this.datepipe.transform(new Date(s),'yyyy-MM-dd');
    }


    if(this.date1==this.date2)
    {
      this.check=true;
      this.data.LEAVE_ENDDATE_TYPE=this.data.LEAVE_STARTDATE_TYPE ;
    }
    else
    {
      this.check =false;
    }

    if (key == 'Start') {
      this.data.levelStartDateTypeCode = this.data.LEAVE_STARTDATE == null ? [] : this.dateType;
    }
    else {
      this.data.levelEndDateTypeCode = this.data.LEAVE_ENDDATE == null ? [] : this.dateType;
    }


  }

  reason()
  {
    if(this.check)
    {
      this.data.LEAVE_ENDDATE_TYPE=this.data.LEAVE_STARTDATE_TYPE ;
    }
  }


  submit() {
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();
  }

   //檢查身分證
   checkIDCard(ID :string) {
    var value = ID.trim().toUpperCase();
    var a = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O');
    var b = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
    var c = new Array(2);
    var d;
    var e;
    var f;
    var g = 0;
    var h = /^[a-z](1|2)\d{8}$/i;
    if (value.search(h) == -1) {
      return false;
    }
    else {
      d = value.charAt(0).toUpperCase();
      f = value.charAt(9);
    }

    for (var i = 0; i < 26; i++) {
      if (d == a[i])//a==a
      {
        e = i + 10; //10
        c[0] = Math.floor(e / 10); //1
        c[1] = e - (c[0] * 10); //10-(1*10)
        break;
      }
    }
    for (var i = 0; i < b.length; i++) {
      if (i < 2) {
        g += c[i] * b[i];
      }
      else {
        g += parseInt(value.charAt(i - 1)) * b[i];
      }
    }
    if ((g % 10) == f) {
      return true;
    }
    if ((10 - (g % 10)) != f) {
      return false;
    }
    return true;
  }

  //新增
  public async confirmAdd(): Promise<void> {
    let start = this.datepipe.transform(this.data.LEAVE_STARTDATE, 'yyyyMMdd')
    let end = this.datepipe.transform(this.data.LEAVE_ENDDATE, 'yyyyMMdd')

    if (!this.checkIDCard(this.data.EMP_ID)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '員工ID格式不正確' }
      });
      return;
    }
    if (start > end) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請假起日不可大於請假迄日!!' }
      });
      return;
    }
    if ( this.data.LEAVE_STARTDATE != null ) {
      if ( this.data.LEAVE_STARTDATE_TYPE == null ) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '請填寫請假類型!!' }
        });
        return ;
      }
    }
    if ( this.data.LEAVE_ENDDATE != null ) {
      if ( this.data.LEAVE_ENDDATE_TYPE == null ) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '請填寫請假類型!!' }
        });
        return ;
      }
    }
    let msgStr: string = "";
    let baseUrl = 'f02/f02002action2';
    msgStr = await this.f02002Service.addorEditSystemCodeSet(baseUrl, this.data);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '新增成功!') { this.dialogRef.close({ event: 'success' }); }
  }
}
