import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuListModule } from './menu-list/menu-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BnNgIdleService } from 'bn-ng-idle';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModule } from './material/material.module';
import { NgZorroAntdModule } from './ngzorro/ng-zorro-antd.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03004Component } from './f03004/f03004.component';
import { F03004confirmComponent } from './f03004/f03004confirm/f03004confirm.component';
import { F03004addComponent } from './f03004/f03004add/f03004add.component';
import { F03004editComponent } from './f03004/f03004edit/f03004edit.component';

import { F01001Component } from './f01001/f01001.component';
import { F01002Component } from './f01002/f01002.component';
import { F01003Component } from './f01003/f01003.component';
import { F01004Component } from './f01004/f01004.component';
import { F01005Component } from './f01005/f01005.component';
import { F01001addComponent } from './f01001/f01001add/f01001add.component';
import { F01001confirmComponent } from './f01001/f01001confirm/f01001confirm.component';
import { F01003confirmComponent } from './f01003/f01003confirm/f01003confirm.component';
import { F01003addComponent } from './f01003/f01003add/f01003add.component';
import { F01003scn0Component } from './f01003/f01003scn0/f01003scn0.component';
import { F01003scn1Component } from './f01003/f01003scn1/f01003scn1.component';
import { F01003scn2Component } from './f01003/f01003scn2/f01003scn2.component';
import { F01003scn3Component } from './f01003/f01003scn3/f01003scn3.component';
import { F01003scn4Component } from './f01003/f01003scn4/f01003scn4.component';
import { F01003scn1editComponent } from './f01003/f01003scn1/f01003scn1edit/f01003scn1edit.component';
import { F01003scn1addComponent } from './f01003/f01003scn1/f01003scn1add/f01003scn1add.component';
import { F01003scn2wopenComponent } from './f01003/f01003scn2/f01003scn2wopen/f01003scn2wopen.component';
import { F01003scn3wopenComponent } from './f01003/f01003scn3/f01003scn3wopen/f01003scn3wopen.component';
import { F01000Component } from './f01000/f01000.component';
import { F01000confirmComponent } from './f01000/f01000confirm/f01000confirm.component';
import { registerLocaleData } from '@angular/common';
import { NZ_I18N, zh_TW } from 'ng-zorro-antd/i18n';
import { TokenInterceptor } from './token.interceptor';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { F02001Component } from './f02001/f02001.component';
import { F02002Component } from './f02002/f02002.component';
import { F02003Component } from './f02003/f02003.component';
import { F02001addComponent } from './f02001/f02001add/f02001add.component';
import { F02001editComponent } from './f02001/f02001edit/f02001edit.component';
import { F02002addComponent } from './f02002/f02002add/f02002add.component';
import { F02002amtComponent } from './f02002/f02002amt/f02002amt.component';
import { F02002editComponent } from './f02002/f02002edit/f02002edit.component';
import { F02002prjComponent } from './f02002/f02002prj/f02002prj.component';
import { F02002roleComponent } from './f02002/f02002role/f02002role.component';
import { ConfirmComponent } from './common-lib/confirm/confirm.component';

export const TW_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    F01001Component,
    F01002Component,
    F01003Component,
    F01004Component,
    F01005Component,
    F03004Component,
    F03004confirmComponent,
    F03004addComponent,
    F03004editComponent,
    F01001addComponent,
    F01001confirmComponent,
    F01003confirmComponent,
    F01003addComponent,
    F01003scn0Component,
    F01003scn1Component,
    F01003scn1editComponent,
    F01003scn1addComponent,
    F01003scn2Component,
    F01003scn3Component,
    F01003scn4Component,
    F01003scn2wopenComponent,
    F01003scn3wopenComponent,
    F01000Component,
    F01000confirmComponent,
    F02001Component,
    F02002Component,
    F02003Component,
    F02001addComponent,
    F02001editComponent,
    F02002addComponent,
    F02002amtComponent,
    F02002editComponent,
    F02002prjComponent,
    F02002roleComponent,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    MenuListModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientJsonpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgZorroAntdModule,
    FontAwesomeModule
  ],
  providers: [
    BnNgIdleService,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // },
    {
      provide: NZ_I18N,
      useFactory: () => zh_TW,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faFolderOpen);
  }
}
