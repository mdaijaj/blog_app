// Replace ES module imports with CommonJS syntax
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { Provider } = require('react-redux');
const { BrowserRouter } = require('react-router-dom');
const configureStore = require('redux-mock-store');
const SignIn = require('./SignIn');

const mockStore = configureStore([]);

describe('SignIn Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: { user: null },
        });
    });

    it('renders the SignIn form', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SignIn />
                </BrowserRouter>
            </Provider>
        );

        expect(screen.getByText(/Login Into Account/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    });

    it('shows error messages for invalid form submission', async () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SignIn />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText(/Sign In/i));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
            expect(screen.getByText(/Password field required/i)).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ user: { token: 'test-token' }, message: 'Login successful' }),
            })
        );

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <SignIn />
                </BrowserRouter>
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter your email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByText(/Sign In/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.any(Object));
        });
    });
});
