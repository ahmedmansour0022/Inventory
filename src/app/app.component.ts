import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inventory';
  id:any;
  constructor(private router : Router) {
    this.id=localStorage.getItem("id");
   }
  ngOnInit(): void {
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/Login']);

  }
}
