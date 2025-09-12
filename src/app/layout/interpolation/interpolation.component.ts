import { Component } from '@angular/core';
import { DesignutilityService } from 'src/app/appServices/designutility.service';
// import { MessageService } from 'src/app/appServices/message.service';

@Component({
  selector: 'app-interpolation',
  templateUrl: './interpolation.component.html',
  styleUrls: ['./interpolation.component.css']
})
export class InterpolationComponent {

  product="Test";

  constructor( private _msgService : DesignutilityService ){

  }

  data: string = "HTML"

  inbuild: string = "this is uppercase method"

  inbuildLower: string = "THIS IS LOWERCASE METHOD"

  learn: string = "Interpolation in Angular"

  customMethod() {
    return "We Are learning " + this.learn
  }

  appStatus: boolean = false

  appStatus1: boolean = true
  status1 = 'Active';
  status2 = 'Inactive';

  btnClick(){
    this._msgService.messageAlert();
    // const msgService = new MessageService();
    // msgService.messageAlert()
  }

  ngOnInit(){
    this.product = this._msgService.product.id
  }
 
}
