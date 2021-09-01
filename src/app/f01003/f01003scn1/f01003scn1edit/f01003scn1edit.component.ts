import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01003Service } from '../../f01003.service';
import { F01003confirmComponent } from '../../f01003confirm/f01003confirm.component';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './f01003scn1edit.component.html',
  styleUrls: ['./f01003scn1edit.component.css']
})
export class F01003scn1editComponent implements OnInit, AfterViewInit {

  ynCode: sysCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  limitTypeOption: sysCode[] =  [{value: 'P0001000000', viewValue: '個人限額'}];
  CurrencyOption: sysCode[] =  [{value: 'TWN', viewValue: '台幣'}];
  stopDateValue: Date;
  enableDateValue: Date = new Date();
  constructor(public dialogRef: MatDialogRef<F01003scn1editComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public f01003Service: F01003Service, public dialog: MatDialog, private datePipe: DatePipe) { }

  addForm: FormGroup = this.fb.group({
    LEVEL_NO: [this.data.levelNo, [Validators.maxLength(1)]],
    UP_LEVEL: [this.data.upLevel, [Validators.maxLength(9)]],
    CUSTOMER_ID: [this.data.customerId, [Validators.maxLength(30)]],
    NATIONAL_ID: [this.data.nationalId, [Validators.maxLength(30)]],
    CREDIT_LIMIT: [this.data.creditLimit, [Validators.maxLength(10)]],
    CURRENCY_TYPE: [{value: this.data.currencyType, disabled: true}, [Validators.maxLength(3)]],
    STOP_FLAG: [this.data.stopFlag, [Validators.maxLength(1)]],
    CANCEL_FLAG: [this.data.cancelFlag, [Validators.maxLength(1)]],
    ENABLE_FLAG: [this.data.enableFlag, [Validators.maxLength(1)]],
    CYCLE_TYPE: [this.data.cycleType, [Validators.maxLength(1)]],
    STOP_DATE: [ {value: this.data.stopDate, disabled: true}, [Validators.maxLength(10), Validators.minLength(10)]],
    PROJECT_CODE: [ this.data.projectCode, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_START_DATE: [this.data.limitStartDate, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_END_DATE: [this.data.limitEndDate, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_TYPE_CODE: [{value: this.data.limitTypeCode, disabled: true}, [Validators.maxLength(11)]],
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    EMPNO: [localStorage.getItem("empNo"), [Validators.maxLength(11)]]
  });

  ngOnInit(): void {
    if (this.addForm.value.STOP_FLAG != 'N') {
      this.addForm.controls['STOP_DATE'].enable();
    }
  }

  ngAfterViewInit() {

  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  changeSelect() {
    this.addForm.patchValue({ STOP_DATE: '' });
    if (this.addForm.value.STOP_FLAG == 'N') {
      this.addForm.controls['STOP_DATE'].disable();
    } else {
      this.addForm.controls['STOP_DATE'].enable();
      this.addForm.patchValue({ STOP_DATE: new Date() });
    }
  }

  setTimes() {
    if (this.addForm.value.LIMIT_END_DATE == null) {
      this.addForm.patchValue({ LIMIT_END_DATE: this.addForm.value.LIMIT_START_DATE });
    }
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    this.addForm.controls['STOP_DATE'].enable();
    var formData = new FormData();
    let jsonStr = JSON.stringify(this.addForm.value);
    let jsonObj = JSON.parse(jsonStr);
    let startDate = new Date(this.addForm.value.LIMIT_START_DATE);
    let endDate = new Date(this.addForm.value.LIMIT_END_DATE);
    jsonObj.LIMIT_START_DATE = this.datePipe.transform(startDate, "yyyy/MM/dd");
    jsonObj.LIMIT_END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");
    jsonObj.STOP_DATE = '';

    if (this.addForm.value.STOP_FLAG == 'Y') {
      let stopDate = new Date(this.addForm.value.STOP_DATE);
      jsonObj.STOP_DATE = this.datePipe.transform(stopDate, "yyyy/MM/dd");
    }

    for (var key in jsonObj ) { formData.append(key, jsonObj[key]); }
    let msgStr: string = "";
    let baseUrl = 'f01/f01003edit';
    msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
    const childernDialogRef = this.dialog.open(F01003confirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }
  }

}
