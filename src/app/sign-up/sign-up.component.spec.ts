import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { SingUpInterface } from '../models/sign-up.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule]
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
      expect(button.textContent).toContain('Sign Up')
    })

    it('disables the button initially', () => {
      const signUp = fixture.nativeElement as HTMLElement;
      const button = signUp.querySelector('button') as HTMLButtonElement;

      expect(button.disabled).toBeTruthy();
    })
  })

  describe('Interactions', () => {
    let httpTestingController: HttpTestingController;
    let signUp: HTMLElement;
    let button: HTMLButtonElement;
    const PAYLOAD: SingUpInterface = {
      userName: 'llian',
      password: '1234',
      email: 'user30@mail.com'
    }

    const setupForm = async ({isWrongPassword}: {isWrongPassword: boolean} = { isWrongPassword: false }) => {
      const WRONG_PASSWORD = '123456789';
      httpTestingController = TestBed.inject(HttpTestingController)
      signUp = fixture.nativeElement as HTMLElement;
      const userName = signUp.querySelector('input[id="username"]') as HTMLInputElement;
      const email = signUp.querySelector('input[id="email"]') as HTMLInputElement;
      const password = signUp.querySelector('input[id="password"]') as HTMLInputElement;
      const passwordRepeat = signUp.querySelector('input[id="passwordRepeat"]') as HTMLInputElement;
      // Act
      await fixture.whenStable();
      userName.value = PAYLOAD.userName;
      userName.dispatchEvent(new Event('input'))
      email.value = PAYLOAD.email;
      email.dispatchEvent(new Event('input'));
      email.dispatchEvent(new Event('blur'));
      password.value = PAYLOAD.password;
      password.dispatchEvent(new Event('input'));
      passwordRepeat.value = isWrongPassword ? WRONG_PASSWORD : PAYLOAD.password;
      passwordRepeat.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      button = signUp.querySelector('button') as HTMLButtonElement;
    }

    //enables button when password and password repeat fields have the same value
    it('enables button when password and password repeat fields have the same value', async () => {
      // build form configuration
      await setupForm()
      // by default test not trigger changes
      fixture.detectChanges();
      // Assert
      expect(button?.disabled).toBeFalsy();
    })

    //disable button when password and password repeat fields have the different value
    it('disable button when password and password repeat fields have the different value', async () => {
      // build form configuration and set a wrong password
      await setupForm({isWrongPassword: true})

      // by default test not trigger changes, then we need execute detectChanges
      fixture.detectChanges();
      // Assert
      expect(button?.disabled).toBeTruthy();
    })

    it('send username, email and password to backend after clicking the button', async () => {
      // build form configuration
      await setupForm()

      button?.click();
      const _request = httpTestingController.expectOne('/api/1.0/users')
      const requestBody = _request.request.body;

      // Assert
      expect(requestBody).toEqual(PAYLOAD);
    })

    it('disable button when there is an ongoin api call', async () => {
      // build form configuration
      await setupForm()
      button?.click();
      fixture.detectChanges();
      button?.click();
      httpTestingController.expectOne('/api/1.0/users')
      expect(button.disabled).toBeTruthy()
    })

    it('display spinner after clicking the submit', async () => {
      // build form configuration
      await setupForm()
      expect(signUp.querySelector('span[role="status"]')).toBeFalsy()
      button?.click();
      fixture.detectChanges();
      expect(signUp.querySelector('span[role="status"]')).toBeTruthy()
    })

    it('display account activation notification after successfull sign up request', async () => {
      // build form configuration
      await setupForm()
      expect(signUp.querySelector('.alert-success')).toBeFalsy();
      button?.click();
      const request = httpTestingController.expectOne('/api/1.0/users')
      request.flush({})
      fixture.detectChanges();
      const messsage = signUp.querySelector('.alert-success');
      expect(messsage?.textContent).toContain('Please check yout e-mail to activate your account.')
    })

    it('hides sign up form after successful sign up request', async () => {
      await setupForm()
      expect(signUp.querySelector('div[data-testid="form-sign-up"]')).toBeTruthy()
      button?.click();
      const request = httpTestingController.expectOne('/api/1.0/users')
      request.flush({})
      fixture.detectChanges();
      expect(signUp.querySelector('div[data-testid="form-sign-up"]')).toBeFalsy()
    })

    it('display validation error coming from backend after submit failure.', async () => {
      await setupForm()
      button.click();
      const request = httpTestingController.expectOne('/api/1.0/users');
      request.flush({
        validationErrors: { email: 'E-mail in use.' }
      }, {
        status: 400,
        statusText: 'Bad Request'
      });
      fixture.detectChanges();
      const validationElement = signUp.querySelector(`div[data-testid="email-validation"]`);
      expect(validationElement?.textContent).toContain("E-mail in use.")
    })
  })

  describe('Validations', () => {

    const testCases = [
      {field: 'username', value: '', error: 'Username is required.'},
      {field: 'username', value: '123', error: 'Username must be at least 4 characters long.'},
      {field: 'email', value: '', error: 'E-mail is required.'},
      {field: 'email', value: 'wrong-email', error: 'The E-mail must be valid email format.'},
      {field: 'password', value: '', error: 'Password is required.'},
      {field: 'password', value: 'password', error: 'Password must have at least 1 uppercase, 1 lowercase letter and 1 number.'},
      {field: 'password', value: 'passWORD', error: 'Password must have at least 1 uppercase, 1 lowercase letter and 1 number.'},
      {field: 'password', value: '122345', error: 'Password must have at least 1 uppercase, 1 lowercase letter and 1 number.'},
      {field: 'password', value: 'pass1234', error: 'Password must have at least 1 uppercase, 1 lowercase letter and 1 number.'},
      {field: 'passwordRepeat', value: 'pass', error: 'Password mismatch.'}
    ]

    for (const {error, value, field} of testCases) {
      it(`display ${error} when ${field} has ${value}`, () => {
        const signUp = fixture.nativeElement as HTMLElement;
        expect(signUp.querySelector(`div[data-testid="${field}-validation"]`)).toBeNull()
        const userNameInput = signUp.querySelector(`input[id="${field}"]`) as HTMLInputElement;
        userNameInput.value = value;
        userNameInput?.dispatchEvent(new Event('input'));
        userNameInput?.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
  
        const validationElement = signUp.querySelector(`div[data-testid="${field}-validation"]`);
  
        expect(validationElement?.textContent).toContain(error)
  
      })
    }

    it('Display E-mail in use when email is not unique', async ()=> {
      let httpTestingController = TestBed.inject(HttpTestingController);
      const signUp = fixture.nativeElement as HTMLElement;
      expect(signUp.querySelector(`div[data-testid="email-validation"]`)).toBeNull()
      const userNameInput = signUp.querySelector(`input[id="email"]`) as HTMLInputElement;
      userNameInput.value = 'non-unique-email@mail.com';
      userNameInput?.dispatchEvent(new Event('input'));
      userNameInput?.dispatchEvent(new Event('blur'));

      const request = httpTestingController.expectOne(({url, method, body}) => {
        if(url === '/api/1.0/user/email' && method === 'POST') {
          return body.email === 'non-unique-email@mail.com'
        }
        return false;
      })
      request.flush({});
      fixture.detectChanges();

      const validationElement = signUp.querySelector(`div[data-testid="email-validation"]`);

      expect(validationElement?.textContent).toContain("E-mail in use.")
    })

  })

});
