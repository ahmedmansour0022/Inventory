import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  data: any;
  data2: any;
  cols: any[];
  brand:any[]=[];
  brandcount:any[]=[];
  bullit:any[]=[];
  interval:any;
  holder:any[]=[];
  order:any={};
  display='none';
  display2='none';
  ii=1;
  Api = "http://iinventory-001-site1.itempurl.com/api/";
  selectedProducts: any[];
  _selectedColumns: any[];
  exportColumns: any[];
  loading: boolean = true;
  exporthead:any[];
  month:any[]=[];
  id:number;
  ordercount:any[]=[];
  statuses = [
    {label: 'Pending', value: 0},
    {label: 'Check Out', value: 1}
];
   products2:any[]=[];
  constructor(private http : HttpClient,private router:Router) {
}
ngOnInit(): void {
  this.id=Number.parseInt(localStorage.getItem("id"));
  if(localStorage.getItem("id")){
  this.http.get(this.Api+"order/Graph?ComapnyId="+this.id).subscribe((data:any[])=>{
    console.log(data);
    data.forEach(element => {
      this.month.push(element.month);
      this.ordercount.push(element.count);
    });
    this.data = {
      labels: this.month,
      datasets: [
          {
              label: 'Order History',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              data: this.ordercount
          }
      ]
  }  
  });
  this.http.get(this.Api+"brand/Graph?CompanyId="+this.id).subscribe((data:any[])=>{
    data.forEach(element => {
      this.brand.push(element.brand);
      this.brandcount.push(element.count);
    });
    this.data2 = {
      labels: this.brand,
      datasets: [
          {
              data: this.brandcount,
              backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
              ]
          }]    
      };

  })  

  this.cols = [
    { field: 'number', header: 'Number' },
    { field: 'client', header: 'Client' },
    {field: 'arrivalWeek', header: 'ArrivalWeek'},
  ];
this.exporthead=[
  { field: 'orderId', header: 'OrderId' },
  { field: 'number', header: 'Number' },
  { field: 'client', header: 'Client' },
  {field: 'arrivalWeek', header: 'ArrivalWeek'},
  { field: 'checked', header: 'Checked' },
]
this.interval = setInterval(() => {
  this.http.get(this.Api + "Order?ComapnyId="+this.id+"&Index=" + this.ii++).subscribe((data: any[]) => {
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
this.exportColumns = this.exporthead.map(col => ({title: col.header, dataKey: col.field}));
  }else{
this.router.navigate(['/Login'])
  }
}
@Input() get selectedColumns(): any[] {
  return this._selectedColumns;
}

set selectedColumns(val: any[]) {
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}
onCloseHandled2() {
  this.display2 = "none";
}
onCloseHandled() {
  this.bullit=[];
  this.display = "none";
}
onOrder(){
  const body = {
    "Number":this.order.Number,
    "ArrivalWeek":this.order.ArrivalWeek,
    "Client":this.order.Client,
    "OrderId":this.order.OrderId,
  }
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.put(this.Api+"Order/Up",body,{headers:headers}).subscribe((data:any)=>{
    let index = this.products2.findIndex(x=>x.orderId == this.order.OrderId);
    this.products2[index].number=this.order.Number
    this.products2[index].arrivalWeek=this.order.ArrivalWeek
    this.products2[index].client=this.order.Client
    this.display2="none";
    this.order={};
    console.log();
    
  })
}
openModal2(order:any) {
  this.order={
    "Number":order.number,
    "ArrivalWeek":order.arrivalWeek,
    "Client":order.client,
    "OrderId":order.orderId,
    "Checked":this.order.checked
  }
  this.display2 = "block";
}
openModal(id:number) {
  this.http.get(this.Api+"Order/Bullet?OrderId="+id).subscribe((data:any[])=>{
    this.bullit=data;
  });
  this.display = "block";
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
