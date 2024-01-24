
import { Component, OnInit } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http'

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
  public pendingApiRequest: boolean = false;

  get isDisabled(): boolean{
    return this.password ? this.password !== this.passwordRepeat : true;
  }

  constructor(
    private httpClient: HttpClient
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
    this.pendingApiRequest = true;
    const payload: SingUpInterface = {
      userName: this.userName,
      password: this.password,
      email: this.email
    }
    const url = '/api/1.0/users';
    this.httpClient.post(url, payload).pipe(
      catchError((error) => of(error)),
      tap(() => {
        this.pendingApiRequest = false;
      })
    ).subscribe()
  }

}
