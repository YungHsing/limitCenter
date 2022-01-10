import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01003confirmComponent } from '../../f01003confirm/f01003confirm.component';
import { F01003Service } from '../../f01003.service';
interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f01003scn2wopen',
  templateUrl: './f01003scn2wopen.component.html',
  styleUrls: ['./f01003scn2wopen.component.css', '../../../../assets/css/child.css']
})
export class F01003scn2wopenComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<F01003scn2wopenComponent>, public f01003Service: F01003Service, public dialog: MatDialog, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  actionTypeOption: sysCode[] = []; //動用類別下拉選單
  actionTypeSelectedValue: string; //動用類別
  reserveNoOption: sysCode[] = []; //預佔編號下拉選單
  reserveNoSelectedValue: string; //預佔編號
  active = true; //隱藏額度號
  reserve = true;  //隱藏預佔編號

  reserveAddForm: FormGroup = this.fb.group({
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    CURRENCY_TYPE: ['TWD', [Validators.maxLength(5)]],
    ACTION_TYPE: [this.data.customerId, [Validators.maxLength(5)]],
    CREDIT_LIMIT: [this.data.creditLimit, [Validators.maxLength(10)]],
    RESERVE_NO: [this.data.reserveNo, [Validators.maxLength(10)]],
    EMPNO: [localStorage.getItem("limitEmpNo"), [Validators.maxLength(11)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  submit() {
  }

  ngOnInit(): void {
    let formData: FormData = new FormData();
    formData.append('CUSTOMER_ID', this.data.cid);
    let baseUrl = 'f01/f01003ReserveOption';
    let limitNo = this.data.limitNo;
    let isActive = this.data.isActive;
    this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      for (const jsonObj of data.rspBody.actionTypeOption) {
        const codeNo = jsonObj['codeNo'];
        const codeDesc = jsonObj['codeDesc'];
        if (isActive == true) {
          this.active = false;
          if (codeNo == 2) { this.actionTypeOption.push({ value: codeNo, viewValue: codeDesc }) }
        } else {
          if (codeNo == 3) { this.actionTypeOption.push({ value: codeNo, viewValue: codeDesc }) }
        }
      }
    });
    if (isActive == false) {
      this.reserveAddForm.patchValue({ LIMIT_NO: limitNo });
      let jsonStr = JSON.stringify(this.reserveAddForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      this.reserve = false;
      let baseUrl = 'f01/f01003ReserveNoOption';
      this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
        for (const jsonObj of data.rspBody.reserveNoOption) {
          const reserveNo = jsonObj['reserveNo'];
          this.reserveNoOption.push({ value: reserveNo, viewValue: reserveNo })
        }
      });
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    let isActive = this.data.isActive;
    let msgStr: string = "";
    if (!this.reserveAddForm.valid) {
      msgStr = '資料格式有誤，請修正!';
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else if(isActive == false && this.reserveAddForm.value.RESERVE_NO == null) {
      msgStr = '請選擇預佔編號!';
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else {
      var formData = new FormData();
      let jsonStr = JSON.stringify(this.reserveAddForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj ) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003ReserveAdd';
      msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
      const reserveDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true}
      });
      if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }
    }
  }

  changeSelect() {
    let formData: FormData = new FormData();
    let limitNo = this.data.limitNo;
    this.reserveAddForm.patchValue({ LIMIT_NO: limitNo });
      let jsonStr = JSON.stringify(this.reserveAddForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003ReserveNoOption';
      this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
        for (const jsonObj of data.rspBody.reserveNoOption) {
          if(jsonObj['reserveNo'] == this.reserveAddForm.value.RESERVE_NO) {
            const creditLimit = jsonObj['creditLimit'];
          this.reserveAddForm.patchValue({ CREDIT_LIMIT: this.toCurrency(creditLimit) });
          }
        }
      });
  }

  toCurrency(amount: any) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
