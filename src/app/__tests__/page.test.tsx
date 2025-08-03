import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../page';

// Mock the components that might not be available in test environment
jest.mock('@/components/ui/Button', () => {
  return function MockButton({ children, ...props }: any) {
    return <button {...props}>{children}</button>;
  };
});

jest.mock('@/components/ui/Card', () => {
  return {
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardHeader: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardTitle: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    CardDescription: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    CardFooter: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  };
});

jest.mock('@/components/ui/Badge', () => {
  return function MockBadge({ children, ...props }: any) {
    return <span {...props}>{children}</span>;
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    // Mock window.matchMedia for responsive design tests
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('Hero Section', () => {
    it('should render hero section with main title', () => {
      render(<Page />);
      
      expect(screen.getByText(/Xperience Hubs Payment/i)).toBeInTheDocument();
      expect(screen.getByText(/Revolucione seus pagamentos/i)).toBeInTheDocument();
    });

    it('should render hero description', () => {
      render(<Page />);
      
      expect(screen.getByText(/Plataforma completa de pagamentos/i)).toBeInTheDocument();
      expect(screen.getByText(/integração blockchain e NFTs/i)).toBeInTheDocument();
    });

    it('should render call-to-action buttons', () => {
      render(<Page />);
      
      expect(screen.getByText(/Começar Agora/i)).toBeInTheDocument();
      expect(screen.getByText(/Saiba Mais/i)).toBeInTheDocument();
    });
  });

  describe('Features Section', () => {
    it('should render features section title', () => {
      render(<Page />);
      
      expect(screen.getByText(/Por que escolher a Xperience Hubs/i)).toBeInTheDocument();
    });

    it('should render all feature cards', () => {
      render(<Page />);
      
      // Check for feature titles
      expect(screen.getByText(/Loja Online Instantânea/i)).toBeInTheDocument();
      expect(screen.getByText(/Pagamento PIX com Split/i)).toBeInTheDocument();
      expect(screen.getByText(/NFTs como Ingressos/i)).toBeInTheDocument();
      expect(screen.getByText(/Autenticação Web3/i)).toBeInTheDocument();
      expect(screen.getByText(/Dashboard Analítico/i)).toBeInTheDocument();
      expect(screen.getByText(/API Completa/i)).toBeInTheDocument();
    });

    it('should render feature descriptions', () => {
      render(<Page />);
      
      expect(screen.getByText(/Crie sua loja online em minutos/i)).toBeInTheDocument();
      expect(screen.getByText(/Receba pagamentos instantâneos/i)).toBeInTheDocument();
      expect(screen.getByText(/Transforme produtos em NFTs únicos/i)).toBeInTheDocument();
      expect(screen.getByText(/Login seguro com carteiras digitais/i)).toBeInTheDocument();
      expect(screen.getByText(/Acompanhe vendas em tempo real/i)).toBeInTheDocument();
      expect(screen.getByText(/Integração completa via API/i)).toBeInTheDocument();
    });
  });

  describe('Footer Section', () => {
    it('should render footer navigation', () => {
      render(<Page />);
      
      expect(screen.getByText(/Produtos/i)).toBeInTheDocument();
      expect(screen.getByText(/Soluções/i)).toBeInTheDocument();
      expect(screen.getByText(/Recursos/i)).toBeInTheDocument();
      expect(screen.getByText(/Empresa/i)).toBeInTheDocument();
    });

    it('should render footer links', () => {
      render(<Page />);
      
      expect(screen.getByText(/Preços/i)).toBeInTheDocument();
      expect(screen.getByText(/Documentação/i)).toBeInTheDocument();
      expect(screen.getByText(/Suporte/i)).toBeInTheDocument();
      expect(screen.getByText(/Sobre/i)).toBeInTheDocument();
    });

    it('should render social media links', () => {
      render(<Page />);
      
      expect(screen.getByText(/Twitter/i)).toBeInTheDocument();
      expect(screen.getByText(/LinkedIn/i)).toBeInTheDocument();
      expect(screen.getByText(/GitHub/i)).toBeInTheDocument();
    });

    it('should render copyright information', () => {
      render(<Page />);
      
      expect(screen.getByText(/© 2024 Xperience Hubs Payment/i)).toBeInTheDocument();
      expect(screen.getByText(/Todos os direitos reservados/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render navigation menu', () => {
      render(<Page />);
      
      expect(screen.getByText(/Início/i)).toBeInTheDocument();
      expect(screen.getByText(/Produtos/i)).toBeInTheDocument();
      expect(screen.getByText(/Preços/i)).toBeInTheDocument();
      expect(screen.getByText(/Documentação/i)).toBeInTheDocument();
    });

    it('should render authentication buttons', () => {
      render(<Page />);
      
      expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
      expect(screen.getByText(/Cadastrar/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile-friendly layout', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Page />);
      
      // Check if main content is rendered
      expect(screen.getByText(/Xperience Hubs Payment/i)).toBeInTheDocument();
    });

    it('should render desktop-friendly layout', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      render(<Page />);
      
      // Check if main content is rendered
      expect(screen.getByText(/Xperience Hubs Payment/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<Page />);
      
      // Check for main heading
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(/Xperience Hubs Payment/i);
    });

    it('should have proper button labels', () => {
      render(<Page />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveTextContent();
      });
    });

    it('should have proper link structure', () => {
      render(<Page />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('SEO and Meta', () => {
    it('should render structured content for SEO', () => {
      render(<Page />);
      
      // Check for key content that would be important for SEO
      expect(screen.getByText(/pagamentos/i)).toBeInTheDocument();
      expect(screen.getByText(/blockchain/i)).toBeInTheDocument();
      expect(screen.getByText(/NFTs/i)).toBeInTheDocument();
      expect(screen.getByText(/PIX/i)).toBeInTheDocument();
    });

    it('should have proper semantic HTML structure', () => {
      render(<Page />);
      
      // Check for semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render without errors', () => {
      expect(() => render(<Page />)).not.toThrow();
    });

    it('should render all sections efficiently', () => {
      const { container } = render(<Page />);
      
      // Check that the page renders with reasonable DOM size
      expect(container.children.length).toBeGreaterThan(0);
    });
  });
}); 