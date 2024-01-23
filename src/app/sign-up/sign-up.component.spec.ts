import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { SingUpInterface } from '../models/sign-up.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('layout signup', () => {
    it('has  Sign Up header', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const h1 = signUp.querySelector('h1');

      expect(h1?.textContent).toBe('Sign Up')
    })

    it('has userName input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="username"]');
      const input = signUp.querySelector('input[id="username"]');

      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain("Username");
    })

    it('has email input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="email"]')
      const input = signUp.querySelector('input[id="email"]');

      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain("E-mail");
    })

    it('has password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="password"]');
      const input = signUp.querySelector('input[id="password"]');

      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain("Password");
    })

    it('has password type for password input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      expect(input.type).toBe('password')
    })

    it('has password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const label = signUp.querySelector('label[for="passwordRepeat"]');
      const input = signUp.querySelector('input[id="passwordRepeat"]');

      expect(input).toBeTruthy();
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain("Password Repeat");
    })

    it('has password type for password repeat input', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const input = signUp.querySelector('input[id="passwordRepeat"]') as HTMLInputElement;
      expect(input.type).toBe('password')
    })

    it('has Sign Up button', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button') as HTMLButtonElement;

      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Sign Up')
    })

    it('disables the button initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button') as HTMLButtonElement;

      expect(button.disabled).toBeTruthy();
    })
  })

  describe('Interactions', () => {
    //enables button when password and password repeat fields have the same value
    it('enables button when password and password repeat fields have the same value', async () => {
      // Arrange
      const DEFAULT_PASSWORD = '12345678';
      const signUp = fixture.nativeElement as HTMLElement;
      const password = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      const passwordRepeat = signUp.querySelector('input[id="passwordRepeat"]') as HTMLInputElement;
      const button = signUp.querySelector('button') as HTMLButtonElement;

      // Act
      //dispatch for execute eventes elements
      password.value = DEFAULT_PASSWORD;
      password.dispatchEvent(new Event('input'))
      passwordRepeat.value = DEFAULT_PASSWORD;
      passwordRepeat.dispatchEvent(new Event('input'))

      // by default test not trigger changes
      fixture.detectChanges();
      // Assert
      expect(button?.disabled).toBeFalsy();
    })

    //disable button when password and password repeat fields have the different value
    it('disable button when password and password repeat fields have the different value', async () => {
      // Arrange
      const DEFAULT_PASSWORD = '12345678';
      const WERONG_PASSWORD = '123456789';
      const signUp = fixture.nativeElement as HTMLElement;
      const password = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      const passwordRepeat = signUp.querySelector('input[id="passwordRepeat"]') as HTMLInputElement;
      const button = signUp.querySelector('button') as HTMLButtonElement;

      // Act
      //dispatch for execute eventes elements
      password.value = DEFAULT_PASSWORD;
      password.dispatchEvent(new Event('input'))
      passwordRepeat.value = WERONG_PASSWORD;
      passwordRepeat.dispatchEvent(new Event('input'))

      // by default test not trigger changes, then we need execute detectChanges
      fixture.detectChanges();
      // Assert
      expect(button?.disabled).toBeTruthy();
    })

    it('send username, email and password to backend after clicking the button', () => {
      // Arrange
      let httpTestingController = TestBed.inject(HttpTestingController)
      const PAYLOAD: SingUpInterface = {
        userName: 'llian',
        password: '1234',
        email: 'test@email.com'
      }
      const signUp = fixture.nativeElement as HTMLElement;
      const userName = signUp.querySelector('input[id="username"]') as HTMLInputElement;
      const email = signUp.querySelector('input[id="email"]') as HTMLInputElement;
      const password = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      const passwordRepeat = signUp.querySelector('input[id="passwordRepeat"]') as HTMLInputElement;

      const spy = spyOn(window, 'fetch');

      // Act
      userName.value = PAYLOAD.userName;
      userName.dispatchEvent(new Event('input'))
      email.value = PAYLOAD.email;
      email.dispatchEvent(new Event('input'));
      password.value = PAYLOAD.password;
      password.dispatchEvent(new Event('input'));
      passwordRepeat.value = PAYLOAD.password;
      passwordRepeat.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const button = signUp.querySelector('button') as HTMLButtonElement;
      button?.click();
      const _request = httpTestingController.expectOne('/api/1.0/users')
      const requestBody = _request.request.body;

      // Assert
      expect(requestBody).toEqual(PAYLOAD);
    })
  })

});
