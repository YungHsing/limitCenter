import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01001Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  getCaseList(pageIndex: number, pageSize: number, empno: string): Observable<any> {
    const baseUrl = 'f01/f01001';
    let targetUrl = `${baseUrl}?page=${pageIndex + 1}&per_page=${pageSize}&emp_no=${empno}`;
    return this.postHttpClient(targetUrl);
  }
}
