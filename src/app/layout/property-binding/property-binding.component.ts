import { Component } from '@angular/core';
import { DesignutilityService } from 'src/app/appServices/designutility.service';
// import { MessageService } from 'src/app/appServices/message.service';
@Component({
  selector: 'app-property-binding',
  templateUrl: './property-binding.component.html',
  styleUrls: ['./property-binding.component.css']
})
export class PropertyBindingComponent {

  constructor( private _msgService : DesignutilityService){}



  data:string = "Angular"

  enable:boolean=false

  status1="Active";
  status2="Inctive";

btnClick(){
  this._msgService.messageAlert();
}

product = "test"

ngOnInit(){
  this.product = this._msgService.product.name
}

}
