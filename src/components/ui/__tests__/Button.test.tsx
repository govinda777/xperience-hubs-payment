import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'rounded-md', 'text-sm', 'font-medium', 'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('should render button with custom className', () => {
      render(<Button className="custom-class">Custom Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Custom Button' });
      expect(button).toHaveClass('custom-class');
    });

    it('should render as child component', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button>Default Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Default Button' });
      expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'hover:bg-primary/90');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Destructive Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Destructive Button' });
      expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/90');
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Outline Button' });
      expect(button).toHaveClass('border', 'border-input', 'bg-background', 'hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Secondary Button' });
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Ghost Button' });
      expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
    });

    it('should render link variant', () => {
      render(<Button variant="link">Link Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Link Button' });
      expect(button).toHaveClass('text-primary', 'underline-offset-4', 'hover:underline');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button>Default Size</Button>);
      
      const button = screen.getByRole('button', { name: 'Default Size' });
      expect(button).toHaveClass('h-10', 'px-4', 'py-2');
    });

    it('should render sm size', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Small Button' });
      expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
    });

    it('should render lg size', () => {
      render(<Button size="lg">Large Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Large Button' });
      expect(button).toHaveClass('h-11', 'rounded-md', 'px-8');
    });

    it('should render icon size', () => {
      render(<Button size="icon">Icon Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Icon Button' });
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Clickable Button' });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('should be focusable', () => {
      render(<Button>Focusable Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Focusable Button' });
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('should handle keyboard events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Keyboard Button' });
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('should show loading state', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Loading Button' });
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not be clickable when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Loading Button' });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Children Content', () => {
    it('should render text children', () => {
      render(<Button>Simple Text</Button>);
      
      const button = screen.getByRole('button', { name: 'Simple Text' });
      expect(button).toHaveTextContent('Simple Text');
    });

    it('should render complex children', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('IconText');
    });

    it('should render with icons', () => {
      render(
        <Button>
          <svg data-testid="icon" />
          Button with Icon
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Button with Icon' });
      const icon = screen.getByTestId('icon');
      
      expect(button).toContainElement(icon);
    });
  });
}); 