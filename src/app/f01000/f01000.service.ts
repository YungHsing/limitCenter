import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01000Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient);}

  async getLimitDataList(baseUrl: string, formData: FormData) {
    return await this.postFormData(baseUrl, formData).toPromise();
  }
}
