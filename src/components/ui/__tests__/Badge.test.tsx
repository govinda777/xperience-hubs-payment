import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('renders with default props', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('inline-flex', 'items-center', 'rounded-full', 'border', 'px-2.5', 'py-0.5', 'text-xs', 'font-semibold');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('border-transparent', 'bg-primary', 'text-primary-foreground');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('border-transparent', 'bg-secondary', 'text-secondary-foreground');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('border-transparent', 'bg-destructive', 'text-destructive-foreground');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('text-foreground');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom Badge</Badge>);
    const badge = screen.getByText('Custom Badge');
    expect(badge).toHaveClass('custom-badge');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders with focus styles', () => {
    render(<Badge>Focus Badge</Badge>);
    const badge = screen.getByText('Focus Badge');
    expect(badge).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring', 'focus:ring-offset-2');
  });

  it('renders with transition styles', () => {
    render(<Badge>Transition Badge</Badge>);
    const badge = screen.getByText('Transition Badge');
    expect(badge).toHaveClass('transition-colors');
  });

  it('renders with hover effects for variants', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('hover:bg-primary/80');

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('hover:bg-secondary/80');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('hover:bg-destructive/80');
  });

  it('renders outline variant without hover effects', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText('Outline');
    expect(badge).not.toHaveClass('hover:bg-');
  });

  it('maintains proper styling with custom className', () => {
    render(<Badge variant="default" className="custom-class">Styled Badge</Badge>);
    const badge = screen.getByText('Styled Badge');
    expect(badge).toHaveClass(
      'custom-class',
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2',
      'border-transparent',
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/80'
    );
  });
}); 