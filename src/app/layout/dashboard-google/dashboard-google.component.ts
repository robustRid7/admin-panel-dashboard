import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import * as Chart from 'chart.js';

import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-google',
  templateUrl: './dashboard-google.component.html',
  styleUrls: ['./dashboard-google.component.css']
})
export class DashboardGoogleComponent {

  @ViewChild('chart2', { static: false }) chartRef2!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  comapinList: any[] = [];
  chart1: any;
  chart2: any;

  signupCount = 0;
  landingCount = 0;
  bonusCount = 0;
  totalActiveUsers = 0;
  totalSessions = 0;
  totalScreenPageViews = 0;
  totalEngagedSessions = 0;
  campaignCtrl = new FormControl('');
  filteredCampaigns!: Observable<any[]>;

  filteredCampaignsList: any[] = [];
  mediumList: string[] = ['Google', 'youtube'];

  showDropdown: boolean = false;
  allUsers: any[] = [];
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      domainId: [null],
      medium: ['Google'],
      companyId: [null],
      from: [null],
      to: [null]
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
    this.loadCounts({});
    this.loadAnalyticsForChart2({});
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
    this.domainCtrl.setValue(domain.domainName || domain.domain);
    this.form.get('domainId')?.setValue(domain._id);
    this.showDomainDropdown = false;
    this.getComapinList();
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


  // selectCampaign(event: any) {
  //   const selected = event.option.value;
  //   const campaign = this.comapinList.find(c => c.campaignId === selected);
  //   if (campaign) {
  //     this.form.patchValue({ companyId: campaign._id });
  //   }
  // }

  // ngAfterViewInit() {
  //   // Chart2 static hamesha render karega
  //   this.renderStaticChart();
  // }

  // getComapinList() {
  //   this.api.getDashBoardCompainList({ medium: "google" }).subscribe({
  //     next: (res: any) => {
  //       this.comapinList = res.data;
  //       this.filteredCampaignsList = [...this.comapinList];
  //       this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
  //         startWith(''), // 👈 yahi ensure karega ki dropdown khulte hi full list dikhe
  //         map(value => this._filterCampaigns(value || ''))
  //       );
  //     }
  //   });
  // }

  getComapinList() {
    const domainId = this.form.get('domainId')?.value;
    const medium = this.form.get('medium')?.value;

    if (!domainId || !medium) return;

    const payload: any = {
      domain: domainId,
      medium: medium
    };
    this.api.getDashBoardCompainList(payload).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        this.filteredCampaignsList = [...this.comapinList];
        this.campaignCtrl.setValue('');
      }
    });
  }

  onMediumChange(event: any) {
    const medium = event.target.value;
    this.form.patchValue({ medium: medium });
    this.getComapinList(); // domain + medium dono jayenge
  }



  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) payload.campaignId = formValues.companyId;
    if (formValues.from) {
      const fromDate = new Date(formValues.from);
      fromDate.setHours(0, 0, 0, 0);
      payload.from = fromDate.toISOString();
    }

    if (formValues.to) {
      const toDate = new Date(formValues.to);
      toDate.setHours(23, 59, 59, 999);
      payload.to = toDate.toISOString();
    }

    this.loadCounts(payload);
    this.loadAnalyticsForChart2(payload);
  }

  loadCounts(payload: any) {
    this.api.searchCountList(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.signupCount = res.data.userCount ?? 0;
          this.landingCount = res.data.landingPageCount ?? 0;
          this.bonusCount = res.data.bonusPageCount ?? 0;
        }
      }
    });
  }


  // loadAnalyticsForChart2(payload: any) {
  //   this.api.getDashboardThirdPartyAnalytics(payload).subscribe({
  //     next: (res: any) => {
  //       if (res?.data) {
  //         const data = res.data;

  //         // Set stats for top boxes
  //         this.totalActiveUsers = data.totalActiveUsers ?? 0;
  //         this.totalSessions = data.totalSessions ?? 0;
  //         this.totalScreenPageViews = data.totalScreenPageViews ?? 0;
  //         this.totalEngagedSessions = data.totalEngagedSessions ?? 0;

  //         // Prepare chart data
  //         const graph = data.graphData;
  //         const labels = graph.map((g: any) => g.date);

  //         const activeUsersData = graph.map((g: any) => g.activeUsers);
  //         const sessionsData = graph.map((g: any) => g.sessions);
  //         const pageViewsData = graph.map((g: any) => g.screenPageViews);
  //         const engagedSessionsData = graph.map((g: any) => g.engagedSessions);

  //         const datasets = [
  //           {
  //             label: 'Active Users',
  //             data: activeUsersData,
  //             borderColor: '#4caf50',
  //             backgroundColor: '#4caf50',
  //             fill: false,
  //             tension: 0.4
  //           },
  //           {
  //             label: 'Sessions',
  //             data: sessionsData,
  //             borderColor: '#2196f3',
  //             backgroundColor: '#2196f3',
  //             fill: false,
  //             tension: 0.4
  //           },
  //           {
  //             label: 'Page Views',
  //             data: pageViewsData,
  //             borderColor: '#ff9800',
  //             backgroundColor: '#ff9800',
  //             fill: false,
  //             tension: 0.4
  //           },
  //           {
  //             label: 'Engaged Sessions',
  //             data: engagedSessionsData,
  //             borderColor: '#9c27b0',
  //             backgroundColor: '#9c27b0',
  //             fill: false,
  //             tension: 0.4
  //           }
  //         ];

  //         if (this.chart2) this.chart2.destroy();
  //         if (this.chartRef2?.nativeElement) {
  //           this.chart2 = new Chart(this.chartRef2.nativeElement, {
  //             type: 'line',
  //             data: { labels, datasets },
  //             options: { responsive: true, maintainAspectRatio: false }
  //           });
  //         }
  //       }
  //     },
  //     error: (err: any) => { }
  //   });
  // }
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
          let graph = data.graphData || [];

          // ✅ Dates ko sort kar lo
          graph = graph.sort(
            (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

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
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: { autoSkip: true, maxTicksLimit: 10 } // zyada dates ho to skip
                  }
                }
              }
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

    //  this.dataSource1 = [...this.allUsers];
  }
}
