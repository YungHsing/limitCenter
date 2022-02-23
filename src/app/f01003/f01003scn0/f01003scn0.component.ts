import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { F01003Service } from '../f01003.service';

@Component({
  templateUrl: './f01003scn0.component.html',
  styleUrls: ['./f01003scn0.component.css', '../../../assets/css/child.css']
})
export class F01003scn0Component implements OnInit {

  constructor(private route: ActivatedRoute, public f01003Service: F01003Service, private datePipe: DatePipe) { }

  NATIONAL_ID: string;
  CUSTOMER_ID: string;
  CREDIT_LIMIT: string;
  LIMIT_START_DATE: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.NATIONAL_ID = params['NATIONAL_ID'];
      this.CUSTOMER_ID = params['CUSTOMER_ID'];
      this.CREDIT_LIMIT = this.toCurrency(params['CREDIT_LIMIT']);
      this.LIMIT_START_DATE = this.datePipe.transform(params['LIMIT_START_DATE'], "yyyy/MM/dd");
    });
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  // 金額加上","
  toCurrency(amount: any) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

}
