import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu-list.component';
import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../material/material.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgZorroAntdModule } from './../ngzorro/ng-zorro-antd.module';

@NgModule({
  declarations: [MenuListComponent],
  exports: [MenuListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NgZorroAntdModule
  ]
})
export class MenuListModule { }
