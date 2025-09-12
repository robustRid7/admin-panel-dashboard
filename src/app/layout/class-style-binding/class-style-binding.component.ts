import { Component } from '@angular/core';

@Component({
  selector: 'app-class-style-binding',
  templateUrl: './class-style-binding.component.html',
  styleUrls: ['./class-style-binding.component.css']
})
export class ClassStyleBindingComponent {

mypro:boolean=false;

mystyle="100px"


mystylecolor="green";

isOnline:boolean=true;


multiClasses = {
  customclass1:true,
  customclass2:false,
  customclass3:true,
}


multiStyle={
  'background-color':'red',
  'width':'150px',
  'height':'150px',
  'border-radius':'10px',
  'display':'flex',
  'align-items':'center',
  'justify-content':'center',
  'text-align':'center',
  'color':'#fff'
}

}
