import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { HomeComponent } from '../home/home.component';


export const routes: Routes = [
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  // {
  //   path: '',
  //   redirectTo: 'signup'
  // }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRouterModule { }
