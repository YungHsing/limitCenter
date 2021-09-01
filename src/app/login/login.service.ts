import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

interface sysCode {
  value: string;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {
  RuleCode: sysCode[] = null;
  Condition: sysCode[] = null;
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  private async checkEmpNoPromise(empNo: string, empPwd: string): Promise<Observable<any>> {
    const formData = new FormData();
    formData.append("username", empNo);
    formData.append("password", empPwd);
    const baseURL = 'login';
    return await this.postFormData(baseURL,formData).toPromise();
  }

  public async initData(empNo: string, empPwd: string): Promise<boolean> {
    let isOk: boolean = false;
    let tokenStr: string = '';
    await this.checkEmpNoPromise(empNo, empPwd).then((data: any) => {
      if (data.rspCode == '0000') { tokenStr = data.rspBody.token; }
      isOk = data.rspCode == '0000';
    });
    localStorage.setItem("token", tokenStr);
    return isOk;
  }

  private async getRuleCodeOption(value: string): Promise<Observable<any>> {
    let formData = new FormData();
    formData.append('value', value);
    const baseUrl = 'http://192.168.0.62:9082/RuleCode/GetRuleCode';
    return await this.formDataApiFor_NET(baseUrl, formData).toPromise();
  }

  public async getRuleCode(value: string): Promise<sysCode[]> {
    this.RuleCode = [];
    await this.getRuleCodeOption(value).then((data: any) => {
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.RuleCode.push({value: codeNo, viewValue: desc});
      }
    });
    return this.RuleCode;
  }

  private async getConditionOption(): Promise<Observable<any>> {
    let formData = new FormData();
    const baseUrl = 'http://192.168.0.62:9082/RuleParamCondition/GetCondition';
    return await this.formDataApiFor_NET(baseUrl, formData).toPromise();
  }

  public async getCondition(): Promise<sysCode[]> {
    this.Condition = [];
    await this.getConditionOption().then((data: any) => {
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj['conditionId'];
        const desc = jsonObj['conditionName'];
        this.Condition.push({value: codeNo, viewValue: desc});
      }
    });
    return this.Condition;
  }
}
