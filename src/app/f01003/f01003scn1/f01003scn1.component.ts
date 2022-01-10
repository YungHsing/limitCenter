import { DataRowOutlet } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { F01003Service } from '../f01003.service';
import { F01003scn1addComponent } from './f01003scn1add/f01003scn1add.component';
import { F01003scn1editComponent } from './f01003scn1edit/f01003scn1edit.component';
import { LimitDataModule } from './limit-data.module';

export class Group {
  level: number = 0;
  parent: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-f01003scn1',
  templateUrl: './f01003scn1.component.html',
  styleUrls: ['./f01003scn1.component.css', '../../../assets/css/child.css']
})
export class F01003scn1Component implements OnInit {

  displayedColumns: string[] = [
    'editBtn',
    'childBtn',
    'levelNo',
    'statusFlag',
    'limitNo',
    'upLevel',
    'limitTypeCode',
    'limitStartDate',
    'limitEndDate',
    'creditLimit',
    'usedLimit',
    'reserveLimit',
    'activeLimit',
    'currencyType',
    'stopFlag',
    'stopDate',
    'projectCode',
    'cycleType',
    'cancelFlag',
    'applno',
    'productCode',
    'empno',
    'manageDate'
  ];

  public dataSource = new MatTableDataSource<LimitDataModule | Group>([]);

  groupByColumns: string[] = ['levelNo'];

  constructor(private route: ActivatedRoute, public f01003Service: F01003Service, private datePipe: DatePipe, public dialog: MatDialog,) { }

  NATIONAL_ID: string;
  CUSTOMER_ID: string;
  CREDIT_LIMIT: string;
  LIMIT_START_DATE: string;
  LimitData: LimitDataModule[];

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.NATIONAL_ID = params['NATIONAL_ID'];
      this.CUSTOMER_ID = params['CUSTOMER_ID'];
      this.CREDIT_LIMIT = params['CREDIT_LIMIT'];
      this.LIMIT_START_DATE = this.datePipe.transform(params['LIMIT_START_DATE'], "yyyy/MM/dd");
    });
    var formData = new FormData();
    formData.append('CUSTOMER_ID', this.CUSTOMER_ID);
    formData.append('NATIONAL_ID', this.NATIONAL_ID);
    let baseUrl = 'f01/f01003query';
    await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      this.LimitData = data.rspBody.items;
    });

    this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  customFilterPredicate(data: LimitDataModule | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: LimitDataModule): boolean {
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
    return a.filter(function(item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }

  editContent(row: any) {
      const dialogRef = this.dialog.open(F01003scn1editComponent, {
        data: {
          levelNo: row.levelNo,
          upLevel: row.upLevel,
          nationalId: this.NATIONAL_ID,
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
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') { this.refreshTable(); }
      });
  }

  addChildLimit(row: any) {
    const dialogRef = this.dialog.open(F01003scn1addComponent, {
      data: {
        levelNo: Number(row.levelNo) + 1,
        upLevel: row.limitNo,
        nationalId: this.NATIONAL_ID,
        customerId: row.customerId,
        limitTypeCode: row.limitTypeCode
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    });
  }

  private async refreshTable() {
    var formData = new FormData();
    formData.append('CUSTOMER_ID', this.CUSTOMER_ID);
    formData.append('NATIONAL_ID', this.NATIONAL_ID);
    let baseUrl = 'f01/f01003query';
    await this.f01003Service.getLimitDataList(baseUrl, formData).then(data => {
      this.LimitData = data.rspBody.items;
    });
    this.dataSource.data = this.addGroups(this.LimitData, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  checkButton(statusFlag: string) {
    return statusFlag === 'N'? true : false;
  }
}
