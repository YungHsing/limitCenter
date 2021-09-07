import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; 

interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  templateUrl: './f01003confirm.component.html',
  styleUrls: ['./f01003confirm.component.css']
})
export class F01003confirmComponent {
  [x: string]: any;
  StopCodeOption: sysCode[] =  [{value: 'CODE_1', viewValue: '原因代碼1'},{value: 'CODE_2', viewValue: '原因代碼2'},{value: 'CODE_3', viewValue: '原因代碼3'}];
  constructor(public dialogRef: MatDialogRef<F01003confirmComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }

  confirmForm: FormGroup = this.fb.group({
    LIMIT_NO: [this.data.limitNo, [Validators.maxLength(10)]],
    STOP_CODE: ['', [Validators.maxLength(10)]],
    REASON_CONTENT: ['', [Validators.maxLength(100)]]
  });

  ngOnInit(): void {

  };

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage(cloumnName: string) {
    let obj = this.confirmForm.get(cloumnName);
    return obj.hasError('required')  ? '此為必填欄位!' : obj.hasError('maxlength') ? '長度過長' :
           obj.hasError('minlength') ? '長度過短' : '';
  }

  goBack() {
    console.log(this.confirmForm.value.REASON_CONTENT)
    this.dialogRef.close({ event:'success', value: this.confirmForm.value.REASON_CONTENT });
  }
}
