import { fireEvent, render, screen, waitFor,  } from "@testing-library/angular";
import { SingUpInterface } from "../models/sign-up.model";
import { HttpClientModule } from "@angular/common/http";
import { SignUpComponent } from './sign-up.component';
import userEvent from "@testing-library/user-event";
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import "whatwg-fetch";
import { AlertComponent } from "../shared/alert/alert.component";
import { SharedModule } from "../shared/shared.module";

let requestBody: Record<string, any> | null = null;
let counter = 0;
const server = setupServer(
  rest.post('/api/1.0/users', async (req, res, ctx) => {
    counter +=1
    requestBody = await req.json();
    return res(ctx.status(200), ctx.json({}))
  })
);

beforeEach(() => {
  counter = 0;
});

beforeAll(() => server.listen())

afterAll(() => server.close())


const setup = async () => {
  await render(SignUpComponent,
    {
      imports: [HttpClientModule, SharedModule]
    });
}

describe('SignUpComponent', () => {
  describe('Layout', () => {
    it('has Sign Up header', async () => {
      await setup()
      const header = screen.getByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument()
    })

    // has userName input
    it('has userName input', async () => {
      await setup()
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    })

    //has email input
    it('has email input', async () => {
      await setup()
      const input = screen.getByLabelText('E-mail');
      expect(input).toBeInTheDocument();
    })

    //has password input
    it('has password input', async () => {
      await setup()
      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
    })

    //has password type for password input
    it('has password type for password input', async () => {
      await setup()
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password')
    })

    //has re-password input
    it('has password repeat input', async () => {
      await setup()
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toBeInTheDocument();
    })


    //has password type for password input
    it('has password repeat type for password input', async () => {
      await setup()
      const input = screen.getByLabelText('Password Repeat');
      expect(input).toHaveAttribute('type', 'password')
    })

    //has Sign Up button
    it('has Sign Up button', async () => {
      await setup()

      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeInTheDocument();
    })

    //disables the button initially
    it('disables the button initially', async () => {
      await setup()

      const button = screen.getByRole('button', { name: 'Sign Up' });
      expect(button).toBeDisabled();
    })

  });
  describe('interactions',() => {
    let button: HTMLElement;
    const PAYLOAD: SingUpInterface = {
      userName: 'llian',
      password: '1234',
      email: 'test@email.com'
    }
    const messageNotification = 'Please check yout e-mail to activate your account.';
    const setupForm = async ({isWrongPassword}: {isWrongPassword: boolean} = { isWrongPassword: false }) => {
      await setup()
      const WRONG_PASSWORD = '123456789';

      const userName = screen.getByLabelText('Username');
      const email = screen.getByLabelText('E-mail');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      button = screen.getByRole('button', { name: 'Sign Up' });

      // Act
      await userEvent.type(userName, PAYLOAD.userName);
      await userEvent.type(email, PAYLOAD.email);
      await userEvent.type(password, PAYLOAD.password);
      await userEvent.type(passwordRepeat, isWrongPassword ? WRONG_PASSWORD : PAYLOAD.password);
    }
    //enables button when password and password repeat fields have the same value
    it('enables button when password and password repeat fields have the same value', async () => {
      // Arrange
      await setupForm()

      // Assert
      expect(button).not.toBeDisabled();
    })

    it('disable button when password and password repeat fields have the different value', async () => {
      // Arrange
      await setupForm({isWrongPassword: true})

      // Assert
      expect(button).toBeDisabled();
    })

    it('send username, email and password to backend after clicking the button', async () =>  {
      // Arrange
      await setupForm()
      await userEvent.click(button)

      // Assert

      await waitFor(() => {
        expect(requestBody).toEqual(PAYLOAD)
      })
    })

    it('disable button when there is an ongoin api call', async () => {
      await setupForm()
      await userEvent.click(button);
      await fireEvent.click(button);

      await waitFor(() => {
        expect(counter).toBe(1)
      })
    })

    it('display spinner after clicking the submit', async () => {
      await setupForm();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      await userEvent.click(button);
      expect(screen.queryByRole("status")).toBeInTheDocument();
    })

    it('display account activation notification after successfull sign up request', async () => {
      await setupForm();
      expect(screen.queryByText(messageNotification)).not.toBeInTheDocument()
      await userEvent.click(button);
      const message = await screen.findByText(messageNotification)
      expect(message).toBeInTheDocument()
    })

    it('hides sign up form after successful sign up request', async () => {
      await setupForm();
      const form = screen.getByTestId('form-sign-up')
      expect(form).toBeInTheDocument();
      await userEvent.click(button);
      await screen.findByText(messageNotification);
      expect(form).not.toBeInTheDocument()
    })
  })
})

