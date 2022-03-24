import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F02002Service } from '../f02002.service';

@Component({
  selector: 'app-f02002amt',
  templateUrl: './f02002amt.component.html',
  styleUrls: ['./f02002amt.component.css','../../../assets/css/f02.css']
})
export class F02002amtComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F02002amtComponent>,
    public dialog: MatDialog,
    public f02002Service: F02002Service
  ) { }

  checked = [] //存取被選到的物件
  check: boolean = false
  one: any[] = [] //裝一開始的資料表
  x: string

  ngOnInit(): void {
    for (const obj of this.data.SOURCE) {
      obj.MAX_APPROVE_AMT = this.limit(obj.MAX_APPROVE_AMT);
    }
    this.getCheckList()
  }

  limit(x: string) {
    if (x != null) {
      x=x.toString();
      x = x.replace(/[^\d]/g, '');
      x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return x
  }

  //儲存前處理千分位
  Cut(s: string) {
    if (s != null) {
      this.x = (s + "")
      this.x = this.x.replace(/,/g, "")
    }
    return s
  }

  //載入選項
  setAll(completed: boolean) {
    for (const obj of this.data.CHECKBOX) {
      obj.completed = completed
    }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close()
  }

  // 如果該row的isChk屬性為true就存入陣列
  test: any
  getCheckList() {
    this.checked = this.data.SOURCE.filter(data => data.MAX_APPROVE_AMT <= this.test)
  }

  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/,/g, "");
    }
    return this.x
  }

  //儲存角色設定
  public async confirmAdd(): Promise<void> {
    const baseUrl = 'f02/f02002action9'
    var valArray: string[] = []
    let jsonObject: any = {}
    jsonObject['empNo'] = this.data.empNo
    const array = this.data.SOURCE.filter(item => item.MAX_APPROVE_AMT != '' && item.MAX_APPROVE_AMT != undefined).map(item => ({
      empNo: this.data.empNo,
      prodType: item.PROD_CODE,
      maxApproveAmt: (item.MAX_APPROVE_AMT + "").replace(/,/g, ""),
    }))
    let msgStr = ''
    this.f02002Service.saveEmployeeRole(baseUrl, array).subscribe(data => {
      msgStr = data.rspCode === '0000' && data.rspMsg === '成功' ? '儲存成功！' : '儲存失敗！'
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr },
      })
      if (msgStr === '儲存成功！') {
        this.dialogRef.close({ event: 'success' })
      }
    })
  }

}
