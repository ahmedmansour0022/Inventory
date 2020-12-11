import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { ReportComponent } from './report/report.component';
import { SalesComponent } from './sales/sales.component';


const routes: Routes = [
  {path:"",redirectTo:"/Report",pathMatch:'full'},
  {path:"Report",component:ReportComponent},
  {path:"Inventory",component:ProductComponent},
  {path:"Sales",component:SalesComponent},
  {path:"Login",component:LoginComponent},
  {path:"**",redirectTo:"/Report"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
