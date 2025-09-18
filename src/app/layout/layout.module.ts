import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../material/material.module';

import { SharedModule } from '../shared/shared.module';
import { PackageItemTypeMgmtComponent } from './package-item-type-mgmt/package-item-type-mgmt.component';
import { VehicleMgmtComponent } from './vehicle-mgmt/vehicle-mgmt.component';
import { DeleteDialogComponent } from './common-dialog/delete-dialog/delete-dialog.component';
import { AddEditDialogComponent } from './common-dialog/add-edit-dialog/add-edit-dialog.component';
import { FareMgmtComponent } from './fare-mgmt/fare-mgmt.component';
import { InterpolationComponent } from './interpolation/interpolation.component';
import { PropertyBindingComponent } from './property-binding/property-binding.component';
import { ClassStyleBindingComponent } from './class-style-binding/class-style-binding.component';
import { EventBindingComponent } from './event-binding/event-binding.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BonusPageComponent } from './bonus-page/bonus-page.component';
import { DashboardGoogleComponent } from './dashboard-google/dashboard-google.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DashboardMetaComponent } from './dashboard-meta/dashboard-meta.component';
import { WhatsUpUsersComponent } from './whats-up-users/whats-up-users.component';
import { GoogleCompaignAnalyticsComponent } from './google-compaign-analytics/google-compaign-analytics.component';  // ✅ Add this


@NgModule({
  declarations: [
    DashboardComponent,
    LayoutComponent,
    PackageItemTypeMgmtComponent,
    VehicleMgmtComponent,
    DeleteDialogComponent,
    AddEditDialogComponent,
    FareMgmtComponent,
    InterpolationComponent,
    PropertyBindingComponent,
    ClassStyleBindingComponent,
    EventBindingComponent,
    TemplateDrivenFormComponent,
    LandingPageComponent,
    BonusPageComponent,
    DashboardGoogleComponent,
    DashboardMetaComponent,
    WhatsUpUsersComponent,
    GoogleCompaignAnalyticsComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
     MatAutocompleteModule 
  ]
})
export class LayoutModule { }
