import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { map } from 'rxjs/operators';
import { Employee } from '../interface/base';

@Injectable({
  providedIn: 'root'
})
export class F02002Service extends BaseService {
  constructor(protected httpClient: HttpClient, private pipe: DatePipe) { super(httpClient); }
  dialogData: any;

  //取得Table
  getEmployeeList(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  //取得初始下拉選單及角色資訊
  getEmployeeSysTypeCode(baseUrl: string, json: JSON): Observable<Employee> {
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, json).pipe(map(res => res));
  }

  //儲存密碼
  public async saveReason(baseUrl: string, json: JSON): Promise<Observable<any>> {
    return await this.postJsonObject(baseUrl, json).toPromise();
  }

  //新增修改
  addorEditSystemCodeSet(baseUrl: string, data: any): any {
    let jsonObject: any = {};
    jsonObject['empNo'] = data.EMP_NO;//員工編號
    jsonObject['empName'] = data.EMP_NAME;//員工姓名
    jsonObject['empId'] = data.EMP_ID;//員工ID
    jsonObject['agentEmp'] = data.AGENT_EMP;//代理人
    jsonObject['email'] = data.EMAIL;//email
    jsonObject['onJob'] = data.ON_JOB;//是否在職
    jsonObject['assignStop'] = data.ASSIGN_STOP;//是否停派
    if (data.LEAVE_STARTDATE != null && data.LEAVE_STARTDATE != "") {
      jsonObject['leaveStartdateType'] = data.LEAVE_STARTDATE_TYPE//請假起日類型
      jsonObject['leaveStartdate'] = this.pipe.transform(new Date(data.LEAVE_STARTDATE), 'yyyyMMdd');//請假起日
    } else {
      jsonObject['leaveStartdateType'] = null;
      jsonObject['leaveStartdate'] = null;
    }
    if (data.LEAVE_ENDDATE != null && data.LEAVE_ENDDATE_TYPE != "") {
      jsonObject['leaveEnddateType'] = data.LEAVE_ENDDATE_TYPE;//請假迄日類型
      jsonObject['leaveEnddate'] = this.pipe.transform(new Date(data.LEAVE_ENDDATE), 'yyyyMMdd');//請假迄日
    } else {
      jsonObject['leaveEnddateType'] = null;
      jsonObject['leaveEnddate'] = null;
    }
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }

  //角色設定
  saveEmployeeRole(baseUrl: string, array: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, array);
  }
}
