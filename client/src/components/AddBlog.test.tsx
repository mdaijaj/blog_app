import { render, screen, fireEvent } from '@testing-library/react';
import AddBlog from './AddBlog';

describe('AddBlog Component', () => {
  it('should render the add blog form', () => {
    render(<AddBlog />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should call the addBlog function on form submission', () => {
    const mockAddBlog = jest.fn();
    render(<AddBlog onAddBlog={mockAddBlog} />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Blog' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'This is a test blog.' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockAddBlog).toHaveBeenCalledWith({ title: 'Test Blog', content: 'This is a test blog.' });
  });
});
