import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01002Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  getSTEP_ERROROption(baseUrl: string): Observable<any> {
    return this.postHttpClient(baseUrl);
  }

  test(baseUrl: string, roleNo: String): Observable<any> {
    let targetUrl = `${baseUrl}?roleNo=${roleNo}`;
    return this.postHttpClient(targetUrl);
  }
  getSTEP_ERRORFunction(baseUrl: string, step: String,page: number,per_page: number): Observable<any> {
    let targetUrl = `${baseUrl}?step=${step}&page=${page}&per_page=${per_page}`;
    return this.postHttpClient(targetUrl);
  }

  newSearch_Decline_STEP_ERRORFunction(baseUrl: string,step: string, formData: string[], result: string): Observable<any> {
    let targetUrl = `${baseUrl}?&step=${step}&applno=${formData}&result=${result}`;
    return this.postHttpClient(targetUrl);
  }




}
