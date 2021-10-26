import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Menu } from './menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuListService extends BaseService {
  private empNo: String = '';
  private menuList: Menu[] = [];

  constructor (protected httpClient: HttpClient, private route: ActivatedRoute){
    super(httpClient);
    this.addMenu();
  }

  public getMenuData(): Observable<any> {
    this.route.queryParams.subscribe(params => {
      this.empNo = params['empNo'];
    });
    const baseURL = 'MenuListForLineBank?strEmpID=' + this.empNo;
    return this.postHttpClient(baseURL);
  }

  addMenu(): void {
    this.getMenuData().subscribe(data => {
      for (const jsonObj of data.rspBody) {
        const title = jsonObj['title'];                // 功能主標題
        const dataMap = jsonObj['dataMap'];
        const icon = jsonObj['icon'];
        const keyArray = Object.keys(dataMap);         // 功能子標題
        const menuMap = new Map<string, string>();
        for (const menu of keyArray) {
          const path = dataMap[menu];                  // 功能/URL
          menuMap.set(menu, path);
        }
        this.menuList.push(new Menu(title.toString(), menuMap, icon));
      }
    });
  }

  getMap(): Menu[] {
    return this.menuList;
  }

}
