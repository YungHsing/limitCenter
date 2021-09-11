import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ManageRecordModule {
  private _limitNo: string;
  private _columnName: string;
  private _columnDesc: string;
  private _beforeVal: string;
  private _afterVal: string;
  private _reasonContent: string;
  private _empno: string;
  private _manageDate: string;
  private _reviewEmpno: string;
  private _actionSort: string;

  public get limitNo(): string {
    return this._limitNo;
  }

  public set limitNo(limitNo: string) {
    this._limitNo = limitNo;
  }

  public get columnName(): string {
    return this._columnName;
  }

  public set columnName(columnName: string) {
    this._columnName = columnName;
  }

  public get columnDesc(): string {
    return this._columnDesc;
  }

  public set columnDesc(columnDesc: string) {
    this._columnDesc = columnDesc;
  }

  public get beforeVal(): string {
    return this._beforeVal;
  }

  public set beforeVal(beforeVal: string) {
    this._beforeVal = beforeVal;
  }

  public get afterVal(): string {
    return this._afterVal;
  }

  public set afterVal(afterVal: string) {
    this._afterVal = afterVal;
  }

  public get reasonContent(): string {
    return this._reasonContent;
  }

  public set reasonContent(reasonContent: string) {
    this._reasonContent = reasonContent;
  }

  public get empno(): string {
    return this._empno;
  }

  public set empno(empno: string) {
    this._empno = empno;
  }

  public get manageDate(): string {
    return this._manageDate;
  }

  public set manageDate(manageDate: string) {
    this._manageDate = manageDate;
  }

  public get reviewEmpno(): string {
    return this._reviewEmpno;
  }

  public set reviewEmpno(reviewEmpno: string) {
    this._reviewEmpno = reviewEmpno;
  }

  public get actionSort(): string {
    return this._actionSort;
  }

  public set actionSort(actionSort: string) {
    this._actionSort = actionSort;
  }
  
}
