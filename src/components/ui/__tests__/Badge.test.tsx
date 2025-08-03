import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render badge with default props', () => {
      render(<Badge>Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold', 'transition-colors', 'focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });

    it('should render badge with custom className', () => {
      render(<Badge className="custom-badge">Custom Badge</Badge>);
      
      const badge = screen.getByText('Custom Badge');
      expect(badge).toHaveClass('custom-badge');
    });

    it('should render as child component', () => {
      render(
        <Badge asChild>
          <span>Child Badge</span>
        </Badge>
      );
      
      const badge = screen.getByText('Child Badge');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Badge>Default</Badge>);
      
      const badge = screen.getByText('Default');
      expect(badge).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/80');
    });

    it('should render secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      
      const badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground', 'hover:bg-secondary/80');
    });

    it('should render destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      
      const badge = screen.getByText('Destructive');
      expect(badge).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground', 'hover:bg-destructive/80');
    });

    it('should render outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>);
      
      const badge = screen.getByText('Outline');
      expect(badge).toHaveClass('text-foreground');
    });
  });

  describe('Children Content', () => {
    it('should render text children', () => {
      render(<Badge>Simple Text</Badge>);
      
      const badge = screen.getByText('Simple Text');
      expect(badge).toBeInTheDocument();
    });

    it('should render with icons', () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          Badge with Icon
        </Badge>
      );
      
      const badge = screen.getByText('Badge with Icon');
      const icon = screen.getByTestId('icon');
      
      expect(badge).toContainElement(icon);
    });

    it('should render complex children', () => {
      render(
        <Badge>
          <span>Icon</span>
          <span>Text</span>
        </Badge>
      );
      
      const badge = screen.getByText('IconText');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Badge aria-label="Status badge">Status</Badge>);
      
      const badge = screen.getByLabelText('Status badge');
      expect(badge).toBeInTheDocument();
    });

    it('should be focusable when needed', () => {
      render(<Badge tabIndex={0}>Focusable Badge</Badge>);
      
      const badge = screen.getByText('Focusable Badge');
      badge.focus();
      
      expect(badge).toHaveFocus();
    });

    it('should support role attribute', () => {
      render(<Badge role="status">Status</Badge>);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable Badge</Badge>);
      
      const badge = screen.getByText('Clickable Badge');
      badge.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle hover states', () => {
      render(<Badge>Hover Badge</Badge>);
      
      const badge = screen.getByText('Hover Badge');
      expect(badge).toHaveClass('hover:bg-primary/80');
    });

    it('should handle focus states', () => {
      render(<Badge>Focus Badge</Badge>);
      
      const badge = screen.getByText('Focus Badge');
      expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
    });
  });

  describe('Styling Variations', () => {
    it('should apply different colors based on variant', () => {
      const { rerender } = render(<Badge variant="default">Default</Badge>);
      
      let badge = screen.getByText('Default');
      expect(badge).toHaveClass('bg-primary');

      rerender(<Badge variant="secondary">Secondary</Badge>);
      badge = screen.getByText('Secondary');
      expect(badge).toHaveClass('bg-secondary');

      rerender(<Badge variant="destructive">Destructive</Badge>);
      badge = screen.getByText('Destructive');
      expect(badge).toHaveClass('bg-destructive');
    });

    it('should handle custom styling', () => {
      render(<Badge className="bg-purple-500 text-white">Custom Styled</Badge>);
      
      const badge = screen.getByText('Custom Styled');
      expect(badge).toHaveClass('bg-purple-500', 'text-white');
    });

    it('should handle conditional styling', () => {
      const isActive = true;
      render(
        <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
          Conditional
        </Badge>
      );
      
      const badge = screen.getByText('Conditional');
      expect(badge).toHaveClass('bg-green-500');
    });
  });

  describe('Size and Spacing', () => {
    it('should have consistent padding', () => {
      render(<Badge>Padded Badge</Badge>);
      
      const badge = screen.getByText('Padded Badge');
      expect(badge).toHaveClass('px-2.5', 'py-0.5');
    });

    it('should have proper text size', () => {
      render(<Badge>Text Size</Badge>);
      
      const badge = screen.getByText('Text Size');
      expect(badge).toHaveClass('text-xs');
    });

    it('should have proper font weight', () => {
      render(<Badge>Font Weight</Badge>);
      
      const badge = screen.getByText('Font Weight');
      expect(badge).toHaveClass('font-semibold');
    });
  });

  describe('Border and Shape', () => {
    it('should have rounded corners', () => {
      render(<Badge>Rounded</Badge>);
      
      const badge = screen.getByText('Rounded');
      expect(badge).toHaveClass('rounded-full');
    });

    it('should have border styling', () => {
      render(<Badge>Bordered</Badge>);
      
      const badge = screen.getByText('Bordered');
      expect(badge).toHaveClass('border');
    });

    it('should handle outline variant border', () => {
      render(<Badge variant="outline">Outline</Badge>);
      
      const badge = screen.getByText('Outline');
      expect(badge).toHaveClass('border');
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const { container } = render(<Badge>Performance Test</Badge>);
      
      expect(container.children.length).toBeGreaterThan(0);
    });

    it('should handle many badges efficiently', () => {
      const { container } = render(
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <Badge key={i}>Badge {i + 1}</Badge>
          ))}
        </div>
      );
      
      expect(container.querySelectorAll('[class*="rounded-full"]')).toHaveLength(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      render(<Badge></Badge>);
      
      const badge = screen.getByRole('generic');
      expect(badge).toBeInTheDocument();
    });

    it('should handle very long text', () => {
      const longText = 'This is a very long badge text that might overflow the container and need to be handled properly';
      render(<Badge>{longText}</Badge>);
      
      const badge = screen.getByText(longText);
      expect(badge).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      render(<Badge>Special: @#$%^&*()</Badge>);
      
      const badge = screen.getByText('Special: @#$%^&*()');
      expect(badge).toBeInTheDocument();
    });

    it('should handle numbers', () => {
      render(<Badge>123</Badge>);
      
      const badge = screen.getByText('123');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work within other components', () => {
      render(
        <div>
          <h1>Title <Badge>New</Badge></h1>
          <p>Description with <Badge variant="secondary">Info</Badge></p>
        </div>
      );
      
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.getByText('Info')).toBeInTheDocument();
    });

    it('should work with flexbox layouts', () => {
      render(
        <div className="flex items-center gap-2">
          <span>Label</span>
          <Badge>Value</Badge>
        </div>
      );
      
      const badge = screen.getByText('Value');
      expect(badge).toBeInTheDocument();
    });
  });
}); 