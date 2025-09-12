import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "../common-dialog/delete-dialog/delete-dialog.component";
// import { ViewDialogComponent } from "../common-dialog/view-dialog/view-dialog.component";

export interface PeriodicElement1 {
  s_no: number;
  type: string;
  charge: string;
  fare: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  {
    s_no: 1,
    type: "Lorem",
    charge: "Lorem",
    fare: "Lorem",
  },
];

export interface PeriodicElement2 {
  s_no: number;
  type: string;
  km_charge: string;
  min_charge: string;
  cancellation_charge:string;
  cancellation_charge_booking:string;

}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {
    s_no: 1,
    type: "Lorem",
    km_charge: "Lorem",
    min_charge: "Lorem",
    cancellation_charge: "Lorem",
    cancellation_charge_booking: "Lorem",


  },
];


export interface PeriodicElement3 {
  s_no: number;
  type: string;
  charge: string;
  fare: string;
}

const ELEMENT_DATA3: PeriodicElement3[] = [
  {
    s_no: 1,
    type: "Lorem",
    charge: "Lorem",
    fare: "Lorem",
  },
  {
    s_no: 1,
    type: "Lorem",
    charge: "Lorem",
    fare: "Lorem",
  },
];


export interface PeriodicElement4 {
  s_no: number;
  km_charge: string;
  base_fare: string;
  cancellation_charge:string;
  cancellation_charge_booking:string;

}

const ELEMENT_DATA4: PeriodicElement4[] = [
  {
    s_no: 1,
    km_charge: "Lorem",
    base_fare: "Lorem",
    cancellation_charge: "Lorem",
    cancellation_charge_booking: "Lorem",


  },
];

@Component({
  selector: 'app-fare-mgmt',
  templateUrl: './fare-mgmt.component.html',
  styleUrls: ['./fare-mgmt.component.css']
})
export class FareMgmtComponent {
  displayedColumns1: string[] = ["s_no","type", "charge", "fare", "view_surge","view_hours","action"];
  dataSource1 = new MatTableDataSource<PeriodicElement1>(ELEMENT_DATA1);

  displayedColumns2: string[] =   ["s_no","type", "km_charge", "min_charge", "cancellation_charge","cancellation_charge_booking","action"];
  dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA2);

  displayedColumns3: string[] =   ["s_no","type", "charge", "fare", "view_surge","view_hours","action"];
  dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA3);

  displayedColumns4 : string[] =   ["s_no", "km_charge", "base_fare", "cancellation_charge","cancellation_charge_booking","action"];
  dataSource4 = new MatTableDataSource<PeriodicElement4>(ELEMENT_DATA4);

  
  @ViewChild("MatPaginator1") MatPaginator1!: MatPaginator;
  @ViewChild("MatPaginator2") MatPaginator2!: MatPaginator;
  @ViewChild("MatPaginator3") MatPaginator3!: MatPaginator;
  @ViewChild("MatPaginator4") MatPaginator4!: MatPaginator;




  ngAfterViewInit() {
    this.dataSource1.paginator = this.MatPaginator1;
    this.dataSource2.paginator = this.MatPaginator2;
    this.dataSource3.paginator = this.MatPaginator3;
    this.dataSource4.paginator = this.MatPaginator4;



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

}
