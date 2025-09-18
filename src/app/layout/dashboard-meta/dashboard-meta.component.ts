import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import * as Chart from 'chart.js';

import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/api.service';
import { startWith, map } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard-meta',
  templateUrl: './dashboard-meta.component.html',
  styleUrls: ['./dashboard-meta.component.css']
})
export class DashboardMetaComponent {

  @ViewChild('chart2', { static: false }) chartRef2!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  comapinList: any[] = [];
  chart1: any;
  chart2: any;

  impressions = 0;
  clicks = 0;
  reach = 0;
  uniqueClicks = 0;

  totalScreenPageViews = 0;
  totalEngagedSessions = 0;
  campaignCtrl = new FormControl('');
  filteredCampaigns!: Observable<any[]>;
  filteredCampaignsList: any[] = [];
  showDropdown: boolean = false;
  domainCtrl = new FormControl('');
  showDomainDropdown = false;
  domainList: any[] = [
  ];
  filteredDomainList: any[] = [];
  mediumList: string[] = ['Facebook', 'Instagram', 'WhatsApp'];
  @HostListener('document:click', ['$event'])
  onClickOutside(event: any) {
    const clickedInside = event.target.closest('.dp-down');
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      domainId: [null],
      medium: ['Facebook'],
      companyId: [null],
      from: [null],
      to: [null]
    });
    Chart.register(...registerables);
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
    this.loadAnalyticsForMeta({});
    this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCampaigns(value || ''))
    );
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

  onMediumChange(event: any) {
    const medium = event.target.value;
    this.form.patchValue({ medium: medium });
    this.getComapinList(); // domain + medium dono jayenge
  }

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
  //   this.api.getDashBoardCompainList({ medium: "meta" }).subscribe({
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

  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) payload.campaignId = formValues.companyId;
    if (formValues.from) payload.from = new Date(formValues.from).toISOString();
    if (formValues.to) payload.to = new Date(formValues.to).toISOString();

    this.loadAnalyticsForMeta(payload);
  }


  loadAnalyticsForMeta(payload: any) {
    this.api.getDashboardMetaAnalytics(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const data = res.data;

          // ✅ Stats for top boxes
          this.impressions = data.totals?.impressions ?? 0;
          this.clicks = data.totals?.clicks ?? 0;
          this.reach = data.totals?.reach ?? 0;
          this.uniqueClicks = data.totals?.unique_clicks ?? 0;

          // ✅ Prepare chart data
          const graph = data.data; // 👈 array use karna hai
          const labels = graph.map((g: any) => g.date_start);

          const impressionsData = graph.map((g: any) => g.impressions);
          const clicksData = graph.map((g: any) => g.clicks);
          const spendData = graph.map((g: any) => g.spend);
          const uniqueClicksData = graph.map((g: any) => g.unique_clicks);
          const reachData = graph.map((g: any) => g.reach);

          const datasets = [
            {
              label: 'Impressions',
              data: impressionsData,
              borderColor: '#4caf50',
              backgroundColor: '#4caf50',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Clicks',
              data: clicksData,
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Spend',
              data: spendData,
              borderColor: '#ff9800',
              backgroundColor: '#ff9800',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Unique Clicks',
              data: uniqueClicksData,
              borderColor: '#9c27b0',
              backgroundColor: '#9c27b0',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Reach',
              data: reachData,
              borderColor: '#e91e63',
              backgroundColor: '#e91e63',
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
