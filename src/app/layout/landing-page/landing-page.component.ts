import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { AddEditDialogComponent } from '../common-dialog/add-edit-dialog/add-edit-dialog.component';
import { DeleteDialogComponent } from '../common-dialog/delete-dialog/delete-dialog.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { FilterServiceService } from 'src/app/service/filter-service.service';
import { combineLatest } from 'rxjs';
export interface PeriodicElement1 {
  s_no: number;
  name: string;
  french: string;
  kinyarwanda: string;
  LName: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
    LName: "Lorem",
  },
];
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  form: FormGroup;
  campaignCtrl = new FormControl('');
  displayedColumns1: string[] = ["s_no", "name", "campaignName", "bonusId", "french", "kinyarwanda", "LName", "createdAt",];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);
  comapinList: any[] = [];
  filteredCampaigns: any[] = [];

  data: any[] = [];
  pageIndex = 0;
  pageSize = 200;
  totalRecords = 0;
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const clickedInside = event.target.closest('.dp-down');
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private filterService: FilterServiceService
  ) {
    this.form = this.fb.group({
      domainId: [''],
      companyId: [null],
      from: [null],
      to: [null]
    });
  }

  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];

  // On Input filter
  filterDomains() {
    const searchValue = this.domainCtrl.value?.toLowerCase() || '';
    this.filteredDomainList = this.domainList.filter(d =>
      d.domainName.toLowerCase().includes(searchValue) ||
      d.domainId.toString().includes(searchValue)
    );
    this.showDomainDropdown = true;
  }

  // Toggle dropdown
  toggleDomainDropdown() {
    this.showDomainDropdown = !this.showDomainDropdown;
    if (this.showDomainDropdown) {
      this.filteredDomainList = [...this.domainList];
    }
  }

  // Select domain
 


  ngOnInit(): void {
    this.getDomainList();
    // this.getComapinList();
    this.getSignUpUsers();

  }

  // getComapinList() {
  //   this.api.getDashBoardCompainList({}).subscribe({
  //     next: (res: any) => {
  //       this.comapinList = res.data || [];
  //       this.filteredCampaignsList = [...this.comapinList];
  //     }
  //   });
  // }

getComapinList(domainId: string) {
  this.api.getDashBoardCompainList({ domain: domainId }).subscribe({
    next: (res: any) => {
      this.comapinList = res.data || [];
      this.filteredCampaignsList = [...this.comapinList];
      this.campaignCtrl.setValue(''); // reset campaign search box
    }
  });
}

    getDomainList() {
    this.api.getDomainList({}).subscribe({
      next: (res: any) => {
        this.domainList = res.data || [];
        this.filteredDomainList = [...this.domainList];
        // this.filteredCampaignsList = [...this.comapinList];
      }
    });
  }

//  selectDomain(domain: any) {
//   this.domainCtrl.setValue(domain.domainName);
//   this.form.get('domainId')?.setValue(domain._id);
//   this.showDomainDropdown = false;

//   // ✅ Domain select hote hi campaigns laa lo
//   this.getComapinList(domain._id);
// }

selectDomain(domain: any) {
  // jo field tumhare API se aa rahi hai usko set karo
  this.domainCtrl.setValue(domain.domainName || domain.domain);  

  this.form.get('domainId')?.setValue(domain._id);
  this.showDomainDropdown = false;

  // ✅ Domain select hote hi campaigns laa lo
  this.getComapinList(domain._id);
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
    this.api.landingPageList(payload).subscribe({
      next: (res: any) => {
        this.data = res.users;
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
    this.api.landingPageList(payload).subscribe({
      next: (res: any) => {
        this.data = res.users;
        this.totalRecords = res.pagination.total;
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
  totalPages() {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getSignUpUsers();
    }
  }

  nextPage() {
    if (this.pageIndex + 1 < this.totalPages()) {
      this.pageIndex++;
      this.getSignUpUsers();
    }

  }
}
