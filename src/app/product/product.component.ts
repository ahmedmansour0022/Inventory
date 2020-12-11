import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product:any[];
  Package:any[];
  error:boolean=false;
  Brand:any[];
  Vairte:any[];
  temp:any[];
  deleteid=0;
  public now: Date = new Date();
  Harvest:any[];
  display = "none";
  display2 = "none";
  display3 = "none";
  display4 = "none";
  id:number;
      imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
    interval:any;
  cols: any[];
  counter=0;
  model:any={};
  order:any={};
  Api="http://iinventory-001-site1.itempurl.com/api/";
  selectedProducts: any[]=[];
  _selectedColumns: any[];
  exportColumns: any[];
  loading: boolean = true;
  exporthead:any[];
  statuses = [
    {label: 'Sold', value: 3},
    {label: 'Avalilable', value: 1},
    {label: 'Pending', value: 2}
];
   products2:any[]=[];
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
    ]
    this.http.get(this.Api + "Reception/Cart?ComapnyId="+this.id).subscribe((data: any[]) => {
      this.products2=data;
    });
   this.http.get(this.Api+"Product?CompanyId="+this.id).subscribe((data:any[])=>{     
     this.product=data;
   });
   this.http.get(this.Api+"Package?CompanyId="+this.id).subscribe((data:any[])=>{
     this.Package=data;
  });
  this.http.get(this.Api+"Brand?CompanyId="+this.id).subscribe((data:any[])=>{
    this.Brand=data;
  });
  this.http.get(this.Api+"Vairte?CompanyId="+this.id).subscribe((data:any[])=>{
    console.log(data);
    this.Vairte=data;
  });
  this.http.get(this.Api+"Harvest?ComapnyId="+this.id).subscribe((data:any[])=>{
    console.log(data);
    this.Harvest=data;
  });
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
pauseTimeLine() {
  console.log("Finshed");
  clearInterval(this.interval);
}
delete(){
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  let params = new HttpParams();
  params = params.append('bulletId', this.deleteid.toString());
  this.http.delete(this.Api+"Reception",{headers:headers,params:params}).subscribe((data:any)=>{
    this.http.get(this.Api + "Reception/Cart?ComapnyId="+this.id).subscribe((data: any[]) => {
      this.products2=data;
    });
    this.display3 = "none";
  })
}
counterfun(){
  this.counter=this.selectedProducts.length;
}
openModal() {
  this.model={};
  this.display = "block";
}
onCloseHandled() {
  this.display = "none";
}
openModal2() {
  this.display2 = "block";
}
onCloseHandled2() {
  this.display2 = "none";
}
openModal4(product:any) {
  this.model={
    "bulletId":product.bulletId,
    "product":product.product,
    "package":product.package,
    "brand":product.brand,
    "vairte":product.vairte,
    "harvestId":product.harvestId,
    "class":product.class,
    "quantity":product.quantity,
    "size":product.size,
    "image":product.image
  };
  this.display4 = "block";
}
onCloseHandled4() {
  this.model={};
  this.display4 = "none";
}
openModal3(id:number) {
  this.deleteid=id;
  this.display3 = "block";
}
onCloseHandled3() {
  this.display3 = "none";
}
onSubmitU(){  
  const body={
    "BulletId":this.model.bulletId,
    "HarvestId":Number.parseInt(this.model.harvestId),
    "Product":this.model.product,
    "Brand":this.model.brand,
    "Vairte":this.model.vairte,
    "Package":this.model.package,
    "Class":this.model.class,
    "Size":this.model.size,
    "Quantity":this.model.quantity,
    "CompanyId":this.id
  };
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  this.http.put(this.Api+"Reception",body,{headers:headers}).subscribe((data:any)=>{
    console.log("done");
    let index = this.products2.findIndex(x=>x.bulletId == this.model.bulletId);
    this.products2[index].harvestId=Number.parseInt(this.model.harvestId);
    this.products2[index].product=this.model.product;
    this.products2[index].brand=this.model.brand;
    this.products2[index].vairte=this.model.vairte;
    this.products2[index].package=this.model.package;
    this.products2[index].class=this.model.class;
    this.products2[index].quantity=this.model.quantity;
    this.model={};
    this.display4="none";
  },(error)=>{
    console.log(error);
  })
}
onOrder(){
  if(this.selectedColumns.length>21){
    this.error=false;
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  let params = new HttpParams();
  params = params.append('date', new Date().toJSON("dd/MM/yyyy hh:mm a"));
  const body = {
    "Number":this.order.Number,
    "ArrivalWeek":this.order.ArrivalWeek,
    "Client":this.order.Client,
    "Checked":0,
    "CompanyId":this.id
  }
  if(this.selectedProducts.length>0){
  this.selectedProducts.forEach(element => {
    console.log(element.bulletId);
    this.http.post(this.Api+"Cart?BulletId="+element.bulletId+"&CompanyId="+this.id+"&Time"+new Date().toJSON("dd/MM/yyyy hh:mm a")
    ,{headers:headers}).subscribe((data:any)=>{
      let index = this.products2.findIndex(x=>x.bulletId == element.bulletId);
      this.products2.splice(index,1);
      console.log("done");
    },(erorr)=>{
      console.log(erorr);
      
    })
  });
}
  this.http.post(this.Api+"Order",body,{headers:headers,params:params}).subscribe((data:any)=>{
    console.log("order done");
    this.http.get(this.Api + "Reception/Cart?ComapnyId="+this.id).subscribe((data: any[]) => {
      this.products2=data;
      this.selectedProducts=[];
      this.counter=0
      this.display2="none"
    },(error)=>{
      console.log(error);
    }
    );
  })
}else{
  this.error=true;
}
}
logout(){
  localStorage.clear();
  this.router.navigate(['/Login']);
}

onSubmit(){
  this.now=new Date();
  const body={
    "HarvestId":Number.parseInt(this.model.HarvestId),
    "Product":this.model.Product,
    "Brand":this.model.Brand,
    "Vairte":this.model.Vairte,
    "Package":this.model.Package,
    "Class":this.model.Class,
    "Size":this.model.Size,
    "Quantity":this.model.Quantity,
    "Image":this.isImageSaved?this.cardImageBase64:"null",
    "CompanyId":this.id
  };
  console.log(body);
  const headers = new HttpHeaders();
  headers.append('Content-Type', 'multipart/form-data');
  headers.append('Accept', 'application/json');
  let params = new HttpParams();
  params = params.append('Time', new Date().toJSON("dd/MM/yyyy hh:mm a"));
  this.http.post(this.Api+"Reception",body,{headers:headers,params:params}).subscribe((data:any)=>{
    this.http.get(this.Api + "Reception/Cart?ComapnyId="+this.id).subscribe((data: any[]) => {
      this.products2=data;
    });  
  },(error)=>{
    console.log(error);
  });
  console.log(this.model)
  this.model={};
  this.cardImageBase64 = null;
  this.isImageSaved = false;
  this.display = "none";
}

set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
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
fileChangeEvent(fileInput: any) {
  this.imageError = null;
  if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
          this.imageError =
              'Maximum size allowed is ' + max_size / 1000 + 'Mb';

          return false;
      }

      if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
          this.imageError = 'Only Images are allowed ( JPG | PNG )';
          return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
              const img_height = rs.currentTarget['height'];
              const img_width = rs.currentTarget['width'];

              console.log(img_height, img_width);


              if (img_height > max_height && img_width > max_width) {
                  this.imageError =
                      'Maximum dimentions allowed ' +
                      max_height +
                      '*' +
                      max_width +
                      'px';
                  return false;
              } else {
                  const imgBase64Path = e.target.result;
                  this.cardImageBase64 = imgBase64Path;
                  this.isImageSaved = true;
                  // this.previewImagePath = imgBase64Path;
              }
          };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
  }
}

removeImage() {
  this.cardImageBase64 = null;
  this.isImageSaved = false;
}

}
