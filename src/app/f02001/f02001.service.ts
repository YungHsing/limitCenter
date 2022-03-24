import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02001Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  dialogData: any;

  getMappingCodeList(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  addOrEditSystemCodeSet(baseUrl: string, data: any): any {
    let jsonObeject: any = {};
    jsonObeject['codeType'] = data.codeType;
    jsonObeject['codeNo'] = data.codeNo;
    jsonObeject['codeDesc'] = data.codeDesc;
    jsonObeject['codeSort'] = data.codeSort;
    jsonObeject['codeTag'] = data.codeTag;
    jsonObeject['codeFlag'] = data.codeFlag;
    return this.saveOrEditMsgJson(baseUrl, jsonObeject);
  }

}
