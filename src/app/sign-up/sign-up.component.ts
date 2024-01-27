
import { Component, OnInit } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { UserService } from '../core/user.service';
import { t } from 'msw/lib/glossary-de6278a9';

type FormKeys = 'password' | 'passwordRepeat' | 'email' | 'userName'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public password: string = '';
  public passwordRepeat: string = '';
  public userName: string = '';
  public email: string = '';
  public showPendingApiRequest: boolean = false;
  public showSuccesMessage: boolean = false;

  get isDisabled(): boolean{
    return this.password ? this.password !== this.passwordRepeat : true;
  }

  constructor(
    private userService: UserService
  ) {

  }

  ngOnInit(): void {

  }


  onChangePasswords({target}: Event, key: FormKeys) {
    const value = (target as HTMLInputElement).value;
    switch(key) {
      case 'password':
        this.password = value;
        break;
      case 'email':
        this.email = value;
        break;
      case 'passwordRepeat':
        this.passwordRepeat = value;
        break;
      case 'userName':
        this.userName = value;
        break;
    }
  }

  onSingUp() {
    this.showPendingApiRequest = true;
    const payload: SingUpInterface = {
      userName: this.userName,
      password: this.password,
      email: this.email
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
