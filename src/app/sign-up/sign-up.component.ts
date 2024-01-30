
import { Component, OnInit } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { UserService } from '../core/user.service';
import { t } from 'msw/lib/glossary-de6278a9';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

type FormKeys = 'password' | 'passwordRepeat' | 'email' | 'userName'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public formGroup: FormGroup = new FormGroup({
    password: new FormControl(''),
    passwordRepeat: new FormControl(''),
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl(''),
  })

  public showPendingApiRequest = false;
  public showSuccesMessage = false;

  get isDisabled(): boolean{
    return this.getFormControl('password').value ? this.getFormControl('password').value !== this.getFormControl('passwordRepeat').value : true;
  }


  get getUserNameError() {
    if(this.formGroup.get('userName')?.errors && (this.formGroup.get('userName')?.touched || this.formGroup.get('userName')?.dirty )){
      if(this.formGroup.get('userName')?.errors?.['required']) {
        return "Username is required."
      }

      if(this.formGroup.get('userName')?.errors?.['minlength']){
        return "Username must be at least 4 characters long."
      }
    }
    return ""
  }

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {

  }

  getFormControl(key: string): AbstractControl<any, any> {
    return this.formGroup.get(key) as AbstractControl<any, any>
  }


  onSingUp() {
    this.showPendingApiRequest = true;
    const formGroupData = this.formGroup.value;
    delete formGroupData.passwordRepeat;

    const payload: SingUpInterface = {
      ...formGroupData
    }
    const url = '/api/1.0/users';
    this.userService.singUp(url, payload).pipe(
      tap(() => {
        this.showPendingApiRequest = false;
        this.showSuccesMessage = true;
      })
    ).subscribe()
  }

}
