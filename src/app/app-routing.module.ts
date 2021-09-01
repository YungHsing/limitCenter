import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01001Component } from './f01001/f01001.component';
import { F01002Component } from './f01002/f01002.component';
import { F01003Component } from './f01003/f01003.component';
import { F01003scn0Component } from './f01003/f01003scn0/f01003scn0.component';
import { F01003scn1Component } from './f01003/f01003scn1/f01003scn1.component';
import { F01003scn2Component } from './f01003/f01003scn2/f01003scn2.component';
import { F01003scn3Component } from './f01003/f01003scn3/f01003scn3.component';
import { F01003scn4Component } from './f01003/f01003scn4/f01003scn4.component';
import { F01004Component } from './f01004/f01004.component';
import { F01005Component } from './f01005/f01005.component';
import { F03004Component } from './f03004/f03004.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MenuListComponent } from './menu-list/menu-list.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'logIn',
    component: LoginComponent
  },
  {
    path: 'logOut',
    component: LoginComponent
  },
  {
    path: '',
    component: MenuListComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'F01001',
        component: F01001Component
      },
      {
        path: 'F01002',
        component: F01002Component
      },
      {
        path: 'F01003',
        component: F01003Component
      },
      {
        path: 'F01003SCN0',
        component: F01003scn0Component,
        children: [
          {
            path: 'F01003SCN1',
            component: F01003scn1Component
          },
          {
            path: 'F01003SCN2',
            component: F01003scn2Component
          },
          {
            path: 'F01003SCN3',
            component: F01003scn3Component
          },
          {
            path: 'F01003SCN4',
            component: F01003scn4Component
          }
        ]
      },
      {
        path: 'F01004',
        component: F01004Component
      },
      {
        path: 'F01005',
        component: F01005Component
      },
      {
        path: 'F02001',
        component: F03004Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true,
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
