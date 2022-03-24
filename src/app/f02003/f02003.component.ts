import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { checkBox, OptionsCode } from '../interface/base';
import { F02003Service } from './f02003.service';

@Component({
  selector: 'app-f02003',
  templateUrl: './f02003.component.html',
  styleUrls: ['./f02003.component.css','../../assets/css/f02.css']
})
export class F02003Component implements OnInit {

  constructor(
    private f02003Service: F02003Service,
    public dialog: MatDialog,
    private nzI18nService: NzI18nService,
  ) {
    this.nzI18nService.setLocale(zh_TW)
  }

  isAllCheck: boolean = false;
  sysCode: OptionsCode[] = [];
  chkArray: checkBox[] = [];
  selectedValue: string = 'default';
  roleFunctionSource = new MatTableDataSource<any>();

  ngOnInit(): void {
    const baseUrl = 'f02/f02003';
    let jsonObject: any = {};
    this.f02003Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.list) {
        const codeNo = jsonObj['roleNo'];
        const desc = jsonObj['roleName'];
        this.sysCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  save() {
    if (this.selectedValue == 'default') {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇角色!!!!' }
      });
      return false;
    }
    var valArray: string[] = new Array;
    for (const obj of this.chkArray)
    {
      if (obj.completed)
      { valArray.push(obj.value); }
    }
    let fnNo: string = valArray.toString().replace(/,/g,'_').replace(/-/g,'一');
    let jsonObject: any = {};
    jsonObject['roleNo'] = this.selectedValue;
    jsonObject['fnNo'] = fnNo;
    const baseUrl = 'f02/f02003action2';
    this.f02003Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    });
  }

  setAll(completed: boolean) {
    for (const obj of this.chkArray) {
      obj.completed = completed;
    }
  }

  async changeSelect() {
    this.isAllCheck = false;
    await this.getRoleFunction();
  }

  private async getRoleFunction() {
    const baseUrl = 'f02/f02003action1';
    let jsonObject: any = {};
    jsonObject['roleNo'] = this.selectedValue;
    this.f02003Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      if (this.chkArray.length > 0) {
        let i: number = 0;
        for (const jsonObj of data.rspBody) {
          const chkValue = jsonObj['FN_NO'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray[i] = { value: chkValue, completed: isChk == 'Y' };
          i++;
        }
      } else {
        for (const jsonObj of data.rspBody) {
          const chkValue = jsonObj['FN_NO'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray.push({ value: chkValue, completed: isChk == 'Y' });
        }
      }
      this.roleFunctionSource.data = data.rspBody;
    });
  }
}
