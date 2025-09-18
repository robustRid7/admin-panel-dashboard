import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FilterServiceService } from 'src/app/service/filter-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart1', { static: false }) chartRef1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart2', { static: false }) chartRef2!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  comapinList: any[] = [];
  chart1: any;
  chart2: any;
  campaignCtrl = new FormControl('');
  filteredCampaigns!: Observable<any[]>;
  signupCount = 0;
  landingCount = 0;
  bonusCount = 0;
  whatsupCount = 0;
  totalActiveUsers = 0;
  totalSessions = 0;
  totalScreenPageViews = 0;
  totalEngagedSessions = 0;
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;
  allUsers: any[] = [];
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
  mediumList: string[] = ['Google', 'Facebook', 'Instagram', 'youtube', 'Telegram', 'IMO', 'TikTok', 'whatsApp'];

  constructor(private fb: FormBuilder,
    private api: ApiService,
    private filterService: FilterServiceService
  ) {
    this.form = this.fb.group({
      domainId: [null],
      companyId: [null],
      from: [null],
      to: [null],
      medium: [''],
    });
    Chart.register(...registerables);
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
    this.loadAnalytics({});

    this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCampaigns(value || ''))
    );


  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private _filterCampaigns(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (!filterValue) {
      // agar kuch type nahi kiya -> full list dikhao
      return this.comapinList;
    }
    return this.comapinList.filter(c =>
      c.campaignId.toLowerCase().includes(filterValue)
    );
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


  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) payload.campaignId = formValues.companyId;
    if (formValues.from) payload.from = new Date(formValues.from).toISOString();
    if (formValues.to) payload.to = new Date(formValues.to).toISOString();

    this.filterService.setFilters(payload);

    //this.loadCounts(payload);
    this.loadAnalytics(payload);
    this.loadAnalyticsForChart2(payload);
  }


  loadAnalytics(payload: any) {
    this.api.getDashboardAnalytics(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          // 1. Collect all dates from all datasets
          this.signupCount = res?.data?.totals.userCount;
          this.landingCount = res?.data?.totals.landingPageUserCount;
          this.bonusCount = res?.data?.totals.bonusPageUserCount;
          this.whatsupCount = res?.data?.totals.whatsAppUserCount
          const allDates = [
            ...res.data.users.map((u: any) => u.date),
            ...res.data.landingPageUsers.map((u: any) => u.date),
            ...res.data.bonusPageUsers.map((u: any) => u.date),
            ...res.data.whatsAppUsers.map((u: any) => u.date)
          ];

          // Unique sorted dates
          const labels = Array.from(new Set(allDates)).sort();

          // 2. Helper fn to get count by date
          const mapData = (arr: any[]) =>
            labels.map(date => {
              const found = arr.find(d => d.date === date);
              return found ? found.count : 0;
            });

          // 3. Build datasets
          const signupData = mapData(res.data.users);
          const landingData = mapData(res.data.landingPageUsers);
          const bonusData = mapData(res.data.bonusPageUsers);
          const whatsupData = mapData(res.data.whatsAppUsers);

          const datasets = [
            {
              label: 'Signup Users',
              data: signupData,
              borderColor: '#4caf50',
              backgroundColor: '#4caf50',
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Landing Page Users',
              data: landingData,
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Bonus Page Users',
              data: bonusData,
              borderColor: '#ff9800',
              backgroundColor: '#ff9800',
              fill: false,
              tension: 0.4,
            },

            {
              label: 'Whatsup Users',
              data: whatsupData,
              borderColor: '#6610f2',
              backgroundColor: '#6610f2',
              fill: false,
              tension: 0.4,
            },
          ];

          // 4. Destroy old chart
          if (this.chart1) this.chart1.destroy();

          // 5. Create new chart
          if (this.chartRef1?.nativeElement) {
            this.chart1 = new Chart(this.chartRef1.nativeElement, {
              type: 'line',
              data: { labels, datasets },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: { mode: 'index', intersect: false },
                  legend: { position: 'bottom' }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false },
                scales: {
                  x: { title: { display: true, text: 'Date' } },
                  y: { title: { display: true, text: 'Count' }, beginAtZero: true }
                }
              }
            });
          }
        }
      },
      error: (err: any) => { }
    });
  }

  loadAnalyticsForChart2(payload: any) {
    this.api.getDashboardThirdPartyAnalytics(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const data = res.data;

          // Set stats for top boxes
          this.totalActiveUsers = data.totalActiveUsers ?? 0;
          this.totalSessions = data.totalSessions ?? 0;
          this.totalScreenPageViews = data.totalScreenPageViews ?? 0;
          this.totalEngagedSessions = data.totalEngagedSessions ?? 0;

          // Prepare chart data
          const graph = data.graphData;
          const labels = graph.map((g: any) => g.date);

          const activeUsersData = graph.map((g: any) => g.activeUsers);
          const sessionsData = graph.map((g: any) => g.sessions);
          const pageViewsData = graph.map((g: any) => g.screenPageViews);
          const engagedSessionsData = graph.map((g: any) => g.engagedSessions);

          const datasets = [
            {
              label: 'Active Users',
              data: activeUsersData,
              borderColor: '#4caf50',
              backgroundColor: '#4caf50',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Sessions',
              data: sessionsData,
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Page Views',
              data: pageViewsData,
              borderColor: '#ff9800',
              backgroundColor: '#ff9800',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Engaged Sessions',
              data: engagedSessionsData,
              borderColor: '#9c27b0',
              backgroundColor: '#9c27b0',
              fill: false,
              tension: 0.4
            }
          ];

          if (this.chart2) this.chart2.destroy();
          if (this.chartRef2?.nativeElement) {
            this.chart2 = new Chart(this.chartRef2.nativeElement, {
              type: 'line',
              data: { labels, datasets },
              options: { responsive: true, maintainAspectRatio: false }
            });
          }
        }
      },
      error: (err: any) => { }
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

  selectCampaign(campaign: any) {
    this.campaignCtrl.setValue(campaign.campaignId);
    this.form.patchValue({ companyId: campaign._id });
    this.showDropdown = false;
  }
  resetFilters() {
    this.form.reset();
    this.campaignCtrl.setValue('');
    this.form.patchValue({ companyId: null });
    this.domainCtrl.setValue('');
    this.form.patchValue({ domainId: null });

    // this.pageIndex = 0;
  }
}
