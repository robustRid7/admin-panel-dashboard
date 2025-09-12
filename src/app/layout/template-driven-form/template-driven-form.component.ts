import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven-form',
  templateUrl: './template-driven-form.component.html',
  styleUrls: ['./template-driven-form.component.css']
})
export class TemplateDrivenFormComponent {

  defaultCourse="Css";
onSubmit(form:NgForm){
  console.log(form);
  
}

defaultGender='Male';

userName:string='';
  genders=[
    {id:'1', value:'Male'},
    {id:'2', value:'Female'},

  ]
}
