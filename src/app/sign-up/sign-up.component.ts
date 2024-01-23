
import { Component, OnInit } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { Observable } from 'rxjs';
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

  async onSingUp() {
    try {
      const payload: SingUpInterface = {
        userName: this.userName,
        password: this.password,
        email: this.email
      }
      const url = '/api/1.0/users';
      // await fetch(url, {
      //   method: 'POST',
      //   body: JSON.stringify(payload),
      //   headers: {
      //     "Content-Type": "application/json"
      //   }
      // });
      this.httpClient.post(url, payload).subscribe()
    } catch (error) {
      console.log(error);
    }
  }

}
