import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ButtonComponent } from './button/button.component';

const EXPORT_COMPONENTS = [
  AlertComponent, ButtonComponent
]

@NgModule({
  declarations: [...EXPORT_COMPONENTS],
  exports: [...EXPORT_COMPONENTS],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
