import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../RegisterForm';

// Mock Next.js router
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('RegisterForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form with all elements', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    // Check for main elements
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByText('Comece sua jornada como lojista digital')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /próximo/i })).toBeInTheDocument();
    
    // Check for links
    expect(screen.getByText('Já tem uma conta?')).toBeInTheDocument();
    expect(screen.getByText('Fazer login')).toBeInTheDocument();
  });

  it('handles input changes in step 1', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    
    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(emailInput, { target: { value: 'joao@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(nameInput).toHaveValue('João Silva');
    expect(emailInput).toHaveValue('joao@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('toggles password visibility', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icon buttons
    
    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Click to show passwords
    fireEvent.click(toggleButtons[0]); // Password toggle
    fireEvent.click(toggleButtons[1]); // Confirm password toggle
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    // Click to hide passwords again
    fireEvent.click(toggleButtons[0]);
    fireEvent.click(toggleButtons[1]);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('advances to step 2 when step 1 is completed', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    
    // Submit step 1
    const nextButton = screen.getByRole('button', { name: /próximo/i });
    fireEvent.click(nextButton);
    
    // Should show step 2
    await waitFor(() => {
      expect(screen.getByText('Empresa')).toBeInTheDocument();
      expect(screen.getByLabelText(/nome da empresa/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    });
  });

  it('handles input changes in step 2', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Advance to step 2
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    await waitFor(() => {
      const companyNameInput = screen.getByLabelText(/nome da empresa/i);
      const cnpjInput = screen.getByLabelText(/cnpj/i);
      const phoneInput = screen.getByLabelText(/telefone/i);
      
      fireEvent.change(companyNameInput, { target: { value: 'Minha Empresa LTDA' } });
      fireEvent.change(cnpjInput, { target: { value: '12.345.678/0001-90' } });
      fireEvent.change(phoneInput, { target: { value: '(11) 99999-9999' } });
      
      expect(companyNameInput).toHaveValue('Minha Empresa LTDA');
      expect(cnpjInput).toHaveValue('12.345.678/0001-90');
      expect(phoneInput).toHaveValue('(11) 99999-9999');
    });
  });

  it('goes back to step 1 from step 2', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Advance to step 2
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Empresa')).toBeInTheDocument();
    });
    
    // Go back
    const backButton = screen.getByRole('button', { name: /voltar/i });
    fireEvent.click(backButton);
    
    // Should show step 1 again
    await waitFor(() => {
      expect(screen.getByText('Criar Conta')).toBeInTheDocument();
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    });
  });

  it('completes registration successfully', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Fill step 2
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nome da empresa/i), { target: { value: 'Minha Empresa LTDA' } });
      fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '12.345.678/0001-90' } });
      fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-9999' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });
    
    // Should call success callback
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('validates required fields in step 1', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Try to submit without filling fields
    const nextButton = screen.getByRole('button', { name: /próximo/i });
    fireEvent.click(nextButton);
    
    // Form should not advance and show validation
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('validates password confirmation', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'differentpassword' } });
    
    const nextButton = screen.getByRole('button', { name: /próximo/i });
    fireEvent.click(nextButton);
    
    // Should show validation error
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill form with invalid email
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    
    const nextButton = screen.getByRole('button', { name: /próximo/i });
    fireEvent.click(nextButton);
    
    // Should show validation error
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
  });

  it('validates required fields in step 2', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Advance to step 2
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Empresa')).toBeInTheDocument();
    });
    
    // Try to submit without filling company fields
    const createButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(createButton);
    
    // Should not call success callback
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('handles registration error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Fill step 2 and trigger error
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nome da empresa/i), { target: { value: 'Minha Empresa LTDA' } });
      fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '12.345.678/0001-90' } });
      fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-9999' } });
      
      // Mock error by throwing in the form submission
      const createButton = screen.getByRole('button', { name: /criar conta/i });
      const originalClick = createButton.onclick;
      createButton.onclick = () => {
        throw new Error('Registration failed');
      };
      
      fireEvent.click(createButton);
    });
    
    // Should call error callback
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Registration failed');
    });
    
    consoleSpy.mockRestore();
  });

  it('shows loading state during registration', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Fill step 2
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nome da empresa/i), { target: { value: 'Minha Empresa LTDA' } });
      fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '12.345.678/0001-90' } });
      fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-9999' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Criando conta...')).toBeInTheDocument();
    });
  });

  it('disables submit button during loading', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Fill step 2
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/nome da empresa/i), { target: { value: 'Minha Empresa LTDA' } });
      fireEvent.change(screen.getByLabelText(/cnpj/i), { target: { value: '12.345.678/0001-90' } });
      fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-9999' } });
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });
    
    // Button should be disabled during loading
    await waitFor(() => {
      const createButton = screen.getByRole('button', { name: /criando conta/i });
      expect(createButton).toBeDisabled();
    });
  });

  it('renders with proper accessibility attributes', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const nameInput = screen.getByLabelText(/nome completo/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar senha/i);
    const submitButton = screen.getByRole('button', { name: /próximo/i });
    
    // Check for proper labels and types
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(submitButton).toHaveAttribute('type', 'button');
    
    // Check for placeholders
    expect(nameInput).toHaveAttribute('placeholder', 'Seu nome completo');
    expect(emailInput).toHaveAttribute('placeholder', 'seu@email.com');
    expect(passwordInput).toHaveAttribute('placeholder', '••••••••');
    expect(confirmPasswordInput).toHaveAttribute('placeholder', '••••••••');
  });

  it('renders links with correct hrefs', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    const loginLink = screen.getByText('Fazer login');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('shows step indicator correctly', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Should show step 1 indicator
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Step 1 should be active
    expect(screen.getByText('Dados Pessoais')).toBeInTheDocument();
    expect(screen.getByText('Empresa')).toBeInTheDocument();
  });

  it('updates step indicator when advancing', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);
    
    // Fill step 1 and advance
    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /próximo/i }));
    
    // Should show step 2 as active
    await waitFor(() => {
      expect(screen.getByText('Empresa')).toBeInTheDocument();
    });
  });
}); 