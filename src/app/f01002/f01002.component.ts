import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { F01002Service } from './f01002.service';
import { F01002confirmComponent } from './f01002confirm/f01002confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core'


@Component({
  selector: 'app-f01002',
  templateUrl: './f01002.component.html',
  styleUrls: ['./f01002.component.css', '../../assets/css/f03.css']
})
export class F01002Component implements OnInit {



  constructor() { }
  ngOnInit(): void {

  }
}
