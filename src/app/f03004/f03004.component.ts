import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { F03004addComponent } from './f03004add/f03004add.component';
import { F03004editComponent } from './f03004edit/f03004edit.component';
import { F03004Service } from './f03004.service';
import { Data } from '@angular/router';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f03004',
  templateUrl: './f03004.component.html',
  styleUrls: ['./f03004.component.css', '../../assets/css/child.css']
})
export class F03004Component implements OnInit, AfterViewInit  {
  sysCode: sysCode[] = [];
  selectedValue: string;
  constructor(private f03004Service: F03004Service, public dialog: MatDialog) { }
  ngOnInit(): void {
    const baseUrl = 'f03/f03004';
    this.f03004Service.getSysTypeCode(baseUrl).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.sysCode.push({value: codeNo, viewValue: desc})
      }
    });
  }
//============================================================
  totalCount: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  currentPage: PageEvent;
  currentSort: Sort;
  mappingCodeSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;

  ngAfterViewInit() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page;
      this.getMappingCode();
    });
  }

  changeSort(sortInfo: Sort) {
    this.currentSort = sortInfo;
    this.getMappingCode();
  }

  getMappingCode() {
    const baseUrl = 'f03/f03004action1';
    this.f03004Service.getMappingCodeList(baseUrl, this.currentPage.pageIndex, this.currentPage.pageSize, this.selectedValue)
    .subscribe(data => {
      this.totalCount = data.rspBody.size;
      this.mappingCodeSource = data.rspBody.items;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // this.mappingCodeSource.filter = filterValue.trim().toLowerCase();
  }

  changeSelect() {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    };
    this.paginator.firstPage();
    this.getMappingCode();
  }

  addNew() {
    if (this.selectedValue == null) {
      alert('請選擇：代碼類別');
    } else {
      const dialogRef = this.dialog.open(F03004addComponent, {
        data: {
                codeType: this.selectedValue,
                codeNo : '' , codeDesc: '',
                codeSort: '', codeTag: '',
                codeFlag: 'N'
              }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') { this.refreshTable(); }
      });
    }
  }

  startEdit(i: number,
    codeType: string, codeNo: string, codeDesc: string,
    codeSort: string, codeTag: string, codeFlag: string) {
      const dialogRef = this.dialog.open(F03004editComponent, {
        data: {
          codeType: codeType, codeNo : codeNo , codeDesc: codeDesc,
          codeSort: codeSort, codeTag: codeTag, codeFlag: codeFlag
              }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') { this.refreshTable(); }
      });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

}
