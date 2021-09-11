import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { F01003Service } from '../f01003.service';
import { F01003confirmComponent } from '../f01003confirm/f01003confirm.component';

//下拉選單框架
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01003scn4',
  templateUrl: './f01003scn4.component.html',
  styleUrls: ['./f01003scn4.component.css']
})
export class F01003scn4Component implements OnInit {

  constructor(private route: ActivatedRoute, public f01003Service: F01003Service, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private datePipe: DatePipe, public dialog: MatDialog) { }

  //額度欄位修改明細
  manageRecordForm: FormGroup = this.fb.group({
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    START_DATE: [this.data.startDate, [Validators.maxLength(5)]],
    END_DATE: [this.data.endDate, [Validators.maxLength(5)]],
    pageIndex: ['', [Validators.maxLength(3)]],
    pageSize: ['', [Validators.maxLength(3)]],
    EMPNO: [localStorage.getItem("empNo"), [Validators.maxLength(11)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  sysCode: sysCode[] = [];
  selectedValue: string;
  NATIONAL_ID: string;  //客戶編號
  CUSTOMER_ID: string;  //身分證字號
  CREDIT_LIMIT: string; //額度

  limitNoOption: sysCode[] = [];  //額度號下拉選單
  limitNoSelectedValue: string; //額度號
  actionTypeOption: sysCode[] = []; //選擇功能下拉選單
  actionTypeSelectedValue: string; //功能

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.NATIONAL_ID = params['NATIONAL_ID'];
      this.CUSTOMER_ID = params['CUSTOMER_ID'];
      this.CREDIT_LIMIT = params['CREDIT_LIMIT'];
      // this.START_DATE = this.datePipe.transform(params['START_DATE'], "yyyy/MM/dd");
      // this.END_DATE = this.datePipe.transform(params['END_DATE'], "yyyy/MM/dd");
    });
    let formData: FormData = new FormData();
    formData.append('CUSTOMER_ID', this.CUSTOMER_ID);
    formData.append('NATIONAL_ID', this.NATIONAL_ID);
    let baseUrl = 'f01/f01003FrozenOption';
    this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      console.log(data.rspBody)
      for (const jsonObj of data.rspBody.limitNoOption) {
        const limitNo = jsonObj['limitNo'];
        this.limitNoOption.push({ value: limitNo, viewValue: limitNo })
      }
    });
  }

  submitted = false;
  totalCount: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  currentPage: PageEvent;
  currentSort: Sort;
  manageRecordDataSource = new MatTableDataSource<any>();

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

  async onSubmit() {
    this.submitted = true;
    if (this.manageRecordForm.value.LIMIT_NO == undefined && (this.manageRecordForm.value.START_DATE == null || this.manageRecordForm.value.END_DATE == null)) {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: '請選擇額度號或異動時間起迄日', display: true } });
      return false;
    } else {
      let formData = new FormData();
      let jsonStr = JSON.stringify(this.manageRecordForm.value);
      let jsonObj = JSON.parse(jsonStr);
      let startDate = new Date(this.manageRecordForm.value.START_DATE);
      let endDate = new Date(this.manageRecordForm.value.END_DATE);
      jsonObj.START_DATE = this.datePipe.transform(startDate, "yyyy/MM/dd");
      jsonObj.END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003RecordSearch';
      await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
        this.totalCount = data.rspBody.size;
        this.manageRecordDataSource.data = data.rspBody.items;
      });

      let msgStr: string = this.manageRecordDataSource.data.length == 0 ? '查無資料!' : '查詢成功!';
      this.dialog.open(F01003confirmComponent, { data: { msgStr: msgStr, display: true } });
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  changeSort(sortInfo: Sort) {
    this.currentSort = sortInfo;
  }

  private async refreshTable() {
    let formData = new FormData();
    let jsonStr = JSON.stringify(this.manageRecordForm.value);
    let jsonObj = JSON.parse(jsonStr);
    for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

    let baseUrl = 'f01/f01003FrozenSearch';
    await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      this.totalCount = data.rspBody.size;
      this.manageRecordDataSource.data = data.rspBody.items;
    });
  }

}
