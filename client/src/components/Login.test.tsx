import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  it('should render the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call the login function on form submission', () => {
    const mockLogin = jest.fn();
    render(<Login onLogin={mockLogin} />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });
});
