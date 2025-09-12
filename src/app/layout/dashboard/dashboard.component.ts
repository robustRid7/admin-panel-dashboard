import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  comapinList: any[] = [];
  companies = [
    // { id: 1, name: 'Company A' },
    // { id: 2, name: 'Company B' },
    // { id: 3, name: 'Company C' },
  ];

  // sample counts
  signupCount = 0;
  landingCount = 0;
  bonusCount = 0;

  constructor(private fb: FormBuilder,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      companyId: [null],
      from: [null],
      to: [null]
    });
  }
  ngOnInit(): void {
    this.getComapinList();
    this.api.searchCountList({}).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.signupCount = res.data.userCount ?? 0;
          this.landingCount = res.data.landingPageCount ?? 0;
          this.bonusCount = res.data.bonusPageCount ?? 0;
        }
      },
      error: (err: any) => { }
    });
  }

  getComapinList() {
    this.api.getDashBoardCompainList({}).subscribe({
      next: (res: any) => {
        this.comapinList = res.data
      }
    })
  }

  search() {
    const formValues = this.form.value;
    const payload: any = {};

    if (formValues.companyId) {
      payload.campaignId = formValues.companyId;
    }
    if (formValues.from) {
      payload.from = new Date(formValues.from).toISOString();
    }
    if (formValues.to) {
      payload.to = new Date(formValues.to).toISOString();
    }

    this.api.searchCountList(payload).subscribe({
      next: (res: any) => {
        if (res?.data) {
          this.signupCount = res.data.userCount ?? 0;
          this.landingCount = res.data.landingPageCount ?? 0;
          this.bonusCount = res.data.bonusPageCount ?? 0;
        }
      },
      error: (err: any) => { }
    });
  }

}
