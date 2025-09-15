import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const material = [
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatMenuModule,
  MatDividerModule,
  MatTableModule,
  MatPaginatorModule,
  MatSlideToggleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTabsModule,
  MatDialogModule,
  MatTooltipModule,
  MatSliderModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonToggleModule,
   MatSnackBarModule,
   
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    material
  ],

  exports:[
    material
  ]

})
export class MaterialModule { }
