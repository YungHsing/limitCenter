import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { F01003Service } from './f01003.service';
import { F01003addComponent } from './f01003add/f01003add.component';
import { F01003confirmComponent } from './f01003confirm/f01003confirm.component';
import { F01003scn0Component } from './f01003scn0/f01003scn0.component';

@Component({
  selector: 'app-f01003',
  templateUrl: './f01003.component.html',
  styleUrls: ['./f01003.component.css', '../../assets/css/f01.css']
})
export class F01003Component implements OnInit, AfterViewInit {

  constructor(private router: Router, private f01003Service: F01003Service, public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe) { }

  limitSearchForm: FormGroup = this.fb.group({
    CUSTOMER_ID: ['', [Validators.maxLength(30)]],
    NATIONAL_ID: ['', [Validators.maxLength(30)]],
    LIMIT_START_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_END_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    pageIndex: ['', [Validators.maxLength(3)]],
    pageSize: ['', [Validators.maxLength(3)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  submitted = false;
  totalCount: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  currentPage: PageEvent;
  currentSort: Sort;
  limitDataSource = new MatTableDataSource<any>();
  isReadOnly = false;
  isDisabled = true;

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.currentPage = {
      pageIndex: 0,
      pageSize: 5,
      length: null
    };
    this.currentSort = {
      active: '',
      direction: ''
    };
  }

  async getViewDataList(): Promise<void> {
    var formData = new FormData();
    let jsonStr = JSON.stringify(this.limitSearchForm.value);
    let jsonObj = JSON.parse(jsonStr);

    if (this.limitSearchForm.value.LIMIT_START_DATE != '' && this.limitSearchForm.value.LIMIT_END_DATE != '') {
      let startDate = new Date(this.limitSearchForm.value.LIMIT_START_DATE);
      let endDate = new Date(this.limitSearchForm.value.LIMIT_END_DATE);
      jsonObj.LIMIT_START_DATE = this.datePipe.transform(startDate, "yyyy/MM/dd");
      jsonObj.LIMIT_END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");
    } for (var key in jsonObj ) { formData.append(key, jsonObj[key]); }

    let baseUrl = 'f01/f01003level2query';
    await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      this.totalCount = data.rspBody.size;
      this.limitDataSource.data = data.rspBody.items;
      this.isReadOnly = true;
      
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.limitSearchForm.value.CUSTOMER_ID == '') {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: 'CID必填!', display: true } });
      return false;
    } else {
      await this.getViewDataList();
      let msgStr: string = this.limitDataSource.data.length == 0 ? '查無資料!' : '查詢成功!';
      this.dialog.open(F01003confirmComponent, { data: { msgStr: msgStr, display: true } });
      if(this.limitDataSource.data.length == 0) {this.isDisabled = false; }
    }
  }

  cleanToEmpty() {
    this.limitSearchForm.patchValue({ CUSTOMER_ID: '' });
    this.limitSearchForm.patchValue({ NATIONAL_ID: '' });
    this.limitSearchForm.patchValue({ LIMIT_START_DATE: '' });
    this.limitSearchForm.patchValue({ LIMIT_END_DATE: '' });
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null
    };
    this.totalCount = 0;
    this.limitDataSource.data = null;
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
    this.currentSort = sortInfo;
    this.getViewDataList();
  }

  addNew() {
    if (this.limitSearchForm.value.CUSTOMER_ID == '') {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: 'CID必填!', display: true } });
      return false;
    } else {
      const dialogRef = this.dialog.open(F01003addComponent, {
        data: {
          CUSTOMER_ID : this.limitSearchForm.value.CUSTOMER_ID
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') { this.refreshTable(); }
      });
    }
  }

  private refreshTable() {
    this.getViewDataList();
  }

  async getContent(nid: string, cid: string, limitNum: string, startDate: string) {
    this.router.navigate(['./F01003SCN0'], { queryParams: { NATIONAL_ID: nid, CUSTOMER_ID: cid, CREDIT_LIMIT: limitNum, LIMIT_START_DATE: startDate } });
  }

  checkButton(statusFlag: string) {
    return statusFlag === 'N'? true : false;
  }

}
