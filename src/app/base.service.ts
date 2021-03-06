import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';
import { CommonRes } from './interface/base';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(protected httpClient: HttpClient) { }

  private async cleanSession(empNo: string, ticket: string): Promise<Observable<any>> {
    const formData = new FormData();
    formData.append("username", empNo);
    formData.append("ticket", ticket != null ? ticket : "");
    const baseURL = 'logOut';
    return await this.postFormData(baseURL, formData).toPromise();
  }

  public async logOutAction(): Promise<boolean> {
    let empNo: string = this.getEmpNO();
    let ticket: string = this.getToken();
    let isOk: boolean = false;
    await this.cleanSession(empNo, ticket).then((data: any) => {
      isOk = (data.rspCode == '0000');
    });
    return isOk;
  }

  public getToken(): string {
    return localStorage.getItem('limitToken');
  }

  public getEmpNO(): string {
    return localStorage.getItem('liEmpNo');
  }

  protected postHttpClient(baseUrl: string) {
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, null);
  }

  protected getHttpClient(baseUrl: string) {
    return this.httpClient.get<any>(environment.allowOrigin + '/' + baseUrl);
  }

  protected postFormData(baseUrl: string, formdata: FormData) {
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, formdata);
  }

  public getSysTypeCode(codeType: string ,baseUrl: string): Observable<any> {
    let targetUrl = `${baseUrl}?codeType=${codeType}`;
    return this.postHttpClient(targetUrl);
  }

  public getLine(url: string){
    return this.postHttpClient(url);
  }

  //================下方是提供新增或編輯用的function========================================

  private async commonFunction(baseUrl: string, formdata: FormData) {
    return await this.postFormData(baseUrl, formdata).toPromise();
  }

  private async getMsgStr(rspCode: string, rspMsg: string): Promise<string> {
    return rspMsg;
  }

  public async sendFormData(baseUrl: string, formdata: FormData): Promise<string> {
    let rspCode: any;
    let rspMsg: any;
    await this.commonFunction(baseUrl, formdata).then((data) => {
      rspCode = data.rspCode;
      rspMsg = data.rspMsg;
    });
    return await this.getMsgStr(rspCode, rspMsg);
  }

   //================下方是提供JSON使用========================================
   protected postJsonObject(baseUrl: string, json: JSON) {
     json['userId'] = this.getEmpNO();
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, json);
  }

  private async saveOrEditWithJson(baseUrl: string, json: JSON) {
    json['userId'] = this.getEmpNO();
    return await this.postJsonObject(baseUrl, json).toPromise();
  }

  public async saveOrEditMsgJson(baseUrl: string, json: JSON): Promise<string> {
    let rspCode: any;
    let rspMsg: any;
    await this.saveOrEditWithJson(baseUrl, json).then((data: CommonRes) => {
      rspCode = data.rspCode;
      rspMsg = data.rspMsg;
    });
    return await this.getMsgStr(rspCode, rspMsg);
  }

  //table分頁處理
  getTableDate(pageIndex: number, pageSize: number, data: any):any {
    let start: number = (pageIndex - 1) * pageSize;
    let count:number = 0;
    let newData = [];
    for (let index = start; index < data.length; index++) {
      newData.push(data[index]);
      count = count + 1;
      if (count == pageSize) {
        break;
      }
    }
    return newData;
  }
}
