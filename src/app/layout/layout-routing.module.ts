import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PackageItemTypeMgmtComponent } from './package-item-type-mgmt/package-item-type-mgmt.component';
import { VehicleMgmtComponent } from './vehicle-mgmt/vehicle-mgmt.component';
import { FareMgmtComponent } from './fare-mgmt/fare-mgmt.component';
import { InterpolationComponent } from './interpolation/interpolation.component';
import { PropertyBindingComponent } from './property-binding/property-binding.component';
import { ClassStyleBindingComponent } from './class-style-binding/class-style-binding.component';
import { EventBindingComponent } from './event-binding/event-binding.component';
import { TemplateDrivenFormComponent } from './template-driven-form/template-driven-form.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BonusPageComponent } from './bonus-page/bonus-page.component';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardGoogleComponent } from './dashboard-google/dashboard-google.component';
import { DashboardMetaComponent } from './dashboard-meta/dashboard-meta.component';
import { WhatsUpUsersComponent } from './whats-up-users/whats-up-users.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'dashboard-google', component: DashboardGoogleComponent, canActivate: [AuthGuard] },
      { path: 'package-item-type-mgmt', component: PackageItemTypeMgmtComponent, canActivate: [AuthGuard] },
      { path: 'dashboard-meta', component: DashboardMetaComponent, canActivate: [AuthGuard] },
      { path: 'vehicle-mgmt', component: VehicleMgmtComponent },
      { path: 'fare-mgmt', component: FareMgmtComponent },
      { path: 'interpolation', component: InterpolationComponent },
      { path: 'property-binding', component: PropertyBindingComponent },
      { path: 'class-style-binding', component: ClassStyleBindingComponent },
      { path: 'event-binding', component: EventBindingComponent },
      { path: 'template-driven-form', component: TemplateDrivenFormComponent },
      { path: 'landing-page', component: LandingPageComponent, canActivate: [AuthGuard] },
      { path: 'bonus-page', component: BonusPageComponent, canActivate: [AuthGuard] },
       { path: 'whats-up-users', component: WhatsUpUsersComponent, canActivate: [AuthGuard] }





    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
