import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DesignutilityService {
  constructor() {}

  messageAlert() {
    alert('Thanks for subscribe.');
  }

  product :any= 
    { name: 'Mobile', id: '1020' }


  productList :any= [
    { username: 'Dheeraj ', id: '1' },
    { username: 'Ashish', id: '2' },
    { username: 'Peeyush', id: '3' },
    { username: 'Somendra', id: '4' },

  ];
}
