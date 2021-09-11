import { DataRowOutlet } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { F01000Service } from './f01000.service';
import { ManageRecordModule } from './manage-record.module';

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
  styleUrls: ['./f01000.component.css']
})
export class F01000Component implements OnInit {

  displayedColumns: string[] = [
    'editBtn',
    'childBtn',
    'limitNo',
    'columnName',
    'columnDesc',
    'beforeVal',
    'afterVal',
    'reasonContent',
    'empno',
    'manageDate',
    'reviewEmpno',
    'actionSort'
  ];

  public dataSource = new MatTableDataSource<ManageRecordModule | Group>([]);

  groupByColumns: string[] = ['limitNo'];

  constructor(private route: ActivatedRoute, public f01000Service: F01000Service, private datePipe: DatePipe, public dialog: MatDialog,) { }

  CREDIT_LIMIT: string;
  LIMIT_START_DATE: string;
  LimitData: ManageRecordModule[];

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.CREDIT_LIMIT = params['CREDIT_LIMIT'];
      this.LIMIT_START_DATE = this.datePipe.transform(params['LIMIT_START_DATE'], "yyyy/MM/dd");
    });
    var formData = new FormData();
    let baseUrl = 'f01/f01000query';
    // await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
    //   this.LimitData = data.rspBody.items;
    // });

    // this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
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

  // addGroups(data: any[], groupByColumns: string[]): any[] {
  //   var rootGroup = new Group();
  //   return this.getSublevel(data, 0, groupByColumns, rootGroup);
  // }

  // getSublevel(
  //   data: any[],
  //   level: number,
  //   groupByColumns: string[],
  //   parent: Group
  // ): any[] {
  //   // Recursive function, stop when there are no more levels.
  //   if (level >= groupByColumns.length) return data;

  //   var groups = this.uniqueBy(
  //     data.map(row => {
  //       var result = new Group();
  //       result.level = level + 1;
  //       result.parent = parent;
  //       for (var i = 0; i <= level; i++)
  //         result[groupByColumns[i]] = row[groupByColumns[i]];
  //       return result;
  //     }),
  //     JSON.stringify
  //   );

  //   const currentColumn = groupByColumns[level];

  //   var subGroups = [];
  //   groups.forEach(group => {
  //     let rowsInGroup = data.filter(
  //       row => group[currentColumn] === row[currentColumn]
  //     );
  //     let subGroup = this.getSublevel(
  //       rowsInGroup,
  //       level + 1,
  //       groupByColumns,
  //       group
  //     );
  //     subGroup.unshift(group);
  //     subGroups = subGroups.concat(subGroup);
  //   });
  //   return subGroups;
  // } 

  uniqueBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  editContent(row: any) {
      const dialogRef = this.dialog.open(F01000Component, {
        data: {
          levelNo: row.levelNo,
          upLevel: row.upLevel,
          nationalId: row.nationalId,
          customerId: row.customerId,
          creditLimit: row.creditLimit,
          currencyType: row.currencyType,
          stopFlag: row.stopFlag,
          cancelFlag: row.cancelFlag,
          cycleType: row.cycleType,
          stopDate: row.stopDate,
          limitStartDate: row.limitStartDate,
          limitEndDate: row.limitEndDate,
          limitTypeCode: row.limitTypeCode,
          projectCode: row.projectCode == null ? '' : row.projectCode,
          limitNo: row.limitNo
        }
      });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result != null && result.event == 'success') { this.refreshTable(); }
      // });
  }

  addChildLimit(row: any) {
    const dialogRef = this.dialog.open(F01000Component, {
      data: {
        levelNo: Number(row.levelNo) + 1,
        upLevel: row.limitNo,
        nationalId: row.nationalId,
        customerId: row.customerId,
        limitTypeCode: row.limitTypeCode
      }
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != null && result.event == 'success') { this.refreshTable(); }
    // });
  }

  // private async refreshTable() {
  //   var formData = new FormData();
  //   let baseUrl = 'f01/f01000query';
  //   // await this.f01000Service.getLimitDataList(baseUrl, formData).then(data => {
  //   //   this.LimitData = data.rspBody.items;
  //   // });
  //   this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
  //   this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  // }
}
