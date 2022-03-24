import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02003Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  roleFunction(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
}
