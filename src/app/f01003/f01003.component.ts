import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { F01003Service } from './f01003.service';
import { F01003addComponent } from './f01003add/f01003add.component';
import { F01003confirmComponent } from './f01003confirm/f01003confirm.component';
import { F01003scn0Component } from './f01003scn0/f01003scn0.component';

@Component({
  selector: 'app-f01003',
  templateUrl: './f01003.component.html',
  styleUrls: ['./f01003.component.css', '../../assets/css/child.css']
})
export class F01003Component implements OnInit, AfterViewInit {

  constructor(private router: Router, private f01003Service: F01003Service, public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) {

  }

  limitSearchForm: FormGroup = this.fb.group({
    CUSTOMER_ID: ['', [Validators.maxLength(30)]],
    NATIONAL_ID: ['', [Validators.maxLength(30)]],
    LIMIT_START_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_END_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  submitted = false;
  totalCount: any;
  limitDataSource: Data[] = [];
  isReadOnly = false;
  isDisabled = true;
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  async getViewDataList(): Promise<void> {
    var formData = new FormData();
    let jsonStr = JSON.stringify(this.limitSearchForm.value);
    let jsonObj = JSON.parse(jsonStr);

    if (this.limitSearchForm.value.LIMIT_START_DATE != '') {
      let startDate = new Date(this.limitSearchForm.value.LIMIT_START_DATE);
      // let endDate = new Date(this.limitSearchForm.value.LIMIT_END_DATE);
      jsonObj.LIMIT_START_DATE = this.datePipe.transform(startDate, "yyyy/MM/dd");
      // jsonObj.LIMIT_END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");
    } for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

    let baseUrl = 'f01/f01003level2query';
    await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      this.totalCount = data.rspBody.size;
      this.limitDataSource = data.rspBody.items;
      this.isReadOnly = true;

      if (this.limitDataSource.length > 0) { this.limitSearchForm.patchValue({ NATIONAL_ID: data.rspBody.items.NATIONAL_ID }); }
      // TODO 待取得後端ＮＩＤ
      // if (this.limitDataSource.length > 0) { this.limitSearchForm.patchValue({ NATIONAL_ID: 'A222222222' }); }
      // if (this.limitDataSource.length == 0) { this.limitSearchForm.patchValue({ NATIONAL_ID: 'A111111111' }); }
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.limitSearchForm.value.CUSTOMER_ID == '') {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: 'CID必填!', display: true } });
      return false;
    } else {
      await this.getViewDataList();
      let msgStr: string = this.limitDataSource.length == 0 ? '查無資料!' : '查詢成功!';
      this.dialog.open(F01003confirmComponent, { data: { msgStr: msgStr, display: true } });
      if (this.limitDataSource.length == 0) { this.isDisabled = false; }
    }
  }

  cleanToEmpty() {
    this.limitSearchForm.patchValue({ CUSTOMER_ID: '' });
    this.limitSearchForm.patchValue({ NATIONAL_ID: '' });
    this.limitSearchForm.patchValue({ LIMIT_START_DATE: '' });
    this.limitSearchForm.patchValue({ LIMIT_END_DATE: '' });
    this.totalCount = 0;
    this.limitDataSource = null;
    this.isReadOnly = false;
    this.isDisabled = true;
  }

  setTimes() {
    if (this.limitSearchForm.value.LIMIT_END_DATE == null) {
      this.limitSearchForm.patchValue({ LIMIT_END_DATE: this.limitSearchForm.value.LIMIT_START_DATE });
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
    if (this.limitSearchForm.value.CUSTOMER_ID == '') {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: 'CID必填!', display: true } });
      return false;
    } else {
      const dialogRef = this.dialog.open(F01003addComponent, {
        data: {
          CUSTOMER_ID: this.limitSearchForm.value.CUSTOMER_ID,
          NATIONAL_ID: this.limitSearchForm.value.NATIONAL_ID
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.refreshTable();
          this.isDisabled = true;
        }
      });
    }
  }

  private refreshTable() {
    this.getViewDataList();
  }

  async getContent(cid: string, limitNum: string, startDate: string) {
    let nid = this.limitSearchForm.value.NATIONAL_ID;
    this.router.navigate(['./F01003SCN0'], { queryParams: { NATIONAL_ID: nid, CUSTOMER_ID: cid, CREDIT_LIMIT: limitNum, LIMIT_START_DATE: startDate } });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }
  toCurrency(amount: any) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
