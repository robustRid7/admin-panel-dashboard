import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../common-dialog/delete-dialog/delete-dialog.component";
import { AddEditDialogComponent } from "../common-dialog/add-edit-dialog/add-edit-dialog.component";
import { ApiService } from "src/app/service/api.service";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from 'rxjs/operators';
import { FilterServiceService } from "src/app/service/filter-service.service";
// import { ViewDialogComponent } from "../common-dialog/view-dialog/view-dialog.component";

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
  filteredCampaigns!: Observable<any[]>;
  displayedColumns1: string[] = ["s_no", "domain", "companinid", "campaignName", "bonusId", "medium", "name", "french", "kinyarwanda", 'mobNo', "createdAt"];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);



  @ViewChild("MatPaginator1") MatPaginator1!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource1.paginator = this.MatPaginator1;

  }

  constructor(public dialog: MatDialog,
    private api: ApiService,
    private fb: FormBuilder,
    private filterService: FilterServiceService
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

  // getComapinList() {
  //   this.api.getDashBoardCompainList({}).subscribe({
  //     next: (res: any) => {
  //       this.comapinList = res.data || [];
  //       this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
  //         startWith(''), // 👈 yahi ensure karega ki dropdown khulte hi full list dikhe
  //         map(value => this._filterCampaigns(value || ''))
  //       );
  //     }
  //   });
  // }

  getComapinList() {
    this.api.getDashBoardCompainList({}).subscribe({
      next: (res: any) => {
        this.comapinList = res.data || [];
        const savedFilters = this.filterService.getCurrentFilters();

        if (savedFilters) {
          this.form.patchValue({
            from: savedFilters.from ? new Date(savedFilters.from) : null,
            to: savedFilters.to ? new Date(savedFilters.to) : null,
            // companyId: savedFilters.companyId || null
          });
        }

        const selected = this.comapinList.find(
          c => (c._id) == (savedFilters.campaignId)
        );

        if (selected) {
          this.form.patchValue({ companyId: selected._id });
          this.campaignCtrl.setValue(selected.campaignId, { emitEvent: false });

        }

        this.filteredCampaigns = this.campaignCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this._filterCampaigns(value || ''))
        );
      }
    });
  }

  selectCampaign(event: any) {
    const selected = this.comapinList.find(c => c.campaignId === event.option.value);
    this.form.patchValue({ companyId: selected?._id });
  }



  getSignUpUsers() {
    const payload = {
      limit: this.pageSize,
      page: this.pageIndex + 1,
      filters: {} as any
    }
    this.api.signUpUser(payload).subscribe({
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

    const payload = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
      filters: filters
    }
    this.api.signUpUser(payload).subscribe({
      next: (res: any) => {
        // this.dataSource1 = new MatTableDataSource(res.users);
        // this.dataSource1.paginator = this.MatPaginator1;
        this.dataSource1.data = res.users;
        this.totalRecords = res.pagination.total;
      }
    });
  }



}
