import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../common-dialog/delete-dialog/delete-dialog.component";
import { AddEditDialogComponent } from "../common-dialog/add-edit-dialog/add-edit-dialog.component";
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

export interface PeriodicElement2 {
  s_no: number;
  name: string;
  french: string;
  kinyarwanda: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },

  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },

];


export interface PeriodicElement3 {
  s_no: number;
  name: string;
  french: string;
  kinyarwanda: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },

  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },

  {
    s_no: 1,
    name: "Lorem",
    french: "Lorem",
    kinyarwanda: "Lorem",
  },
];

@Component({
  selector: 'app-vehicle-mgmt',
  templateUrl: './vehicle-mgmt.component.html',
  styleUrls: ['./vehicle-mgmt.component.css']
})
export class VehicleMgmtComponent {
  displayedColumns1: string[] = ["s_no","icon", "name", "french", "kinyarwanda","action"];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

  displayedColumns2: string[] =   ["s_no","icon", "name", "french", "kinyarwanda","action"];
  dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);

  displayedColumns3: string[] =   ["s_no","icon", "name", "french", "kinyarwanda","action"];
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);

  
  @ViewChild("MatPaginator1") MatPaginator1!: MatPaginator;
  @ViewChild("MatPaginator2") MatPaginator2!: MatPaginator;
  @ViewChild("MatPaginator3") MatPaginator3!: MatPaginator;



  ngAfterViewInit() {
    this.dataSource1.paginator = this.MatPaginator1;
    this.dataSource2.paginator = this.MatPaginator2;
    this.dataSource3.paginator = this.MatPaginator3;


  }

  constructor ( public dialog : MatDialog ){

  }

  deleteDialog(enterAnimationDuration:string, exitAnimationDuration:string){
    this.dialog.open(DeleteDialogComponent,{
      width: '400px',
      maxWidth: "90vw",
      panelClass: "dialog-layout",
      disableClose:true,
      enterAnimationDuration,
      exitAnimationDuration,
    })
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

  addDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    element:any
  
  ): void {
    const dialogRef= this.dialog.open(AddEditDialogComponent, {
      width: "550px",
      height: "auto",
      maxHeight: "100vh",
      maxWidth: "90vw",
      panelClass: "layout-dialog",
      enterAnimationDuration,
      exitAnimationDuration,
      data:{
        data:element
      }
      
     
    });
  }

  // deleteDialog(element:any,enterAnimationDuration:string, exitAnimationDuration:string){
  //   const dialogRef=this.dialog.open(DeleteDialogComponent,{
  //     width: '400px',
  //     maxWidth: "90vw",
  //     panelClass: "dialog-layout",
  //     disableClose:true,
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //     data: {
  //       api: `banner/${element._id}`,
  //       label: "Banner deleted successfully",
  //       element,
  //       method: "delete"
  //     },
  
  //   })
  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.bannerDetail({});
  //   });
  // }


}
