
import { Component, OnInit } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { tap } from 'rxjs';
import { UserService } from '../core/user.service';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { passwordMatchValidators } from './password-match.validator';
import { UniqueEmailValidator } from './unique-email.validatos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public formGroup: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)]),
    passwordRepeat: new FormControl(''),
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)],
      updateOn: 'blur'
    }),
  }, {
    validators: passwordMatchValidators
  })

  public showPendingApiRequest = false;
  public showSuccesMessage = false;

  get isDisabled(): boolean{
    const formFilled = this.getFormControl('userName').value 
     && this.getFormControl('email').value
     && this.getFormControl('password').value
     && this.getFormControl('passwordRepeat').value
    const validationError = this.getUserNameError 
      || this.getEmailError 
      || this.getPasswordError 
      || this.getPasswordRepeatError

    return (!formFilled || validationError) ? true : false
  }


  get getUserNameError() {
    const control = this.formGroup.get('userName');
    if(control?.errors && (control?.touched || control?.dirty )){
      if(control?.errors?.['required']) {
        return "Username is required."
      }
      if(control?.errors?.['minlength']){
        return "Username must be at least 4 characters long."
      }
    }
    return ""
  }

  get getEmailError() {
    const control = this.formGroup.get('email');
    if(control?.errors && (control?.touched || control?.dirty)){
      if(control?.errors?.['required']) {
        return "E-mail is required."
      }
      if(control?.errors?.['email']){
        return "The E-mail must be valid email format."
      }
      if(control?.errors?.['uniqueEmail']){
        return "E-mail in use."
      }
      if(control?.errors?.['backend']){
        return control?.errors?.['backend']
      }
    }
    return ""
  }

  get getPasswordError() {
    const control = this.formGroup.get('password')
    if(control?.errors && (control?.touched || control?.dirty)){
      if(control?.errors?.['required']) {
        return "Password is required."
      }
      if(control?.errors?.['pattern']) {
        return "Password must have at least 1 uppercase, 1 lowercase letter and 1 number."
      }
    }
    return ""
  }

  get getPasswordRepeatError() {
    if(this.formGroup.errors && (this.formGroup.touched || this.formGroup.dirty)){ 
      if(this.formGroup.errors?.['passwordMatch']) {
        return "Password mismatch."
      }
    }
    return ""
  }

  constructor(
    private userService: UserService,
    private uniqueEmailValidator: UniqueEmailValidator
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
      tap({
        next: () => {
          this.showPendingApiRequest = false;
          this.showSuccesMessage = true;
        },
        error: (httpError: HttpErrorResponse) => {
          const emailValidationErrorMessage = httpError.error.validationErrors.email;
          this.formGroup.get('email')?.setErrors({backend: emailValidationErrorMessage})
          this.showPendingApiRequest = false;
        }
      })
    ).subscribe()
  }

}
