import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

// Mock Next.js router
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('LoginForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with all elements', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    // Check for main elements
    expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument();
    expect(screen.getByText('Entre com sua conta para acessar sua loja')).toBeInTheDocument();
    
    // Check for wallet button
    expect(screen.getByRole('button', { name: /conectar carteira/i })).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    
    // Check for links
    expect(screen.getByText('Esqueceu a senha?')).toBeInTheDocument();
    expect(screen.getByText('Criar conta')).toBeInTheDocument();
  });

  it('handles email input changes', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('handles password input changes', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const passwordInput = screen.getByLabelText(/senha/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const passwordInput = screen.getByLabelText(/senha/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles email login form submission', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    
    // Wait for success callback
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles wallet login', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const walletButton = screen.getByRole('button', { name: /conectar carteira/i });
    
    // Click wallet button
    fireEvent.click(walletButton);
    
    // Check loading state
    expect(screen.getByText('Conectando...')).toBeInTheDocument();
    
    // Wait for success callback
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('validates required fields', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Try to submit without filling fields
    fireEvent.click(submitButton);
    
    // Form should not submit and show validation
    expect(screen.getByText('Entrar')).toBeInTheDocument(); // Button text unchanged
  });

  it('handles form submission with invalid email', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Fill form with invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Should show validation error
    expect(emailInput).toBeInvalid();
  });

  it('handles error during login', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Mock error by throwing in the form submission
    const originalSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = jest.fn().mockImplementation(() => {
      throw new Error('Login failed');
    });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Wait for error handling
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Login failed');
    });
    
    // Restore original submit
    HTMLFormElement.prototype.submit = originalSubmit;
    consoleSpy.mockRestore();
  });

  it('handles error during wallet connection', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const walletButton = screen.getByRole('button', { name: /conectar carteira/i });
    
    // Mock error by throwing in the wallet connection
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = jest.fn().mockImplementation((callback) => {
      callback();
      throw new Error('Wallet connection failed');
    });
    
    // Click wallet button
    fireEvent.click(walletButton);
    
    // Wait for error handling
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Wallet connection failed');
    });
    
    // Restore original setTimeout
    global.setTimeout = originalSetTimeout;
    consoleSpy.mockRestore();
  });

  it('disables submit button during loading', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    
    // Wait for completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('disables wallet button during connection', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const walletButton = screen.getByRole('button', { name: /conectar carteira/i });
    
    // Click wallet button
    fireEvent.click(walletButton);
    
    // Button should be disabled during connection
    expect(walletButton).toBeDisabled();
    
    // Wait for completion
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('renders with proper accessibility attributes', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    // Check for proper labels and types
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(submitButton).toHaveAttribute('type', 'submit');
    
    // Check for placeholders
    expect(emailInput).toHaveAttribute('placeholder', 'seu@email.com');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
  });

  it('renders links with correct hrefs', () => {
    render(<LoginForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const forgotPasswordLink = screen.getByText('Esqueceu a senha?');
    const createAccountLink = screen.getByText('Criar conta');
    
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(createAccountLink).toHaveAttribute('href', '/register');
  });
}); 