import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01003Service } from '../f01003.service';
import { F01003confirmComponent } from '../f01003confirm/f01003confirm.component';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './f01003add.component.html',
  styleUrls: ['./f01003add.component.css', '../../../assets/css/child.css']
})
export class F01003addComponent implements OnInit {
  ynCode: sysCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];
  limitTypeOption: sysCode[] = [{ value: 'P0001000000', viewValue: '個人限額' }];
  CurrencyOption: sysCode[] = [{ value: 'TWD', viewValue: '台幣' }];
  stopDateValue: Date;
  minDate: Date;
  constructor(public dialogRef: MatDialogRef<F01003addComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public f01003Service: F01003Service, public dialog: MatDialog, private datePipe: DatePipe) {
    //設定起日最早僅能選擇今日
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
  }

  addForm: FormGroup = this.fb.group({
    LEVEL_NO: ['2', [Validators.maxLength(1)]],
    CUSTOMER_ID: [this.data.CUSTOMER_ID, [Validators.maxLength(30)]],
    NATIONAL_ID: [this.data.NATIONAL_ID, [Validators.maxLength(30)]],
    CREDIT_LIMIT: ['', [Validators.maxLength(10)]],
    CURRENCY_TYPE: ['TWD', [Validators.maxLength(3)]],
    // STOP_FLAG: ['N', [Validators.maxLength(1)]],
    CANCEL_FLAG: ['N', [Validators.maxLength(1)]],
    CYCLE_TYPE: ['Y', [Validators.maxLength(1)]],
    // STOP_DATE: [ {value: '', disabled: true}, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_START_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_END_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_TYPE_CODE: ['P0001000000', [Validators.maxLength(11)]],
    EMPNO: [localStorage.getItem("limitEmpNo"), [Validators.maxLength(11)]]
  });

  ngOnInit(): void {
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
    if (!this.addForm.valid) {
      for (const i in this.addForm.controls) {
        if (this.addForm.controls.hasOwnProperty(i)) {
          this.addForm.controls[i].markAsDirty();
          this.addForm.controls[i].updateValueAndValidity();
        }
      }
    } else {
      var formData = new FormData();
      let creditLimit = this.addForm.value.CREDIT_LIMIT;
      this.addForm.patchValue({ CREDIT_LIMIT: creditLimit.toString().replaceAll(',', '') });
      let jsonStr = JSON.stringify(this.addForm.value);
      let jsonObj = JSON.parse(jsonStr);
      let startDate = new Date(this.addForm.value.LIMIT_START_DATE);
      let endDate = new Date(this.addForm.value.LIMIT_END_DATE);

      jsonObj.LIMIT_START_DATE = this.datePipe.transform(startDate, "yyyy/MM/dd");
      jsonObj.LIMIT_END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");

      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }
      let msgStr: string = "";
      let baseUrl = 'f01/f01003level2add';
      msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
      if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }
    }
  }

  onKey(event: KeyboardEvent) {
    let value = (<HTMLInputElement>event.target).value;
    this.addForm.patchValue({ CREDIT_LIMIT: value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') });
  }

}
