import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/service/api.service';
import { AddEditDialogComponent } from '../common-dialog/add-edit-dialog/add-edit-dialog.component';
import { DeleteDialogComponent } from '../common-dialog/delete-dialog/delete-dialog.component';

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
  displayedColumns1: string[] = ["s_no", "name", "french", "kinyarwanda"];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);



  @ViewChild("MatPaginator1") MatPaginator1!: MatPaginator;


  ngAfterViewInit() {
    this.dataSource1.paginator = this.MatPaginator1;

  }

  constructor(public dialog: MatDialog,
    private api: ApiService
  ) {

  }
  ngOnInit(): void {
    this.getSignUpUsers()
  }

  // viewDialog(
  //   type: any,
  //   enterAnimationDuration: string,
  //   exitAnimationDuration: string
  // ) {
  //   this.dialog.open(ViewDialogComponent, {
  //     width: "400px",
  //     height: "auto",
  //     maxHeight: "100vh",
  //     maxWidth: "90vw",
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //     panelClass: "layout-dialog",
  //     data: {
  //       type:type,
  //     },
  //   });
  // }

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
    this.api.bonusPageList({}).subscribe({
      next: (res: any) => {
        this.dataSource1 = new MatTableDataSource(res.users);
        this.dataSource1.paginator = this.MatPaginator1;
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }


}
