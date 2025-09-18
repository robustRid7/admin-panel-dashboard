import { Component, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { FilterServiceService } from 'src/app/service/filter-service.service';

@Component({
  selector: 'app-whats-up-users',
  templateUrl: './whats-up-users.component.html',
  styleUrls: ['./whats-up-users.component.css']
})

export class WhatsUpUsersComponent {
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
  form: FormGroup;
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 200;

  comapinList: any[] = [];
  campaignCtrl = new FormControl('');
  filteredCampaigns: any[] = [];

  dataSource1: any[] = [];
  showDropdown: boolean = false;
  filteredCampaignsList: any[] = [];
  allUsers: any[] = [];
  mediumList: string[] = ['Google', 'Facebook', 'Instagram', 'youtube', 'Telegram', 'IMO', 'TikTok', 'whatsApp'];

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
      domainId: [null],
      companyId: [null],
      from: [null],
      to: [null],
      medium: [''],
    });
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
    this.getWhatsUpUsers();
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

  getComapinList(domainId: string) {
    this.api.getDashBoardCompainList({ domain: domainId }).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        this.filteredCampaignsList = [...this.comapinList];
        this.campaignCtrl.setValue('');
      }
    });
  }


  selectCampaign(c: any) {
    this.form.patchValue({ companyId: c._id });
    this.campaignCtrl.setValue(c.campaignId, { emitEvent: false });
    this.showDropdown = false;

  }

  getWhatsUpUsers() {
    const payload = {
      limit: this.pageSize,
      page: this.pageIndex + 1,
      filters: {}
    };
    this.api.getWhatsUpUserList(payload).subscribe({
      next: (res: any) => {
        this.allUsers = res.users;
        this.dataSource1 = [...res.users];
        this.totalRecords = res.pagination.total;
      }
    });
  }

  changePage(newPage: number) {
    if (newPage < 0 || newPage * this.pageSize >= this.totalRecords) return;
    this.pageIndex = newPage;
    this.getWhatsUpUsers();
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
    this.api.getWhatsUpUserList(payload).subscribe({
      next: (res: any) => {
        this.dataSource1 = res.users;
        this.totalRecords = res.pagination.total;
      }
    });
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  resetFilters() {
    this.form.reset();
    this.campaignCtrl.setValue('');
    this.form.patchValue({ companyId: null });
    this.domainCtrl.setValue('');
    this.form.patchValue({ domainId: null });

    this.pageIndex = 0;

    this.dataSource1 = [...this.allUsers];
  }
}
