import { render, screen, waitFor,  } from "@testing-library/angular";
import { SingUpInterface } from "../models/sign-up.model";
import { HttpClientModule } from "@angular/common/http";
import { SignUpComponent } from './sign-up.component';
import userEvent from "@testing-library/user-event";
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import "whatwg-fetch";

let requestBody: Record<string, any> | null = null;
const server = setupServer(
  rest.post('/api/1.0/users', async (req, res, ctx) => {
    requestBody = await req.json();
    return res(ctx.status(200), ctx.json({}))
  })
);

beforeAll(() => server.listen())

afterAll(() => server.close())


const setup = async () => {
  await render(SignUpComponent,
    {
      imports: [HttpClientModule]
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
    //enables button when password and password repeat fields have the same value
    it('enables button when password and password repeat fields have the same value', async () => {
      // Arrange
      await setup()
      const DEFAULT_PASSWORD = '12345678';
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      // Act
      await userEvent.type(password, DEFAULT_PASSWORD);
      await userEvent.type(passwordRepeat, DEFAULT_PASSWORD);

      // Assert
      expect(button).not.toBeDisabled();
    })

    it('disable button when password and password repeat fields have the different value', async () => {
      // Arrange
      await setup()
      const DEFAULT_PASSWORD = '12345678';
      const WRONG_PASSWORD = '123456789';
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      // Act
      await userEvent.type(password, DEFAULT_PASSWORD);
      await userEvent.type(passwordRepeat, WRONG_PASSWORD);

      // Assert
      expect(button).toBeDisabled();
    })

    it('send username, email and password to backend after clicking the button', async () =>  {
      // Arrange
      await setup()
      const PAYLOAD: SingUpInterface = {
        userName: 'llian',
        password: '1234',
        email: 'test@email.com'
      }

      const userName = screen.getByLabelText('Username');
      const email = screen.getByLabelText('E-mail');
      const password = screen.getByLabelText('Password');
      const passwordRepeat = screen.getByLabelText('Password Repeat');
      const button = screen.getByRole('button', { name: 'Sign Up' });

      // Act
      await userEvent.type(userName, PAYLOAD.userName);
      await userEvent.type(email, PAYLOAD.email);
      await userEvent.type(password, PAYLOAD.password);
      await userEvent.type(passwordRepeat, PAYLOAD.password);
      await userEvent.click(button)

      // Assert

      await waitFor(() => {
        expect(requestBody).toEqual(PAYLOAD)
      })
    })
  })
})

