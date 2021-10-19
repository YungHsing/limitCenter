import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03004Service } from '../f03004.service';
import { F03004confirmComponent } from '../f03004confirm/f03004confirm.component';

interface ynCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f03004add',
  templateUrl: './f03004add.component.html',
  styleUrls: ['./f03004add.component.css', '../../../assets/css/child.css']
})
export class F03004addComponent {
  ynCode: ynCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  constructor(public dialogRef: MatDialogRef<F03004addComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public f03004Service: F03004Service, public dialog: MatDialog) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
    this.formControl.hasError('email') ? 'Not a valid email' :
    '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f03/f03004action2';
    msgStr = await this.f03004Service.addOrEditSystemCodeSet(baseUrl, this.data);
    const childernDialogRef = this.dialog.open(F03004confirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '儲存成功！') { this.dialogRef.close({ event:'success' }); }
  }
}
