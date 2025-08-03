import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card with default props', () => {
      render(<Card>Card content</Card>);
      
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card.parentElement).toHaveClass('rounded-lg', 'border', 'bg-white', 'text-gray-900', 'shadow-sm');
    });

    it('should render card with custom className', () => {
      render(<Card className="custom-card">Custom Card</Card>);
      
      const card = screen.getByText('Custom Card').parentElement;
      expect(card).toHaveClass('custom-card');
    });

    it('should pass through additional props', () => {
      render(<Card data-testid="test-card">Test Card</Card>);
      
      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('CardHeader', () => {
    it('should render card header with default props', () => {
      render(<CardHeader>Header content</CardHeader>);
      
      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('should render card header with custom className', () => {
      render(<CardHeader className="custom-header">Custom Header</CardHeader>);
      
      const header = screen.getByText('Custom Header');
      expect(header).toHaveClass('custom-header');
    });

    it('should pass through additional props', () => {
      render(<CardHeader data-testid="test-header">Test Header</CardHeader>);
      
      const header = screen.getByTestId('test-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('should render card title with default props', () => {
      render(<CardTitle>Card Title</CardTitle>);
      
      const title = screen.getByText('Card Title');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H3');
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('should render card title with custom className', () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>);
      
      const title = screen.getByText('Custom Title');
      expect(title).toHaveClass('custom-title');
    });

    it('should pass through additional props', () => {
      render(<CardTitle data-testid="test-title">Test Title</CardTitle>);
      
      const title = screen.getByTestId('test-title');
      expect(title).toBeInTheDocument();
    });

    it('should render as different heading level', () => {
      render(<CardTitle asChild><h1>H1 Title</h1></CardTitle>);
      
      const title = screen.getByText('H1 Title');
      expect(title.tagName).toBe('H1');
    });
  });

  describe('CardDescription', () => {
    it('should render card description with default props', () => {
      render(<CardDescription>Card Description</CardDescription>);
      
      const description = screen.getByText('Card Description');
      expect(description).toBeInTheDocument();
      expect(description.tagName).toBe('P');
      expect(description).toHaveClass('text-sm', 'text-gray-500');
    });

    it('should render card description with custom className', () => {
      render(<CardDescription className="custom-description">Custom Description</CardDescription>);
      
      const description = screen.getByText('Custom Description');
      expect(description).toHaveClass('custom-description');
    });

    it('should pass through additional props', () => {
      render(<CardDescription data-testid="test-description">Test Description</CardDescription>);
      
      const description = screen.getByTestId('test-description');
      expect(description).toBeInTheDocument();
    });

    it('should render as different element', () => {
      render(<CardDescription asChild><span>Span Description</span></CardDescription>);
      
      const description = screen.getByText('Span Description');
      expect(description.tagName).toBe('SPAN');
    });
  });

  describe('CardContent', () => {
    it('should render card content with default props', () => {
      render(<CardContent>Content</CardContent>);
      
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('should render card content with custom className', () => {
      render(<CardContent className="custom-content">Custom Content</CardContent>);
      
      const content = screen.getByText('Custom Content');
      expect(content).toHaveClass('custom-content');
    });

    it('should pass through additional props', () => {
      render(<CardContent data-testid="test-content">Test Content</CardContent>);
      
      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('CardFooter', () => {
    it('should render card footer with default props', () => {
      render(<CardFooter>Footer</CardFooter>);
      
      const footer = screen.getByText('Footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('should render card footer with custom className', () => {
      render(<CardFooter className="custom-footer">Custom Footer</CardFooter>);
      
      const footer = screen.getByText('Custom Footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('should pass through additional props', () => {
      render(<CardFooter data-testid="test-footer">Test Footer</CardFooter>);
      
      const footer = screen.getByTestId('test-footer');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Card Composition', () => {
    it('should render complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card example</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText('Complete Card')).toBeInTheDocument();
      expect(screen.getByText('This is a complete card example')).toBeInTheDocument();
      expect(screen.getByText('This is the main content of the card.')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('should render card with only header and content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Simple content</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Simple Card')).toBeInTheDocument();
      expect(screen.getByText('Simple content')).toBeInTheDocument();
    });

    it('should render card with only content', () => {
      render(
        <Card>
          <CardContent>
            <p>Content only</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Content only')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>Description for screen readers</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content</p>
          </CardContent>
        </Card>
      );

      const title = screen.getByRole('heading', { name: 'Accessible Card' });
      expect(title).toBeInTheDocument();
    });

    it('should support custom ARIA attributes', () => {
      render(
        <Card aria-label="Custom card">
          <CardContent>Content</CardContent>
        </Card>
      );

      const card = screen.getByLabelText('Custom card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Styling Variations', () => {
    it('should apply different styles based on context', () => {
      const { rerender } = render(
        <Card className="bg-blue-100">
          <CardContent>Blue card</CardContent>
        </Card>
      );

      let card = screen.getByText('Blue card').parentElement;
      expect(card).toHaveClass('bg-blue-100');

      rerender(
        <Card className="bg-red-100">
          <CardContent>Red card</CardContent>
        </Card>
      );

      card = screen.getByText('Red card').parentElement;
      expect(card).toHaveClass('bg-red-100');
    });

    it('should handle conditional styling', () => {
      const isActive = true;
      render(
        <Card className={isActive ? 'border-blue-500' : 'border-gray-300'}>
          <CardContent>Conditional styling</CardContent>
        </Card>
      );

      const card = screen.getByText('Conditional styling').parentElement;
      expect(card).toHaveClass('border-blue-500');
    });
  });

  describe('Responsive Design', () => {
    it('should handle responsive classes', () => {
      render(
        <Card className="p-4 md:p-6 lg:p-8">
          <CardContent>Responsive card</CardContent>
        </Card>
      );

      const card = screen.getByText('Responsive card').parentElement?.parentElement;
      expect(card).toHaveClass('p-4', 'md:p-6', 'lg:p-8');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Performance Test</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      );

      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should handle many cards efficiently', () => {
      const { container } = render(
        <div>
          {Array.from({ length: 10 }, (_, i) => (
            <Card key={i}>
              <CardContent>Card {i + 1}</CardContent>
            </Card>
          ))}
        </div>
      );

      expect(container.querySelectorAll('[class*="rounded-lg"]')).toHaveLength(10);
    });
  });
}); 