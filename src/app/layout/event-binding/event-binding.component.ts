import { Component } from '@angular/core';
import { DesignutilityService } from 'src/app/appServices/designutility.service';

@Component({
  selector: 'app-event-binding',
  templateUrl: './event-binding.component.html',
  styleUrls: ['./event-binding.component.css']
})
export class EventBindingComponent {
msg:string="";
onAddCart(){
  this.msg="Product is added"
}

onInputClick(event: any){
  console.log(event.target.value);
}

msg1:any;
getCartData(event:any){
  console.log(event.target , "rerer") ;
  
  this.msg1= event.target.value + " Added in cart";
}

constructor(private _msgService : DesignutilityService){}
product:any={};
productList1:any={};


ngOnInit(){
  this.product=this._msgService.product;
  this.productList1=this._msgService.productList;

}





}
