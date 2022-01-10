import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AfterViewInit } from '@angular/core';
import { F01001Service } from './f01001.service';
import { MatDialog } from '@angular/material/dialog';
import { F01001addComponent } from './f01001add/f01001add.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { F01001confirmComponent } from './f01001confirm/f01001confirm.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Data } from '@angular/router';

interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01001',
  templateUrl: './f01001.component.html',
  styleUrls: ['./f01001.component.css', '../../assets/css/child.css']
})
export class F01001Component implements OnInit, AfterViewInit {

  constructor(private f01001Service: F01001Service, public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) { }

  registrationForm: FormGroup = this.fb.group({
    cid: ['', [Validators.maxLength(30)]],
    nid: ['', [Validators.maxLength(30)]],
    createdate_start: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    createdate_end: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    pageIndex: ['', [Validators.maxLength(3)]],
    pageSize: ['', [Validators.maxLength(3)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  submitted = false;
  totalCount: any;
  // @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  // @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  // currentPage: PageEvent;
  // currentSort: Sort;
  limitDataSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;


  elements: any = [
    {LIMIT_NO: 'P2000000001', NATIONAL_ID: 'A123456789', CUSTOMER_ID: 'A123456789', LIMIT_TYPE_CODE: 'P0001000000', STOP_FLAG: 'N', CREDIT_LIMIT: '3,000,000', LIMIT_START_DATE: '2021/08/24', LIMIT_END_DATE: '2031/08/24'},
    {LIMIT_NO: 'P2000000002', NATIONAL_ID: 'A123456789', CUSTOMER_ID: 'A123456789', LIMIT_TYPE_CODE: 'P0001020000', STOP_FLAG: 'N', CREDIT_LIMIT: '2,000,000', LIMIT_START_DATE: '2021/08/24', LIMIT_END_DATE: '2031/08/24'},
    {LIMIT_NO: 'P2000000003', NATIONAL_ID: 'A123456789', CUSTOMER_ID: 'A123456789', LIMIT_TYPE_CODE: 'P0001020200', STOP_FLAG: 'N', CREDIT_LIMIT: '1,000,000', LIMIT_START_DATE: '2021/08/24', LIMIT_END_DATE: '2031/08/24'},
  ];

  ngOnInit(): void {
    this.totalCount = 3;
    this.limitDataSource = this.elements;
  }

  ngAfterViewInit(): void {
    // this.currentPage = {
    //   pageIndex: 0,
    //   pageSize: 5,
    //   length: null
    // };
    // this.currentSort = {
    //   active: '',
    //   direction: ''
    // };
    // this.paginator.page.subscribe((page: PageEvent) => {
    //   this.currentPage = page;
    //   this.getViewDataList();
    // });
  }

  getViewDataList() {

  }

  onSubmit() {
    this.submitted = true;
    if (this.registrationForm.value.dn == '' &&
    this.registrationForm.value.name == '' &&
    this.registrationForm.value.ban == '' &&
    this.registrationForm.value.owner == '' &&
    this.registrationForm.value.createdate_start == '') {
      this.dialog.open(F01001confirmComponent, { data: { msgStr: '請選擇一項查詢!' } });
      return false;
    } else {
      // this.currentPage = {
      //   pageIndex: 0,
      //   pageSize: 5,
      //   length: null
      // };
      // this.paginator.firstPage();
      this.getViewDataList();
    }
  }

  cleanToEmpty() {
    this.registrationForm.patchValue({ dn: '' });
    this.registrationForm.patchValue({ name: '' });
    this.registrationForm.patchValue({ createdate_start: '' });
    this.registrationForm.patchValue({ createdate_end: '' });
    this.registrationForm.patchValue({ ban: '' });
    this.registrationForm.patchValue({ owner: '' });
    // this.currentPage = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: null
    // };
    this.totalCount = 0;
    // this.paginator.firstPage();
    this.limitDataSource = null;
  }

  setTimes() {
    if (this.registrationForm.value.createdate_end == null) {
      this.registrationForm.patchValue({ createdate_end: this.registrationForm.value.createdate_start });
      //this.testForm.setValue({endTime:this.testForm.value.startTime});
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      '';
  }

  changeSort(sortInfo: Sort) {
    // this.currentSort = sortInfo;
    this.getViewDataList();
  }

  addNew() {
    const dialogRef = this.dialog.open(F01001addComponent, {
      data: {
        NATIONAL_ID: this.registrationForm.value.nid,
        CUSTOMER_ID : this.registrationForm.value.cid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    });
  }

  private refreshTable() {

  }

  toCurrency(amount: any) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  getContent(nid: string, cid: string) {

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    // this.selectBlockList(this.pageIndex, this.pageSize);
  }
}
