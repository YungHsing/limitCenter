import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { F01003Service } from '../f01003.service';

@Component({
  selector: 'app-f01003scn3',
  templateUrl: './f01003scn3.component.html',
  styleUrls: ['./f01003scn3.component.css']
})
export class F01003scn3Component implements OnInit {

  constructor(private route: ActivatedRoute, public f01003Service: F01003Service, private datePipe: DatePipe) { }

  NATIONAL_ID: string;
  CUSTOMER_ID: string;
  CREDIT_LIMIT: string;
  LIMIT_START_DATE: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.NATIONAL_ID = params['NATIONAL_ID'];
      this.CUSTOMER_ID = params['CUSTOMER_ID'];
      this.CREDIT_LIMIT = params['CREDIT_LIMIT'];
      this.LIMIT_START_DATE = this.datePipe.transform(params['LIMIT_START_DATE'], "yyyy/MM/dd");
    });
  }

}
