import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { AddEditDialogComponent } from '../common-dialog/add-edit-dialog/add-edit-dialog.component';
import { DeleteDialogComponent } from '../common-dialog/delete-dialog/delete-dialog.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
export interface PeriodicElement1 {
  s_no: number;
  name: string;
  french: string;
  kinyarwanda: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },
];

@Component({
  selector: 'app-bonus-page',
  templateUrl: './bonus-page.component.html',
  styleUrls: ['./bonus-page.component.css']
})
export class BonusPageComponent {
  totalRecords: number = 0;
  pageIndex: number = 0;
  pageSize: number = 200;
  form: FormGroup;
  comapinList: any[] = [];
  campaignCtrl = new FormControl('');
  filteredCampaigns!: Observable<any[]>;
  displayedColumns1: string[] = ["s_no", "name", "campaignName", "bonusId", "createdAt", "french", "kinyarwanda"];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);



  @ViewChild("MatPaginator1") MatPaginator1!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource1.paginator = this.MatPaginator1;

  }

  constructor(public dialog: MatDialog,
    private api: ApiService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      companyId: [null],
      from: [null],
      to: [null]
    });

  }
  ngOnInit(): void {
    this.getComapinList();

    this.getSignUpUsers()

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

  deleteDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      maxWidth: "90vw",
      panelClass: "dialog-layout",
      disableClose: true,
      enterAnimationDuration,
      exitAnimationDuration,
    })
  }


  addDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element: any

  ): void {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
      width: "550px",
      height: "auto",
      maxHeight: "100vh",
      maxWidth: "90vw",
      panelClass: "layout-dialog",
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        data: element
      }

    });
  }


  getSignUpUsers() {
    const payload = {
      limit: this.pageSize,
      page: this.pageIndex + 1,
      filters: {} as any
    }
    this.api.bonusPageList(payload).subscribe({
      next: (res: any) => {
        // this.dataSource1 = new MatTableDataSource(res.users);
        // this.dataSource1.paginator = this.MatPaginator1;
        this.dataSource1.data = res.users;
        this.totalRecords = res.pagination.total;
      }
    })
  }


  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSignUpUsers();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  search() {
    const formValues = this.form.value;
    const filters: any = {};
    if (formValues.companyId) filters.campaignId = formValues.companyId;
    if (formValues.from) filters.from = new Date(formValues.from).toISOString();
    if (formValues.to) filters.to = new Date(formValues.to).toISOString();
    const payload = { filters };
    this.api.bonusPageList(payload).subscribe({
      next: (res: any) => {
        // this.dataSource1 = new MatTableDataSource(res.users);
        // this.dataSource1.paginator = this.MatPaginator1;
         this.dataSource1.data = res.users;
        this.totalRecords = res.pagination.total;
      }
    });
  }



}
