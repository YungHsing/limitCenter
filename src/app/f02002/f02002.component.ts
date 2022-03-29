import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode, RoleItem, checkBox } from '../interface/base';
import { F02002Service } from './f02002.service';
import { F02002addComponent } from './f02002add/f02002add.component';
import { F02002amtComponent } from './f02002amt/f02002amt.component';
import { F02002editComponent } from './f02002edit/f02002edit.component';
import { F02002prjComponent } from './f02002prj/f02002prj.component';
import { F02002roleComponent } from './f02002role/f02002role.component';

@Component({
  selector: 'app-f02002',
  templateUrl: './f02002.component.html',
  styleUrls: ['./f02002.component.css', '../../assets/css/f02.css']
})
export class F02002Component implements OnInit {

  constructor(
    private f02002Service: F02002Service,
    public dialog: MatDialog,
    private pipe: DatePipe,
    private nzI18nService: NzI18nService
  ) {
    this.nzI18nService.setLocale(zh_TW);
  }

  total = 1
  loading = true
  pageSize = 50
  pageIndex = 1

  agent_empCode: OptionsCode[] = [] //代理人
  levelStartDateTypeCode: OptionsCode[] = [] //日期種類起
  levelEndDateTypeCode: OptionsCode[] = [] //日期種類迄
  roleCode: OptionsCode[] = [] //角色
  on_jobCode: OptionsCode[] = [] //是否在職
  assign_stopCode: OptionsCode[] = [] //是否停派
  empdeptlistCode: OptionsCode[] = [] //部門
  empunitlistCode: OptionsCode[] = [] //單位

  empNoValue: string //員工編號
  empNameValue: string //員工姓名
  empIDValue: string //員工ID
  agent_empValue: string //代理人
  emailValue: string //email
  on_jobValue: string = 'Y' //是否在職預設Y
  assign_stopValue: string //是否停派
  levelStartDateTypeValue: string //請假起日
  levelEndDateTypeValue: string //請假起日類型
  levelStartDateValue: Date //請假起日類型值
  levelStartDateString: string //請假迄日
  levelEndDateValue: Date //請假迄日類型
  levelEndDateString: string //請假迄日類型值
  one: string //裝一開始的資料表
  employeeSource = new MatTableDataSource<any>() //組織人員維護Table
  empRoleSource = new MatTableDataSource<RoleItem>() //角色Table
  empPrjSource = new MatTableDataSource<RoleItem>() //專案Table
  empAmtSource = new MatTableDataSource<RoleItem>() //產品Table

  Maintainer = false;
  f03006word = "";
  hide = true;

  ngOnInit(): void {
    this.getEmployeeList(this.pageIndex, this.pageSize)
    const baseUrl = 'f02/f02002' //代理人
    let jsonObject: any = {}
    this.f02002Service.getEmployeeSysTypeCode(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.empList) {
        const codeNo = jsonObj.empNo
        const desc = jsonObj.empNo
        this.agent_empCode.push({ value: codeNo, viewValue: desc })
      }

      for (const jsonObj of data.rspBody.levelTypeList) {
        //日期種類起訖
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.levelStartDateTypeCode.push({ value: codeNo, viewValue: desc })
        this.levelEndDateTypeCode.push({ value: codeNo, viewValue: desc })
      }

      this.assign_stopCode.push({ value: '', viewValue: '請選擇' }) //是否停派//是否在職
      for (const jsonObj of data.rspBody.ynList) {
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.on_jobCode.push({ value: codeNo, viewValue: desc })
        this.assign_stopCode.push({ value: codeNo, viewValue: desc })
      }
      this.empunitlistCode.push({ value: '', viewValue: '請選擇' }) //單位
      for (const jsonObj of data.rspBody['empUnitList']) {
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.empunitlistCode.push({ value: codeNo, viewValue: desc })
      }

      this.empdeptlistCode.push({ value: '', viewValue: '請選擇' }) //部門
      for (const jsonObj of data.rspBody['empDeptList']) {
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.empdeptlistCode.push({ value: codeNo, viewValue: desc })
      }
      this.empRoleSource.data = data.rspBody.roleList //角色Table
    })
  }

  //切換查詢選項
  changeSelect() {
    this.changePage()
    this.getEmployeeList(this.pageIndex, this.pageSize)
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params
    this.pageSize = pageSize
    this.pageIndex = pageIndex
    this.getEmployeeList(pageIndex, pageSize)
  }

  //取得表單資料
  getEmployeeList(pageIndex: number, pageSize: number) {
    const baseUrl = 'f02/f02002action1'
    let jsonObject: any = {}
    jsonObject['empNo'] = this.empNoValue != null ? this.empNoValue : '' //員工編號
    jsonObject['empName'] = this.empNameValue != null ? this.empNameValue : '' //員工姓名
    jsonObject['empId'] = this.empIDValue != null ? this.empIDValue : '' //員工ID
    jsonObject['agentEmp'] = this.agent_empValue != null ? this.agent_empValue : '' //代理人
    jsonObject['email'] = this.emailValue != null ? this.emailValue : '' //email
    jsonObject['onJob'] = this.on_jobValue != null ? this.on_jobValue : '' //是否在職
    jsonObject['assignStop'] = this.assign_stopValue != null ? this.assign_stopValue : '' //是否停派
    jsonObject['leaveStartdateType'] = this.levelStartDateTypeValue != null ? this.levelStartDateTypeValue : '' //請假起日類型
    jsonObject['leaveEnddateType'] = this.levelEndDateTypeValue != null ? this.levelEndDateTypeValue : '' //請假迄日類型
    if (this.levelStartDateString != null && this.levelStartDateString != '') {
      //請假起日
      jsonObject['leaveStartdate'] = this.pipe.transform(new Date(this.levelStartDateString), 'yyyyMMdd')
    }
    if (this.levelEndDateString != null && this.levelEndDateString != '') {
      //請假迄日
      jsonObject['leaveEnddate'] = this.pipe.transform(new Date(this.levelEndDateString), 'yyyyMMdd')
    }
    jsonObject['page'] = pageIndex
    jsonObject['per_page'] = pageSize
    this.f02002Service.getEmployeeList(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size
      this.employeeSource.data = data.rspBody.items
    })
    this.loading = false
  }

  //清除資料
  Clear() {
    this.empNoValue = '' //員工編號
    this.empNameValue = '' //員工姓名
    this.empIDValue = '' //員工ID
    this.agent_empValue = '' //代理人
    this.emailValue = '' //email
    this.on_jobValue = 'Y' //是否在職
    this.assign_stopValue = '' //是否停派
    this.levelStartDateTypeValue = '' //請假起日類型
    this.levelEndDateTypeValue = '' //請假迄日類型
    this.levelStartDateValue = undefined //請假起日
    this.levelStartDateString = '' //請假起日
    this.levelEndDateValue = undefined //請假迄日
    this.levelEndDateString = '' //請假迄日

    this.employeeSource.data = null
  }

  //取得下拉選單中文
  getOptionDesc(option: OptionsCode[], codeVal: string): string {
    for (const data of option) {
      if (data.value == codeVal) {
        return data.viewValue
        break
      }
    }
    return codeVal
  }

  //設定角色
  chkArray: checkBox[] = null
  setRoleNo(empNo: string, roleArray: string) {
    this.chkArray = []
    let selfRole = roleArray != null ? roleArray : ''
    for (const jsonObj of this.empRoleSource.data) {
      let isChk: boolean = false
      const chkValue = jsonObj.roleNo
      for (const str of selfRole.split(',')) {
        isChk = str == chkValue
        if (isChk) {
          break
        }
      }
      this.chkArray.push({ value: chkValue, completed: isChk })
    }

    const dialogRef = this.dialog.open(F02002roleComponent, {
      minHeight: '70vh',
      width: '50%',
      data: { CHECKBOX: this.chkArray, SOURCE: this.empRoleSource.data, empNo: empNo },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) {
        this.refreshTable()
      }
    })
  }

  //新增
  addNew() {
    const dialogRef = this.dialog.open(F02002addComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '70vh',
      width: '50%',
      data: {
        EMP_NO: '', //員工編號
        EMP_NAME: '', //員工姓名
        EMP_ID: '', //員工ID
        ON_JOB: 'Y', //是否在職
        AGENT_EMP: '', //代理人
        EMAIL: '', //email
        ASSIGN_STOP: '', //是否停派
        LEAVE_STARTDATE: '', //請假起日
        LEAVE_STARTDATE_TYPE: '', //請假起日類型
        LEAVE_ENDDATE: '', //請假迄日
        LEAVE_ENDDATE_TYPE: '', //請假迄日類型
        agent_empCode: this.agent_empCode, //代理人
        levelStartDateTypeCode: this.levelStartDateTypeCode, //日期種類起
        levelEndDateTypeCode: this.levelEndDateTypeCode, //日期種類迄
        roleCode: this.roleCode, //角色
        on_jobCode: this.on_jobCode, //是否在職
        assign_stopCode: this.assign_stopCode, //是否停派
        empunitlistCode: this.empunitlistCode, //單位
        empdeptlistCode: this.empdeptlistCode, //部門
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) {
        this.refreshTable()
      }
    })
  }

  //修改
  startEdit(EMP_NO: string, EMP_NAME: string, EMP_ID: string, ON_JOB: string, AGENT_EMP: string, EMAIL: string, LEAVE_STARTDATE: string, LEAVE_ENDDATE: string, LEAVE_STARTDATE_TYPE: string, LEAVE_ENDDATE_TYPE: string, ASSIGN_STOP: string, ASSIGN_PROJECTNO: string) {
    const dialogRef = this.dialog.open(F02002editComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '70vh',
      width: '50%',
      data: {
        EMP_NO: EMP_NO, //員工編號
        EMP_NAME: EMP_NAME, //員工姓名
        EMP_ID: EMP_ID, //員工ID
        ON_JOB: ON_JOB, //是否在職
        AGENT_EMP: AGENT_EMP, //代理人
        EMAIL: EMAIL, //email
        ASSIGN_STOP: ASSIGN_STOP, //是否停派
        LEAVE_STARTDATE: LEAVE_STARTDATE, //請假起日
        LEAVE_STARTDATE_TYPE: LEAVE_STARTDATE_TYPE, //請假起日類型
        LEAVE_ENDDATE: LEAVE_ENDDATE, //請假迄日
        LEAVE_ENDDATE_TYPE: LEAVE_ENDDATE_TYPE, //請假迄日類型
        agent_empCode: this.agent_empCode, //代理人
        levelStartDateTypeCode: this.levelStartDateTypeCode, //日期種類起
        levelEndDateTypeCode: this.levelEndDateTypeCode, //日期種類迄
        roleCode: this.roleCode, //角色
        on_jobCode: this.on_jobCode, //是否在職
        assign_stopCode: this.assign_stopCode, //是否停派
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) {
        this.refreshTable()
      }
    })
  }

  //派件專案代碼
  startPrj(empNo: string, roleArray: string) {
    this.chkArray = []
    let selfRole = roleArray != null ? roleArray : ''
    for (const jsonObj of this.empRoleSource.data) {
      let isChk: boolean = false
      const chkValue = jsonObj.roleNo
      for (const str of selfRole.split(',')) {
        isChk = str == chkValue
        if (isChk) {
          break
        }
      }
      this.chkArray.push({ value: chkValue, completed: isChk })
    }
    const dialogRef = this.dialog.open(F02002prjComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '70vh',
      width: '50%',
      data: { CHECKBOX: this.chkArray, SOURCE: this.empRoleSource.data, empNo: empNo },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) {
        this.refreshTable()
      }
    })
  }
  // 取得資料轉換千分位
  limit2() {

    this.one = this.one.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  }
  //產品及授權額度
  async startAmt(empNo: string) {
    const baseUrl = 'f02/f02002action8'
    let jsonObject: any = {}
    jsonObject['empNo'] = empNo //員工編號
    console.log(empNo)
    await this.f02002Service.getEmployeeList(baseUrl, jsonObject).subscribe(data => {
      console.log(data)
      this.empAmtSource.data = data.rspBody
      this.chkArray = []
      for (const jsonObj of this.empRoleSource.data) {
        let isChk: boolean = false
        const chkValue = jsonObj.roleNo

        this.chkArray.push({ value: chkValue, completed: isChk })
      }
      const dialogRef = this.dialog.open(F02002amtComponent, {
        // panelClass: 'mat-dialog-transparent',
        minHeight: '70vh',
        width: '50%',
        data: { CHECKBOX: this.chkArray, SOURCE: this.empAmtSource.data, empNo: empNo },
      })
    })
  }

  //前端顯示日日期用
  getlevelDateData(StartDate: string, StartDateType: string, EndDate: string, EndDateType: string): string {
    let data = ''
    if (StartDate != null) {
      data = StartDate
    }
    if (StartDate != null && StartDateType != null) {
      data += this.getOptionDesc(this.levelStartDateTypeCode, StartDateType)
    }
    if (EndDate != null && StartDate != null) {
      data += '~'
    }
    if (EndDate != null) {
      data += EndDate
    }
    if (EndDate != null && EndDateType != null) {
      data += this.getOptionDesc(this.levelEndDateTypeCode, EndDateType)
    }
    return data
  }

  //刷新頁面
  private refreshTable() {
    this.getEmployeeList(this.pageIndex, this.pageSize)
  }

  changePage() {
    this.pageIndex = 1
    this.pageSize = 10
    this.total = 1
  }

  async editPassword() {
    if (this.empNoValue == null || this.empNoValue == undefined || this.empNoValue == '') {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入員工編號' }
      });
      return;
    }
    if (this.f03006word == null || this.f03006word == undefined || this.f03006word == '') {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入修改密碼' }
      });
      return;
    }
    let msgStr: string = "";
    let baseUrl = 'f03/f03006action10';
    let jsonObject: any = {};
    jsonObject['empNo'] = this.empNoValue;
    jsonObject['empPassword'] = this.f03006word;
    this.f02002Service.saveReason(baseUrl, jsonObject).then((data: any) => {
      msgStr = data.rspMsg;
      if (data.rspCode == '0000') { this.f03006word = ''; this.empNoValue = ''; }
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
    });
  }
}
