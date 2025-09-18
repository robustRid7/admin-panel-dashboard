import { Component, HostListener, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterServiceService } from 'src/app/service/filter-service.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  form: FormGroup;
  campaignCtrl = new FormControl('');
  comapinList: any[] = [];
  filteredCampaigns: any[] = [];

  data: any[] = [];
  originalData: any[] = [];
  pageIndex = 0;
  pageSize = 200;
  totalRecords = 0;
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
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
      domainId: [null],
      companyId: [null],
      from: [null],
      to: [null]
    });
  }

  filterDomains() {
    const searchValue = this.domainCtrl.value?.toLowerCase() || '';
    this.filteredDomainList = this.domainList.filter(d =>
      d.domainName.toLowerCase().includes(searchValue) ||
      d.domainId.toString().includes(searchValue)
    );
    this.showDomainDropdown = true;
  }

  toggleDomainDropdown() {
    this.showDomainDropdown = !this.showDomainDropdown;
    if (this.showDomainDropdown) {
      this.filteredDomainList = [...this.domainList];
    }
  }

  ngOnInit(): void {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    this.form = this.fb.group({
      from: new FormControl(this.formatDate(sevenDaysAgo)),
      to: new FormControl(this.formatDate(today)),
    });

    this.getDomainList();
    this.getSignUpUsers();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getComapinList(domainId: string) {
    this.api.getDashBoardCompainList({ domain: domainId }).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        this.filteredCampaignsList = [...this.comapinList];
        this.campaignCtrl.setValue('');
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

  selectDomain(domain: any) {
    this.domainCtrl.setValue(domain.domainName || domain.domain);
    this.form.get('domainId')?.setValue(domain._id);
    this.showDomainDropdown = false;
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

        if (this.originalData.length == 0) {
          this.originalData = [...res.users];
          this.totalRecords = res.pagination.total;
        }
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
    this.domainCtrl.setValue('');
    this.form.patchValue({ domainId: null });
    this.campaignCtrl.setValue('');
    this.form.patchValue({ companyId: null });
    this.pageIndex = 0;
    this.data = [...this.originalData];
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
