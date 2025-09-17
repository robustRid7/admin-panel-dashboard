import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../common-dialog/delete-dialog/delete-dialog.component";
import { AddEditDialogComponent } from "../common-dialog/add-edit-dialog/add-edit-dialog.component";
import { ApiService } from "src/app/service/api.service";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators';
import { FilterServiceService } from "src/app/service/filter-service.service";
// import { ViewDialogComponent } from "../common-dialog/view-dialog/view-dialog.component";

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
  selector: 'app-package-item-type-mgmt',
  templateUrl: './package-item-type-mgmt.component.html',
  styleUrls: ['./package-item-type-mgmt.component.css']
})
export class PackageItemTypeMgmtComponent implements OnInit {
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 100;

  form: FormGroup;
  comapinList: any[] = [];
  campaignCtrl = new FormControl('');
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;

  dataSource1: any[] = [];
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const clickedInside = event.target.closest('.dp-down');
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
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
      filters: {}
    };
    this.api.signUpUser(payload).subscribe({
      next: (res: any) => {
        this.dataSource1 = res.users;
        this.totalRecords = res.pagination.total;
      }
    });
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
    this.api.signUpUser(payload).subscribe({
      next: (res: any) => {
        this.dataSource1 = res.users;
        this.totalRecords = res.pagination.total;
      }
    });
  }

  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalRecords) {
      this.pageIndex++;
      this.search();
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.search();
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
  resetFilters() {
  this.form.reset();
  this.campaignCtrl.setValue('');
  this.form.patchValue({ companyId: null });

  this.pageIndex = 0;

  this.getSignUpUsers();
}
}
