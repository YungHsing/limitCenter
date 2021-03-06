import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01003Service } from '../../f01003.service';
import { F01003confirmComponent } from '../../f01003confirm/f01003confirm.component';

//下拉選單框架
interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f01003scn3wopen',
  templateUrl: './f01003scn3wopen.component.html',
  styleUrls: ['./f01003scn3wopen.component.css', '../../../../assets/css/child.css']
})
export class F01003scn3wopenComponent implements OnInit {

  //凍結＆解凍
  constructor(public dialogRef: MatDialogRef<F01003scn3wopenComponent>, public f01003Service: F01003Service, public dialog: MatDialog, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }
  reasonCodeOption: sysCode[] = []; //原因碼下拉選單
  reasonCodeSelectedValue: string; //原因碼
  frozenNoOption: sysCode[] = []; //凍結編號下拉選單
  frozenNoSelectedValue: string; //凍結編號
  frozen = true; //隱藏額度號
  unfrozen = true;  //隱藏預佔編號
  isReadOnly: boolean;
  frozenAddForm: FormGroup = this.fb.group({
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    FROZEN_NO: [this.data.frozenNo, [Validators.maxLength(10)]],
    REASON_CODE: [this.data.reasonCode, [Validators.maxLength(5)]],
    REASON_DESC: [this.data.customerId, [Validators.maxLength(500)]],
    ACTION_TYPE: [],
    EMPNO: [localStorage.getItem("liEmpNo"), [Validators.maxLength(11)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  submit() {
  }

  ngOnInit(): void {
    let formData: FormData = new FormData();
    let limitNo = this.data.limitNo;
    let isFrozen = this.data.isFrozen;
    let actionType = isFrozen == true? '4' : '5';
    this.frozenAddForm.patchValue({ ACTION_TYPE: actionType });
    this.frozenAddForm.patchValue({ LIMIT_NO: limitNo });
    let jsonStr = JSON.stringify(this.frozenAddForm.value);
    let jsonObj = JSON.parse(jsonStr);
    for (var key in jsonObj) { formData.append(key, jsonObj[key]); }
    let baseUrl = 'f01/f01003FrozenNoOption';
    this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      for (const jsonObj of data.rspBody.frozenNoOption) {
        const frozenNo = jsonObj['codeNo'];
        const frozenDesc = jsonObj['codeDesc'];
        this.reasonCodeOption.push({ value: frozenNo, viewValue: frozenDesc })
      }
    });
    if (isFrozen == true) {
      this.frozen = false;

    } else {
      this.unfrozen = false;
      let baseUrl = 'f01/f01003UnfrozenNoOption';
      this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {

        for (const jsonObj of data.rspBody.unfrozenNoOption) {
          const frozenNo = jsonObj['frozenNo'];
          this.frozenNoOption.push({ value: frozenNo, viewValue: frozenNo })
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
    let msgStr: string = "";
    if(!this.unfrozen && this.frozenAddForm.value.FROZEN_NO == null) {
      msgStr = '請選擇凍結編號!';
      const childernDialogRef = this.dialog.open(F01003confirmComponent, {
        data: { msgStr: msgStr, display: true }
      });
    } else if(!this.frozenAddForm.valid) {
      for (const i in this.frozenAddForm.controls) {
        if (this.frozenAddForm.controls.hasOwnProperty(i)) {
          this.frozenAddForm.controls[i].markAsDirty();
          this.frozenAddForm.controls[i].updateValueAndValidity();
        }
      }
    } else {
      var formData = new FormData();
      let jsonStr = JSON.stringify(this.frozenAddForm.value);
      let jsonObj = JSON.parse(jsonStr);
      for (var key in jsonObj) { formData.append(key, jsonObj[key]); }

      let baseUrl = 'f01/f01003FrozenAdd';
      msgStr = await this.f01003Service.sendFormData(baseUrl, formData);
      const reserveDialogRef = this.dialog.open(F01003confirmComponent, {

        data: { msgStr: msgStr, display: true }
      });
      if (msgStr === 'success') { this.dialogRef.close({ event: 'success' }); }
    }
  }

  // 停用原因下拉事件
  changeSelect() {
    for (const jsonObj of this.reasonCodeOption) {
      const codeNo = jsonObj['value'];
      const codeDesc = jsonObj['viewValue'];
      if (codeNo == this.frozenAddForm.value.REASON_CODE) {
        this.frozenAddForm.patchValue({ REASON_DESC: codeDesc });
        if (codeNo == 'C003' || codeNo == 'B004') {
          this.isReadOnly = false;
        } else {
          this.isReadOnly = true;
        }
      }

    }
  }
}
