import { Component, HostListener, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FilterServiceService } from 'src/app/service/filter-service.service';

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
  allUsers: any[] = [];
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
  mediumList: string[] = ['Google', 'Facebook', 'Instagram', 'youtube', 'Telegram', 'IMO', 'TikTok', 'whatsApp'];

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private filterService: FilterServiceService
  ) {
    this.form = this.fb.group({
      domainId: [null],
      companyId: [null],
      from: [null],
      to: [null],
      medium: [null],
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
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    this.form.patchValue({
      from: this.formatDate(sevenDaysAgo),
      to: this.formatDate(today),
    });

    this.getDomainList();
    this.getSignUpUsers();
  }


  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
    // jo field tumhare API se aa rahi hai usko set karo
    this.domainCtrl.setValue(domain.domainName || domain.domain);
    this.form.get('domainId')?.setValue(domain._id);
    this.showDomainDropdown = false;

    this.getComapinList(domain._id);
  }

  toggleDomainDropdown() {
    this.showDomainDropdown = !this.showDomainDropdown;
    if (this.showDomainDropdown) {
      this.filteredDomainList = [...this.domainList];
    }
  }

  filterDomains() {
    const searchValue = this.domainCtrl.value?.toLowerCase() || '';
    this.filteredDomainList = this.domainList.filter(d =>
      d.domainName.toLowerCase().includes(searchValue) ||
      d.domainId.toString().includes(searchValue)
    );
    this.showDomainDropdown = true;
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
        this.allUsers = res.users;
        this.dataSource1 = this.allUsers;
        this.totalRecords = res.pagination.total;
      }
    });
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

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = Number(event.pageSize);
    this.getSignUpUsers();
  }

  // search() {
  //   const formValues = this.form.value;
  //   const filters: any = {};

  //   if (formValues.companyId) filters.campaignId = formValues.companyId;
  //   if (formValues.from) filters.from = new Date(formValues.from).toISOString();
  //   if (formValues.to) filters.to = new Date(formValues.to).toISOString();

  //   const payload = {
  //     page: this.pageIndex + 1,
  //     limit: this.pageSize,
  //     filters: filters
  //   };
  //   console.log(filters, "shhshshs");

  //   this.api.bonusPageList(payload).subscribe({
  //     next: (res: any) => {
  //       this.dataSource1=[...res.users]
  //       this.totalRecords = res.pagination?.total || 0;
  //     }
  //   });
  // }

  search() {
    const formValues = this.form.value;
    const filters: any = {};

    if (formValues.companyId) filters.campaignId = formValues.companyId;

    if (formValues.from) {
      const fromDate = new Date(formValues.from);
      fromDate.setHours(0, 0, 0, 0);
      filters.from = fromDate.toISOString();
    }

    if (formValues.to) {
      const toDate = new Date(formValues.to);
      toDate.setHours(23, 59, 59, 999);
      filters.to = toDate.toISOString();
    }

    const payload = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      filters: filters
    };

    this.api.bonusPageList(payload).subscribe({
      next: (res: any) => {
        this.dataSource1 = [...res.users];
        this.totalRecords = res.pagination?.total || 0;
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

    this.dataSource1 = [...this.allUsers];
  }


  changePage(newPage: number) {
    if (newPage < 0 || newPage * this.pageSize >= this.totalRecords) return;
    this.pageIndex = newPage;
    this.getSignUpUsers();
  }

}
