import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OptionsCode } from '../interface/base';
import { F02001Service } from './f02001.service';
import { F02001addComponent } from './f02001add/f02001add.component';
import { F02001editComponent } from './f02001edit/f02001edit.component';

@Component({
  selector: 'app-f02001',
  templateUrl: './f02001.component.html',
  styleUrls: ['./f02001.component.css', '../../assets/css/f02.css']
})
export class F02001Component implements OnInit {

  constructor(
    private f02001Service: F02001Service,
    public dialog: MatDialog
  ) { }

  mappingCodeSource: Data[] = [];
  total = 1;
  pageIndex = 1;
  pageSize = 50;
  sysCode: OptionsCode[] = [];
  selectedValue: string;

  newData: any[] = [];

  ngOnInit(): void {
    const baseUrl = 'f02/f02001';
    let jsonObject: any = {};
    this.f02001Service.getMappingCodeList(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        let exist: boolean = false;
        for (let index = 0; index < this.sysCode.length; index++) {
          if (this.sysCode[index].value == jsonObj['codeType']) {
            exist = true;
          }
        }

        if (!exist) {
          if (this.sysCode.indexOf({ value: jsonObj['codeType'], viewValue: jsonObj['codeType'] }) == -1) {
            const codeNo = jsonObj['codeType'];
            const codeType = jsonObj['codeType'];
            this.sysCode.push({ value: codeNo, viewValue: codeType })
          }
        }
      }
    });
  }

  changeSort(sortInfo: Sort) {
    this.getMappingCode(this.pageIndex, this.pageSize);
  }

  getMappingCode(pageIndex: number, pageSize: number) {
    const baseUrl = 'f02/f02001action1';
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    jsonObject['codeType'] = this.selectedValue;
    this.f02001Service.getMappingCodeList(baseUrl, jsonObject)
      .subscribe(data => {
        if (data.rspBody != null) {
          this.total = data.rspBody.size;
          this.mappingCodeSource = data.rspBody.items;
          this.newData = this.f02001Service.getTableDate(pageIndex, pageSize, this.mappingCodeSource);
        }
      });
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  changeSelect() {
    this.changePage();
    this.getMappingCode(this.pageIndex, this.pageSize);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.mappingCodeSource);
  }

  addNew() {
    if (this.selectedValue == null || this.selectedValue == '') {
      alert('請選擇：代碼類別');
    } else {
      const dialogRef = this.dialog.open(F02001addComponent, {
        minHeight: '70vh',
        width: '50%',
        panelClass: 'mat-dialog-transparent',
        data: {
          codeType: this.selectedValue,
          codeNo: '', codeDesc: '',
          codeSort: '', codeTag: '',
          codeFlag: 'N'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.changePage();
          this.getMappingCode(this.pageIndex, this.pageSize);
        }
      });
    }
  }

  startEdit(
    codeType: string, codeNo: string, codeDesc: string,
    codeSort: string, codeTag: string, codeFlag: string) {
    const dialogRef = this.dialog.open(F02001editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        codeType: codeType, codeNo: codeNo, codeDesc: codeDesc,
        codeSort: codeSort, codeTag: codeTag, codeFlag: codeFlag
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.changePage();
        this.getMappingCode(this.pageIndex, this.pageSize);
      }
    });
  }

  Clear() {
    this.selectedValue = "";
    this.mappingCodeSource = null;
  }
}
