import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { error } from 'protractor';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Api="http://iinventory-001-site1.itempurl.com/api/";
  user:any={};
  error:string="";
  constructor(private http:HttpClient,private router : Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("id")){
      this.router.navigate(['/Report'])
    }
  }
  onOrder(){
    this.http.get(this.Api+"Auth?Name="+this.user.Name+"&Password="+this.user.Password).subscribe((data:any)=>{
      if(data.roleId==1){     
      localStorage.setItem("id",data.companyId);
      this.router.navigate(['/Report'])
      }else{
        this.error="this website for admin only";
      }
    },(error)=>{
      this.error="Name or Password is incorrect, try again please.";
    });
  }

}
