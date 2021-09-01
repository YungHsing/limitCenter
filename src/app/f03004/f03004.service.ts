import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F03004Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  dialogData: any;

  getSysTypeCode(baseUrl: string): Observable<any> {
    return this.postHttpClient(baseUrl);
  }

  getMappingCodeList(baseUrl: string, pageIndex: number, pageSize: number, sysType: String): Observable<any> {
    let targetUrl = `${baseUrl}?page=${pageIndex + 1}&per_page=${pageSize}&CODE_TYPE=${sysType}`;
    return this.postHttpClient(targetUrl);
  }

  addOrEditSystemCodeSet(baseUrl: string, data: any): any {
    const formdata: FormData = new FormData();
    formdata.append('codeType', data.codeType);
    formdata.append('codeNo', data.codeNo);
    formdata.append('codeDesc', data.codeDesc);
    formdata.append('codeSort', data.codeSort);
    formdata.append('codeTag', data.codeTag);
    formdata.append('codeFlag', data.codeFlag);
    return this.sendFormData(baseUrl, formdata);
  }

}
