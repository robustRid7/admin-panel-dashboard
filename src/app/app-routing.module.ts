import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', loadChildren:()=> import('./authentication/authentication.module').then(a=>a.AuthenticationModule)},
  {path:'admin',loadChildren:()=>import ('./layout/layout.module').then(l=>l.LayoutModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
