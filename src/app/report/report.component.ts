import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import * as autoTable from 'jspdf-autotable'
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  ii = 1;
  interval: any;
  totalAngularPackages: any[];
  
  head: any={
    "tAvaliable":0,
    "tPending":0,
    "tSold":0
  };
  Api = "http://iinventory-001-site1.itempurl.com/api/";
  cols: any[];
  id:number;
  selectedProducts: any[];
  _selectedColumns: any[];
  exportColumns: any[];
  loading: boolean = true;
  exporthead: any[];
  holder:any[]=[];
  statuses = [
    { label: 'Sold', value: 2 },
    { label: 'Avalilable', value: 0 },
    { label: 'Pending', value: 1 }
  ];
  products2 = [];
  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.id=Number.parseInt(localStorage.getItem("id"));
    if(localStorage.getItem("id")){
    this.cols = [
      { field: 'brand', header: 'Brand' },
      { field: 'class', header: 'Class' },
      { field: 'harvestId', header: 'HarvestId' },
      { field: 'package', header: 'Package' },
      { field: 'product', header: 'Product' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'size', header: 'Size' },
      { field: 'vairte', header: 'Vairte' },
    ];
    this.exporthead = [
      { field: 'bulletId', header: 'BulletId' },
      { field: 'brand', header: 'Brand' },
      { field: 'class', header: 'Class' },
      { field: 'harvestId', header: 'HarvestId' },
      { field: 'package', header: 'Package' },
      { field: 'product', header: 'Product' },
      { field: 'quantity', header: 'Quantity' },
      { field: 'size', header: 'Size' },
      { field: 'vairte', header: 'Vairte' },
      { field: 'solid', header: 'Solid' },
    ];
    this.http.get(this.Api + "Reception/Total?ComapnyId="+this.id).subscribe((data: any) => {
      this.head = data;
    }, (error) => {
      console.log("fiald");
    });
    this.interval = setInterval(() => {
      this.http.get(this.Api + "Reception?ComapnyId="+this.id+"&Index=" + this.ii++).subscribe((data: any[]) => {
        data.forEach(element => {
          this.holder.push(element);
        });
        this.products2=this.holder;
        if(data.length<1){
          this.pauseTimeLine();
        }
      },
        (error) => {
          console.log(error);
        });
    }, 2000);
    this.loading = false;
    this._selectedColumns = this.cols;
    this.exportColumns = this.exporthead.map(col => ({ title: col.header, dataKey: col.field }));
  }
  else{
this.router.navigate(['/Login']);
  }
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  pauseTimeLine() {
    clearInterval(this.interval);
  }  
  logout(){
    localStorage.clear();
    this.router.navigate(['/Login']);
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.products2);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
    }
    
}
