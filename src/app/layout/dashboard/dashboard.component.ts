import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  totalActiveUsers = 0;
  totalSessions = 0;
  totalScreenPageViews = 0;
  totalEngagedSessions = 0;
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      companyId: [null],
      from: [null],
      to: [null]
    });
    Chart.register(...registerables);
  }

  // ngOnInit(): void {
  //   this.getComapinList();
  //   this.loadCounts({});
  //   this.loadAnalytics({});
  //   this.loadAnalyticsForChart2({});
  // }

  ngOnInit(): void {
    this.getComapinList();
    //this.loadCounts({});
    this.loadAnalytics({});
    // this.loadAnalyticsForChart2({});

    this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCampaigns(value || ''))
    );
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



  // ngAfterViewInit() {
  //   // Chart2 static hamesha render karega
  //   this.renderStaticChart();
  // }

  getComapinList() {
    this.api.getDashBoardCompainList({}).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
          startWith(''), // 👈 yahi ensure karega ki dropdown khulte hi full list dikhe
          map(value => this._filterCampaigns(value || ''))
        );
      }
    });
  }


  selectCampaign(event: any) {
    const selected = this.comapinList.find(c => c.campaignId === event.option.value);
    this.form.patchValue({ companyId: selected?._id });
  }

  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) payload.campaignId = formValues.companyId;
    if (formValues.from) payload.from = new Date(formValues.from).toISOString();
    if (formValues.to) payload.to = new Date(formValues.to).toISOString();

    //this.loadCounts(payload);
    this.loadAnalytics(payload);
    this.loadAnalyticsForChart2(payload);
  }

  // loadCounts(payload: any) {
  //   this.api.searchCountList(payload).subscribe({
  //     next: (res: any) => {
  //       if (res?.data) {
  //         this.signupCount = res.data.userCount ?? 0;
  //         this.landingCount = res.data.landingPageCount ?? 0;
  //         this.bonusCount = res.data.bonusPageCount ?? 0;
  //       }
  //     }
  //   });
  // }

  loadAnalytics(payload: any) {
    this.api.getDashboardAnalytics(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          // 1. Collect all dates from all datasets
            this.signupCount = res?.data?.totals.userCount;
            this.landingCount = res?.data?.totals.landingPageUserCount;
            this.bonusCount = res?.data?.totals.bonusPageUserCount;
          const allDates = [
            ...res.data.users.map((u: any) => u.date),
            ...res.data.landingPageUsers.map((u: any) => u.date),
            ...res.data.bonusPageUsers.map((u: any) => u.date),
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


  // renderStaticChart() {
  //   const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  //   const datasets = [
  //     {
  //       label: 'Static Signup',
  //       data: [10, 20, 15, 25, 30],
  //       borderColor: '#4caf50',
  //       backgroundColor: '#4caf50',
  //       fill: false,
  //       tension: 0.4
  //     },
  //     {
  //       label: 'Static Landing',
  //       data: [5, 10, 8, 12, 15],
  //       borderColor: '#2196f3',
  //       backgroundColor: '#2196f3',
  //       fill: false,
  //       tension: 0.4
  //     },
  //     {
  //       label: 'Static Bonus',
  //       data: [3, 7, 6, 9, 12],
  //       borderColor: '#ff9800',
  //       backgroundColor: '#ff9800',
  //       fill: false,
  //       tension: 0.4
  //     }
  //   ];

  //   if (this.chart2) this.chart2.destroy();
  //   if (this.chartRef2?.nativeElement) {
  //     this.chart2 = new Chart(this.chartRef2.nativeElement, {
  //       type: 'line',
  //       data: { labels, datasets },
  //       options: { responsive: true, maintainAspectRatio: false }
  //     });
  //   }
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




}
