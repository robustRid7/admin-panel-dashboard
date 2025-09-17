import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { AddEditDialogComponent } from '../common-dialog/add-edit-dialog/add-edit-dialog.component';
import { DeleteDialogComponent } from '../common-dialog/delete-dialog/delete-dialog.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FilterServiceService } from 'src/app/service/filter-service.service';
export interface PeriodicElement1 {
  s_no: number;
  name: string;
  french: string;
  kinyarwanda: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },
];

@Component({
  selector: 'app-bonus-page',
  templateUrl: './bonus-page.component.html',
  styleUrls: ['./bonus-page.component.css']
})
export class BonusPageComponent {
   Math = Math;
    totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 200;

  form: FormGroup;
  comapinList: any[] = [];
  campaignCtrl = new FormControl('');
  dataSource1: any = { data: [] };
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private filterService: FilterServiceService
  ) {
    this.form = this.fb.group({
      companyId: [null],
      from: [null],
      to: [null]
    });
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const clickedInside = event.target.closest('.dp-down');
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
  ngOnInit(): void {
    this.getComapinList();
    this.getSignUpUsers();
  }
  getComapinList() {
    this.api.getDashBoardCompainList({}).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        this.filteredCampaignsList = [...this.comapinList];
      }
    });
  }
  filterCampaigns() {
    const value = this.campaignCtrl.value?.toLowerCase() || '';
    if (!value) {
      this.filteredCampaignsList = [...this.comapinList];
    } else {
      this.filteredCampaignsList = this.comapinList.filter(c =>
        c.campaignId.toLowerCase().includes(value)
      );
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCampaign(c: any) {
    this.form.patchValue({ companyId: c._id });
    this.campaignCtrl.setValue(c.campaignId, { emitEvent: false });
    this.showDropdown = false;
  }

  getSignUpUsers() {
    const payload = {
      limit: this.pageSize,
      page: this.pageIndex + 1,
      filters: {} as any
    };
    this.api.bonusPageList(payload).subscribe({
      next: (res: any) => {
        this.dataSource1.data = res.users || [];
        this.totalRecords = res.pagination?.total || 0;
      }
    });
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = Number(event.pageSize);
    this.getSignUpUsers();
  }

  search() {
    const formValues = this.form.value;
    const filters: any = {};

    if (formValues.companyId) filters.campaignId = formValues.companyId;
    if (formValues.from) filters.from = new Date(formValues.from).toISOString();
    if (formValues.to) filters.to = new Date(formValues.to).toISOString();

    const payload = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      filters: filters
    };

    this.api.bonusPageList(payload).subscribe({
      next: (res: any) => {
        this.dataSource1.data = res.users || [];
        this.totalRecords = res.pagination?.total || 0;
      }
    });
  }
resetFilters() {
  this.form.reset();
  this.campaignCtrl.setValue('');
  this.form.patchValue({ companyId: null });

  this.pageIndex = 0;

  this.getSignUpUsers();
}

}
