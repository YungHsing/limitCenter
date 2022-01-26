import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { F01003Service } from '../f01003.service';
import { F01003confirmComponent } from '../f01003confirm/f01003confirm.component';
import { F01003scn3wopenComponent } from './f01003scn3wopen/f01003scn3wopen.component';

//下拉選單框架
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01003scn3',
  templateUrl: './f01003scn3.component.html',
  styleUrls: ['./f01003scn3.component.css', '../../../assets/css/child.css']
})
export class F01003scn3Component implements OnInit {

  constructor(private route: ActivatedRoute, public f01003Service: F01003Service, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, private datePipe: DatePipe, public dialog: MatDialog) { }

  //凍結&解凍
  frozenForm: FormGroup = this.fb.group({
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    ACTION_TYPE: [this.data.actionType, [Validators.maxLength(5)]],
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
  limitNoOption: sysCode[] = [];  //額度號下拉選單
  limitNoSelectedValue: string; //額度號
  actionTypeOption: sysCode[] = []; //選擇功能下拉選單
  actionTypeSelectedValue: string; //功能

  submitted = false;
  totalCount: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  currentPage: PageEvent;
  currentSort: Sort;
  frozenDataSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.NATIONAL_ID = params['NATIONAL_ID'];
      this.CUSTOMER_ID = params['CUSTOMER_ID'];
    });

    let formData: FormData = new FormData();
    formData.append('CUSTOMER_ID', this.CUSTOMER_ID);
    formData.append('NATIONAL_ID', this.NATIONAL_ID);
    let baseUrl = 'f01/f01003FrozenOption';
    this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      console.log(data.rspBody)
      for (const jsonObj of data.rspBody.actionTypeList) {
        const codeNo = jsonObj['codeNo'];
        const codeDesc = jsonObj['codeDesc'];
        this.actionTypeOption.push({ value: codeNo, viewValue: codeDesc })
      }
    });
    this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      for (const jsonObj of data.rspBody.limitNoOption) {
        const limitNo = jsonObj['limitNo'];
        this.limitNoOption.push({ value: limitNo, viewValue: limitNo })
      }
    });
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

  async onSubmit() {
    this.submitted = true;
    if (this.frozenForm.value.LIMIT_NO == undefined) {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: '請選擇額度號', display: true } });
      return false;
    } else {
      let formData = new FormData();
      let jsonStr = JSON.stringify(this.frozenForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003FrozenSearch';
      await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
        this.totalCount = data.rspBody.size;
        this.frozenDataSource = data.rspBody.items;
      });

      let msgStr: string = this.frozenDataSource.length == 0 ? '查無資料!' : '查詢成功!';
      this.dialog.open(F01003confirmComponent, { data: { msgStr: msgStr, display: true } });
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  frozen(frozen: boolean) {
    if (this.frozenForm.value.LIMIT_NO == undefined) {
      this.dialog.open(F01003confirmComponent, { data: { msgStr: '請選擇額度號', display: true } });
      return false;
    } else {
      const dialogRef = this.dialog.open(F01003scn3wopenComponent, {
        panelClass:'mat-dialog-transparent',
        minHeight:'80%',
        width:'40%',
        data: {
          isFrozen: frozen,
          limitNo: this.frozenForm.value.LIMIT_NO,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') { this.refreshTable(); }
      });
    }

  }

  changeSort(sortInfo: Sort) {
    this.currentSort = sortInfo;
  }

  private async refreshTable() {
    let formData = new FormData();
      let jsonStr = JSON.stringify(this.frozenForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003FrozenSearch';
      await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
        this.totalCount = data.rspBody.size;
        this.frozenDataSource = data.rspBody.items;
      });
  }

  getOptionDesc(codeVal: string): string {
    for (const data of this.actionTypeOption) {
      if (data.value == codeVal) {
        return data.viewValue;
      }
    }
    return codeVal;
  }

  // getDesc(codeVal: string): string {
  //   console.log(codeVal);
  //   let formData: FormData = new FormData();
  //   formData.append("ACTION_TYPE", '4');

  //   let baseUrl = 'f01/f01003FrozenNoOption';
  //     this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
  //       console.log("test" +data.rspBody.frozenNoOption)
  //       // for (const jsonObj of data.rspBody.frozenNoOption) {
  //       //   const frozenNo = jsonObj['codeNo'];
  //       //   const frozenDesc = jsonObj['codeDesc'];
  //       //   if (frozenNo == codeVal) {
  //       //     return data.viewValue;
  //       //     break;
  //       //   }
  //       // }
  //     });
  //     return codeVal;
  // }
}
