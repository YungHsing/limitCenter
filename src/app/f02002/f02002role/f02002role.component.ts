import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F02002Service } from '../f02002.service';

@Component({
  selector: 'app-f02002role',
  templateUrl: './f02002role.component.html',
  styleUrls: ['./f02002role.component.css', '../../../assets/css/f02.css']
})
export class F02002roleComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F02002roleComponent>,
    public dialog: MatDialog,
    public f02002Service: F02002Service
  ) { }

  ngOnInit(): void {
  }

  //載入選項
  setAll(completed: boolean) {
    for (const obj of this.data.CHECKBOX) {
      obj.completed = completed;

    }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();
  }

  //儲存角色設定
  public async confirmAdd(): Promise<void> {
    var valArray: string[] = new Array;
    for (const obj of this.data.CHECKBOX) {
      if (obj.completed) { valArray.push(obj.value); }
    }
    let jsonObject: any = {};
    let roleNo: string = valArray.toString().replace(/,/g,'_');
    jsonObject['empNo'] = this.data.empNo;
    jsonObject['roleNo'] = roleNo;
    let msgStr = '';
    const baseUrl = 'f02/f02002action4';
     this.f02002Service.saveEmployeeRole(baseUrl, jsonObject).subscribe(data => {
      msgStr = (data.rspCode === '0000' && data.rspMsg === '儲存成功!') ? '儲存成功！' : '儲存失敗！';
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '儲存成功！') { this.dialogRef.close({ event:'success' }); }
    });
  }
}
