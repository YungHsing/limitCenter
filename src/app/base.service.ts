import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

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

  protected formDataApiFor_NET(baseUrl: string, formdata: FormData) {
    return this.httpClient.post<any>(baseUrl, formdata);
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
    })
    .catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
    return await this.getMsgStr(rspCode, rspMsg);
  }
}
