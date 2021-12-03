import { DataRowOutlet } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { element } from 'protractor';
import { forkJoin } from 'rxjs';
import { F01000Service } from './f01000.service';
import { F01000confirmComponent } from './f01000confirm/f01000confirm.component';
import { ManageRecordModule } from './manage-record.module';
// checkBox框架
interface checkBox {
  value: string;
  completed: boolean;
}
export class Group {
  level: number = 0;
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-f01000',
  templateUrl: './f01000.component.html',
  styleUrls: ['./f01000.component.css', '../../assets/css/child.css']
})
export class F01000Component implements OnInit {

  displayedColumns: string[] = [
    'AGREE_FLAG',
    'LIMIT_NO',
    'COLUMN_DESC',
    'BEFORE_VAL',
    'AFTER_VAL',
    'REASON_CONTENT',
    'EMPNO',
    'MANAGE_DATE',
    'REVIEW_EMPNO',
    'ACTION_SORT'
  ];

  public dataSource = new MatTableDataSource<ManageRecordModule | Group>([]);

  groupByColumns: string[] = ['ACTION_SORT'];

  constructor(public dialogRef: MatDialogRef<F01000Component>, @Inject(MAT_DIALOG_DATA) public data: any, private route: ActivatedRoute, public f01000Service: F01000Service, private datePipe: DatePipe, public dialog: MatDialog,) { }

  isChecked: boolean;
  CREDIT_LIMIT: string;
  LIMIT_START_DATE: string;
  LimitData: Data[] = [];
  chkArray: checkBox[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;

  async ngOnInit(): Promise<void> {
    var formData = new FormData();
    formData.append('page', '1');
    formData.append('per_page', '10');

    let baseUrl = 'f01/f01000Query';
    await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
      this.LimitData = data.rspBody.list;
    });

    this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
    for (const jsonObj of this.dataSource.data) {
      this.chkArray.push({ value: jsonObj['ROWID'] != undefined ? jsonObj['ROWID'] : '', completed: false });
    }
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  customFilterPredicate(data: ManageRecordModule | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: ManageRecordModule): boolean {
    const groupRows = this.dataSource.data.filter(row => {
      if (!(row instanceof Group)) return false;

      let match = true;
      this.groupByColumns.forEach(column => {
        if (!row[column] || !data[column] || row[column] !== data[column])
          match = false;
      });
      return match;
    });

    if (groupRows.length === 0) return true;
    if (groupRows.length > 1) throw 'Data row is in more than one group!';
    const parent = <Group>groupRows[0]; // </Group> (Fix syntax coloring)

    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString(); // hack to trigger filter refresh
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    var rootGroup = new Group();
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(
    data: any[],
    level: number,
    groupByColumns: string[],
    parent: Group
  ): any[] {
    // Recursive function, stop when there are no more levels.
    if (level >= groupByColumns.length) return data;
    var groups = this.uniqueBy(
      data.map(row => {
        var result = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (var i = 0; i <= level; i++)
          result[groupByColumns[i]] = row[groupByColumns[i]];
        return result;
      }),
      JSON.stringify
    );

    const currentColumn = groupByColumns[level];

    var subGroups = [];
    groups.forEach(group => {
      let rowsInGroup = data.filter(
        row => group[currentColumn] === row[currentColumn]
      );
      let subGroup = this.getSublevel(
        rowsInGroup,
        level + 1,
        groupByColumns,
        group
      );
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  async approve() {
    let count = 0;
    for (const obj of this.chkArray) { if(obj.completed == true) { count = count + 1; }  }
    if(count == 0) {
      const childernDialogRef = this.dialog.open(F01000confirmComponent, {
        data: { msgStr: "請至少勾選一項" }
      });
      return;
    }
    var rowIdArray: string[] = new Array;
    let formData = new FormData();

    for (const obj of this.chkArray) { if (obj.completed && obj.value != '') { rowIdArray.push(obj.value); } }
    let jsonStr = JSON.stringify(rowIdArray);
    let jsonObj = JSON.parse(jsonStr);
    formData.append('rowIds', jsonObj);
    formData.append('handleEmpNo', localStorage.getItem("limitEmpNo"));
    let baseUrl = 'f01/f01000Action';
    await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
      const childernDialogRef = this.dialog.open(F01000confirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    });
    this.refreshTable();
  }

  async notApprove() {
    let count = 0;
    for (const obj of this.chkArray) { if(obj.completed == true) { count = count + 1; }  }
    if(count == 0) {
      const childernDialogRef = this.dialog.open(F01000confirmComponent, {
        data: { msgStr: "請至少勾選一項" }
      });
      return;
    }
    var rowIdArray: string[] = new Array;
    let formData = new FormData();
    for (const obj of this.chkArray) { if (obj.completed && obj.value != '') { rowIdArray.push(obj.value); } }
    let jsonStr = JSON.stringify(rowIdArray);
    let jsonObj = JSON.parse(jsonStr);
    formData.append('rowIds', jsonObj);
    formData.append('handleEmpNo', localStorage.getItem("limitEmpNo"));
    let baseUrl = 'f01/f01000Delete';
    await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
      const childernDialogRef = this.dialog.open(F01000confirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    });
    this.refreshTable();
  }

  async refreshTable(): Promise<void> {
    var formData = new FormData();
    formData.append('page', '1');
    formData.append('per_page', '10');

    let baseUrl = 'f01/f01000Query';
    await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
      this.LimitData = data.rspBody.list;
    });

    this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
    for (const jsonObj of this.dataSource.data) {
      this.chkArray.push({ value: jsonObj['ROWID'] != undefined ? jsonObj['ROWID'] : '', completed: false });
    }
    this.setAll(false);
    this.isChecked = false;
  }

  //載入選項
  setAll(completed: boolean) {
    for (const obj of this.chkArray) {
      obj.completed = completed;
    }
  }

  // 檢查ActionSort=2的需要一同打勾
  checkChecked(completed: boolean, index: number, dataSource: any) {
    if (dataSource.data[index].ACTION_SORT == 2) {
      for (let i = 0; i < dataSource.data.length; i++) {
        if (dataSource.data[i].ACTION_SORT == 2) {
          this.chkArray[i].completed = completed;
        }
      }
    }
  }
}
