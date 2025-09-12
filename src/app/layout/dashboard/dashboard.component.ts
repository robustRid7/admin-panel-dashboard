import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
//  @ViewChild('chart1', { static: false }) chartRef1!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('chart2', { static: false }) chartRef2!: ElementRef<HTMLCanvasElement>;
//   form: FormGroup;
//   comapinList: any[] = [];
//   chart: any;
//    chart1: any;
//   chart2: any;
//   companies = [
//     // { id: 1, name: 'Company A' },
//     // { id: 2, name: 'Company B' },
//     // { id: 3, name: 'Company C' },
//   ];

//   // sample counts
//   signupCount = 0;
//   landingCount = 0;
//   bonusCount = 0;

//   ngAfterViewInit() {
//   this.updateCharts();
// }


//   constructor(private fb: FormBuilder,
//     private api: ApiService
//   ) {
//     this.form = this.fb.group({
//       companyId: [null],
//       from: [null],
//       to: [null]
//     });
//     Chart.register(...registerables);
//   }
//   ngOnInit(): void {
//     this.getComapinList();
//     this.api.searchCountList({}).subscribe({
//       next: (res: any) => {
//         if (res?.data) {
//           this.signupCount = res.data.userCount ?? 0;
//           this.landingCount = res.data.landingPageCount ?? 0;
//           this.bonusCount = res.data.bonusPageCount ?? 0;
//         }
//       },
//       error: (err: any) => { }
//     });

//       this.loadCounts({});
//   }

//   getComapinList() {
//     this.api.getDashBoardCompainList({}).subscribe({
//       next: (res: any) => {
//         this.comapinList = res.data
//       }
//     })
//   }

//   search() {
//     const formValues = this.form.value;
//     const payload: any = {};

//     if (formValues.companyId) {
//       payload.campaignId = formValues.companyId;
//     }
//     if (formValues.from) {
//       payload.from = new Date(formValues.from).toISOString();
//     }
//     if (formValues.to) {
//       payload.to = new Date(formValues.to).toISOString();
//     }

//     this.api.searchCountList(payload).subscribe({
//       next: (res: any) => {
//         if (res?.data) {
//           this.signupCount = res.data.userCount ?? 0;
//           this.landingCount = res.data.landingPageCount ?? 0;
//           this.bonusCount = res.data.bonusPageCount ?? 0;
//         }
//       },
//       error: (err: any) => { }
//     });
//   }


//     loadCounts(payload: any) {
//     this.api.searchCountList(payload).subscribe({
//       next: (res: any) => {
//         if (res?.data) {
//           this.signupCount = res.data.userCount ?? 0;
//           this.landingCount = res.data.landingPageCount ?? 0;
//           this.bonusCount = res.data.bonusPageCount ?? 0;
//           this.updateCharts();
//         }
//       },
//       error: (err: any) => {}
//     });
//   }

// updateCharts() {
//   // X-axis labels (jaise din/mahine)
//   const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

//   // Dummy multiple data points for each line
//   const datasets = [
//     { 
//       label: 'Signup Users', 
//       data: [10, 20, 15, 30, 25, 40], 
//       borderColor: '#4caf50', 
//       backgroundColor: '#4caf50', 
//       fill: false, 
//       tension: 0.4 
//     },
//     { 
//       label: 'Landing Page Count', 
//       data: [5, 15, 10, 20, 18, 22], 
//       borderColor: '#2196f3', 
//       backgroundColor: '#2196f3', 
//       fill: false, 
//       tension: 0.4 
//     },
//     { 
//       label: 'Bonus Page Count', 
//       data: [8, 12, 18, 25, 20, 30], 
//       borderColor: '#ff9800', 
//       backgroundColor: '#ff9800', 
//       fill: false, 
//       tension: 0.4 
//     }
//   ];

//   const config1: any = {
//     type: 'line',
//     data: { labels, datasets },
//     options: { responsive: true, maintainAspectRatio: false }
//   };

//   const config2: any = {
//     type: 'bar',
//     data: { labels, datasets },
//     options: { responsive: true, maintainAspectRatio: false }
//   };

//   if (this.chart1) this.chart1.destroy();
//   if (this.chart2) this.chart2.destroy();

//   if (this.chartRef1?.nativeElement) {
//     this.chart1 = new Chart(this.chartRef1.nativeElement, config1);
//   }
//   if (this.chartRef2?.nativeElement) {
//     this.chart2 = new Chart(this.chartRef2.nativeElement, config2);
//   }
// }










 @ViewChild('chart1', { static: false }) chartRef1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chart2', { static: false }) chartRef2!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  comapinList: any[] = [];
  chart1: any;
  chart2: any;

  signupCount = 0;
  landingCount = 0;
  bonusCount = 0;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      companyId: [null],
      from: [null],
      to: [null]
    });
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getComapinList();
    this.loadCounts({});
    this.loadAnalytics({});
  }

  ngAfterViewInit() {
    // Chart2 static hamesha render karega
    this.renderStaticChart();
  }

  getComapinList() {
    this.api.getDashBoardCompainList({}).subscribe({
      next: (res: any) => {
        this.comapinList = res.data;
      }
    });
  }

  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) payload.campaignId = formValues.companyId;
    if (formValues.from) payload.from = new Date(formValues.from).toISOString();
    if (formValues.to) payload.to = new Date(formValues.to).toISOString();

    this.loadCounts(payload);
    this.loadAnalytics(payload);
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

  loadAnalytics(payload: any) {
    this.api.getDashboardAnalytics(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          const labels: string[] = res.data.users.map((u: any) => u.date);

          const signupData = res.data.users.map((u: any) => u.count);
          const landingData = res.data.landingPageUsers.map((u: any) => u.count);
          const bonusData = res.data.bonusPageUsers.map((u: any) => u.count);

          const datasets = [
            {
              label: 'Signup Users',
              data: signupData,
              borderColor: '#4caf50',
              backgroundColor: '#4caf50',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Landing Page Users',
              data: landingData,
              borderColor: '#2196f3',
              backgroundColor: '#2196f3',
              fill: false,
              tension: 0.4
            },
            {
              label: 'Bonus Page Users',
              data: bonusData,
              borderColor: '#ff9800',
              backgroundColor: '#ff9800',
              fill: false,
              tension: 0.4
            }
          ];

          if (this.chart1) this.chart1.destroy();
          if (this.chartRef1?.nativeElement) {
            this.chart1 = new Chart(this.chartRef1.nativeElement, {
              type: 'line',
              data: { labels, datasets },
              options: { responsive: true, maintainAspectRatio: false }
            });
          }
        }
      },
      error: (err: any) => {}
    });
  }

  renderStaticChart() {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const datasets = [
      {
        label: 'Static Signup',
        data: [10, 20, 15, 25, 30],
        borderColor: '#4caf50',
        backgroundColor: '#4caf50',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Static Landing',
        data: [5, 10, 8, 12, 15],
        borderColor: '#2196f3',
        backgroundColor: '#2196f3',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Static Bonus',
        data: [3, 7, 6, 9, 12],
        borderColor: '#ff9800',
        backgroundColor: '#ff9800',
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
