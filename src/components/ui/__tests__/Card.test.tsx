import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card';

describe('Card Component', () => {
  describe('Card', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card', 'text-card-foreground', 'shadow-sm');
    });

    it('applies custom className', () => {
      render(<Card className="custom-class">Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toHaveClass('custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(<Card ref={ref}>Card content</Card>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('CardHeader', () => {
    it('renders with default props', () => {
      render(<CardHeader>Header content</CardHeader>);
      const header = screen.getByText('Header content');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>);
      const header = screen.getByText('Header content');
      expect(header).toHaveClass('custom-header');
    });
  });

  describe('CardTitle', () => {
    it('renders with default props', () => {
      render(<CardTitle>Card Title</CardTitle>);
      const title = screen.getByRole('heading', { name: 'Card Title' });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight');
    });

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>);
      const title = screen.getByRole('heading', { name: 'Card Title' });
      expect(title).toHaveClass('custom-title');
    });
  });

  describe('CardDescription', () => {
    it('renders with default props', () => {
      render(<CardDescription>Card description</CardDescription>);
      const description = screen.getByText('Card description');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });

    it('applies custom className', () => {
      render(<CardDescription className="custom-description">Card description</CardDescription>);
      const description = screen.getByText('Card description');
      expect(description).toHaveClass('custom-description');
    });
  });

  describe('CardContent', () => {
    it('renders with default props', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('CardFooter', () => {
    it('renders with default props', () => {
      render(<CardFooter>Footer content</CardFooter>);
      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>);
      const footer = screen.getByText('Footer content');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Card Composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
      expect(screen.getByText('Test Footer')).toBeInTheDocument();
    });

    it('maintains proper styling hierarchy', () => {
      render(
        <Card className="card-wrapper">
          <CardHeader className="header-wrapper">
            <CardTitle className="title-wrapper">Title</CardTitle>
            <CardDescription className="description-wrapper">Description</CardDescription>
          </CardHeader>
          <CardContent className="content-wrapper">Content</CardContent>
          <CardFooter className="footer-wrapper">Footer</CardFooter>
        </Card>
      );

      const card = screen.getByText('Content').closest('div');
      expect(card).toHaveClass('card-wrapper', 'rounded-lg', 'border', 'bg-card');

      const header = screen.getByText('Title').closest('div');
      expect(header).toHaveClass('header-wrapper', 'flex', 'flex-col', 'space-y-1.5', 'p-6');

      const title = screen.getByRole('heading');
      expect(title).toHaveClass('title-wrapper', 'text-2xl', 'font-semibold');

      const description = screen.getByText('Description');
      expect(description).toHaveClass('description-wrapper', 'text-sm', 'text-muted-foreground');

      const content = screen.getByText('Content');
      expect(content).toHaveClass('content-wrapper', 'p-6', 'pt-0');

      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('footer-wrapper', 'flex', 'items-center', 'p-6', 'pt-0');
    });
  });
}); 