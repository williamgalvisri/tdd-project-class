import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SingUpInterface } from '../models/sign-up.model';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  singUp(url: string, payload: SingUpInterface) {
    return this.httpClient.post(url, payload).pipe(
      catchError((error) => of(error))
    )
  }
}
