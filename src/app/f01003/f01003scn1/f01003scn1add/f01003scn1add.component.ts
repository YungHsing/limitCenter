import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01003Service } from '../../f01003.service';
import { F01003confirmComponent } from '../../f01003confirm/f01003confirm.component';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  templateUrl: './f01003scn1add.component.html',
  styleUrls: ['./f01003scn1add.component.css']
})
export class F01003scn1addComponent implements OnInit {

  ynCode: sysCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  limitTypeOption: sysCode[] =  null;
  CurrencyOption: sysCode[] =  [{value: 'TWN', viewValue: '台幣'}];
  stopDateValue: Date;
  DateValue: Date = new Date();
  minDate: Date;
  constructor(public dialogRef: MatDialogRef<F01003scn1addComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public f01003Service: F01003Service, public dialog: MatDialog, private datePipe: DatePipe) { 
    this.minDate = new Date();
  }

  addForm: FormGroup = this.fb.group({
    LEVEL_NO: [this.data.levelNo, [Validators.maxLength(1)]],
    UP_LEVEL: [this.data.upLevel, [Validators.maxLength(10)]],
    CUSTOMER_ID: [this.data.customerId, [Validators.maxLength(30)]],
    NATIONAL_ID: [this.data.nationalId, [Validators.maxLength(30)]],
    CREDIT_LIMIT: ['', [Validators.maxLength(10)]],
    CURRENCY_TYPE: ['TWN', [Validators.maxLength(3)]],
    STOP_FLAG: ['N', [Validators.maxLength(1)]],
    CANCEL_FLAG: ['Y', [Validators.maxLength(1)]],
    CYCLE_TYPE: ['Y', [Validators.maxLength(1)]],
    STOP_DATE: [ {value: '', disabled: true}, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_START_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_END_DATE: ['', [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_TYPE_CODE: ['', [Validators.maxLength(11)]],
    EMPNO: [localStorage.getItem("empNo"), [Validators.maxLength(11)]]
  });

  ngOnInit(): void {
    if (this.data.levelNo == '3') {
      this.limitTypeOption = [{value: 'P0001010000', viewValue: '個人有擔'}, {value: 'P0001020000', viewValue: '個人無擔'}];
    } else if(this.data.levelNo == '4' && this.data.limitTypeCode == 'P0001010000') {
     
      this.limitTypeOption = [];
    } else if(this.data.levelNo == '4' && this.data.limitTypeCode == 'P0001020000') {
      this.limitTypeOption = [{value: 'P0001020100', viewValue: '無擔分期型限額'}, {value: 'P0001020200', viewValue: '無擔循環型限額'}];
    } else {
      this.limitTypeOption = [];
    }
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage(cloumnName: string) {
    let obj = this.addForm.get(cloumnName);
    return obj.hasError('required')  ? '此為必填欄位!' : obj.hasError('maxlength') ? '長度過長' :
           obj.hasError('minlength') ? '長度過短' : '';
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
    let msgStr: string = "";
    if(!this.addForm.valid) {
      msgStr = '資料格式有誤，請修正!';
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else {
      var formData = new FormData();
      let jsonStr = JSON.stringify(this.addForm.value);
      let jsonObj = JSON.parse(jsonStr);
      let startDate = new Date(this.addForm.value.LIMIT_START_DATE);
      let endDate = new Date(this.addForm.value.LIMIT_END_DATE);
      jsonObj.LIMIT_END_DATE = this.datePipe.transform(endDate, "yyyy/MM/dd");
      for (var key in jsonObj ) { formData.append(key, jsonObj[key]); }
      
      let baseUrl = 'f01/f01003childAdd';
      msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true}
      });
      if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }
    }
  }
  
}
