import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  singUp(url: string, payload: SingUpInterface) {
    return this.httpClient.post(url, payload)
  }

  isEmailTaken(value: string) {
    return this.httpClient.post('/api/1.0/user/email', {email: value})
  }
}
