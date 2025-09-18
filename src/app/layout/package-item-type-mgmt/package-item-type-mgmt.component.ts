import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { FilterServiceService } from "src/app/service/filter-service.service";

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
  allUsers: any[] = [];
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
    private api: ApiService,
    private fb: FormBuilder,
    private filterService: FilterServiceService
  ) {
    this.form = this.fb.group({
      domainId: [null],
      companyId: [null],
      from: [null],
      to: [null]
    });
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
      filters: {}
    };
    this.api.signUpUser(payload).subscribe({
      next: (res: any) => {
        this.allUsers = res.users;
        this.dataSource1 = [...res.users];
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
    this.domainCtrl.setValue('');
    this.form.patchValue({ domainId: null });

    this.pageIndex = 0;
    this.dataSource1 = [...this.allUsers];
    // this.getSignUpUsers();
  }
}
