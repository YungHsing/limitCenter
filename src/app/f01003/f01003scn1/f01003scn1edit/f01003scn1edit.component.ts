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
  display = true;
  ynCode: sysCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  limitTypeOption: sysCode[] =  [{value: 'P0001000000', viewValue: '個人限額'},{value: 'P0001010000', viewValue: '個人有擔'}, {value: 'P0001020000', viewValue: '個人無擔'},{value: 'P0001020100', viewValue: '無擔分期型限額'}, {value: 'P0001020200', viewValue: '無擔循環型限額'}];
  CurrencyOption: sysCode[] =  [{value: 'TWN', viewValue: '台幣'}];
  StopCodeOption: sysCode[] =  [{value: 'CODE_1', viewValue: '原因代碼1'},{value: 'CODE_2', viewValue: '原因代碼2'},{value: 'CODE_3', viewValue: '原因代碼3'}];
  stopDateValue: Date;
  minDate: Date;
  constructor(public dialogRef: MatDialogRef<F01003scn1editComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any, public f01003Service: F01003Service, public dialog: MatDialog, private datePipe: DatePipe) { 
    this.minDate = new Date();
  }
  
  addForm: FormGroup = this.fb.group({
    LEVEL_NO: [this.data.levelNo, [Validators.maxLength(1)]],
    UP_LEVEL: [this.data.upLevel, [Validators.maxLength(10)]],
    CUSTOMER_ID: [this.data.customerId, [Validators.maxLength(30)]],
    NATIONAL_ID: [this.data.nationalId, [Validators.maxLength(30)]],
    CREDIT_LIMIT: [this.data.creditLimit, [Validators.maxLength(10)]],
    CURRENCY_TYPE: [{value: this.data.currencyType, disabled: true}, [Validators.maxLength(3)]],
    STOP_FLAG: [this.data.stopFlag, [Validators.maxLength(1)]],
    CANCEL_FLAG: [this.data.cancelFlag, [Validators.maxLength(1)]],
    ENABLE_FLAG: [this.data.enableFlag, [Validators.maxLength(1)]],
    CYCLE_TYPE: [this.data.cycleType, [Validators.maxLength(1)]],
    STOP_DATE: [ {value: this.data.stopDate, disabled: true}, []],
    PROJECT_CODE: [ this.data.projectCode, [Validators.maxLength(10), Validators.minLength(10)]],
    LIMIT_START_DATE: [this.data.limitStartDate, []],
    LIMIT_END_DATE: [this.data.limitEndDate, []],
    LIMIT_TYPE_CODE: [{value: this.data.limitTypeCode, disabled: true}, [Validators.maxLength(11)]],
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    EMPNO: [localStorage.getItem("empNo"), [Validators.maxLength(11)]],
    STOP_CODE: [ this.data.stopCode, [Validators.maxLength(10)]],
    STOP_DESC: [this.data.stopDesc, [Validators.maxLength(50)]],
    REASON_CONTENT: []
  });

  ngOnInit(): void {
    if (this.addForm.value.STOP_FLAG != 'N') {
      this.addForm.controls['STOP_DATE'].enable();
      this.addForm.controls['STOP_CODE'].enable();
      this.addForm.controls['STOP_DESC'].enable();
    }
  }

  ngAfterViewInit() {

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
      this.addForm.controls['STOP_CODE'].disable();
      this.addForm.controls['STOP_DESC'].disable();
    } else {
      this.addForm.controls['STOP_DATE'].enable();
      this.addForm.controls['STOP_CODE'].enable();
      this.addForm.controls['STOP_DESC'].enable();
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
      const checkDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else if(this.addForm.value.STOP_FLAG == 'Y' && (this.addForm.value.STOP_CODE == null || this.addForm.value.STOP_DESC == null)) {
      msgStr = '請填寫停用代碼與停用原因!';
      const checkDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else {
      const reasonDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { display: false }
      });
      reasonDialogRef.afterClosed().subscribe(async result => {
        if (result != null && result.event == 'success' && result.value != null && result.value != '') {
          this.addForm.patchValue({ REASON_CONTENT : result.value });
          console.log(this.addForm.value)
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
          let baseUrl = 'f01/f01003edit';
          msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
          const childernDialogRef = this.dialog.open(F01003confirmComponent, {
            data: { msgStr: msgStr, display: true }
          });
          if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }

        } else {
          msgStr = '請填寫修改原因'
          const checkDialogRef = this.dialog.open(F01003confirmComponent, {
            data: { msgStr: msgStr, display: true }
          });
        }
      });
    }
  }
}
