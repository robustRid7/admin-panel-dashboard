import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FilterServiceService {

  private filtersSource = new BehaviorSubject<any>({});
  filters$ = this.filtersSource.asObservable();

  setFilters(filters: any) {
    this.filtersSource.next(filters);
  }

  getCurrentFilters() {
    return this.filtersSource.value;
  }
}
