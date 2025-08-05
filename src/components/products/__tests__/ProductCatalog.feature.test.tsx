import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCatalog } from '../ProductCatalog';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/products/product-catalog.feature');

defineFeature(feature, test => {
  let component: any;
  let mockProducts: any[];
  let mockOnProductClick: jest.Mock;

  beforeEach(() => {
    mockOnProductClick = jest.fn();
    mockProducts = [
      TestDataBuilder.createProduct({
        id: 'product-1',
        name: 'VIP Concert Ticket',
        price: TestDataBuilder.createMoney(15000), // R$ 150,00
        description: 'Acesso VIP ao concerto',
        images: ['https://example.com/image1.jpg'],
        isActive: true,
        nftEnabled: true
      }),
      TestDataBuilder.createProduct({
        id: 'product-2',
        name: 'Regular Concert Ticket',
        price: TestDataBuilder.createMoney(8000), // R$ 80,00
        description: 'Acesso regular ao concerto',
        images: ['https://example.com/image2.jpg'],
        isActive: true,
        nftEnabled: false
      })
    ];
  });

  test('Visualização do catálogo de produtos', ({ given, when, then, and }) => {
    given('que existem produtos disponíveis no marketplace', () => {
      expect(mockProducts).toHaveLength(2);
      expect(mockProducts[0].name).toBe('VIP Concert Ticket');
      expect(mockProducts[1].name).toBe('Regular Concert Ticket');
    });

    when('eu acesso a página do catálogo', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );
    });

    then('devo visualizar uma lista de produtos', () => {
      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();
    });

    and('cada produto deve exibir', () => {
      // Verificar imagem
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);

      // Verificar nome
      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();

      // Verificar preço
      expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 80,00')).toBeInTheDocument();

      // Verificar descrição
      expect(screen.getByText('Acesso VIP ao concerto')).toBeInTheDocument();
      expect(screen.getByText('Acesso regular ao concerto')).toBeInTheDocument();

      // Verificar badge NFT
      expect(screen.getByText('NFT')).toBeInTheDocument();
    });

    and('devo poder navegar entre as páginas do catálogo', () => {
      const pagination = screen.getByRole('navigation');
      expect(pagination).toBeInTheDocument();
    });
  });

  test('Busca de produtos por nome', ({ given, when, then, and }) => {
    given('que existem produtos com nomes variados', () => {
      expect(mockProducts).toHaveLength(2);
    });

    when('eu digito "concert" no campo de busca', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );

      const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
      fireEvent.change(searchInput, { target: { value: 'concert' } });
    });

    and('eu clico no botão de buscar', () => {
      const searchButton = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(searchButton);
    });

    then('devo visualizar apenas produtos que contenham "concert" no nome', () => {
      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();
    });

    and('a busca deve ser case-insensitive', () => {
      const searchInput = screen.getByPlaceholderText(/buscar produtos/i);
      fireEvent.change(searchInput, { target: { value: 'CONCERT' } });
      
      const searchButton = screen.getByRole('button', { name: /buscar/i });
      fireEvent.click(searchButton);

      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();
    });

    and('devo ver a quantidade de resultados encontrados', () => {
      expect(screen.getByText(/2 produtos encontrados/i)).toBeInTheDocument();
    });

    and('devo poder limpar a busca para ver todos os produtos', () => {
      const clearButton = screen.getByRole('button', { name: /limpar/i });
      fireEvent.click(clearButton);

      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();
    });
  });

  test('Filtro por categoria de produto', ({ given, when, then, and }) => {
    given('que existem produtos de diferentes categorias', () => {
      mockProducts = [
        TestDataBuilder.createProduct({
          id: 'product-1',
          name: 'VIP Concert Ticket',
          category: 'Eventos',
          price: TestDataBuilder.createMoney(15000)
        }),
        TestDataBuilder.createProduct({
          id: 'product-2',
          name: 'T-Shirt',
          category: 'Merchandise',
          price: TestDataBuilder.createMoney(5000)
        })
      ];
    });

    when('eu seleciono a categoria "Eventos"', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );

      const categorySelect = screen.getByLabelText(/categoria/i);
      fireEvent.change(categorySelect, { target: { value: 'Eventos' } });
    });

    then('devo visualizar apenas produtos da categoria "Eventos"', () => {
      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.queryByText('T-Shirt')).not.toBeInTheDocument();
    });

    and('o filtro deve ser aplicado corretamente', () => {
      expect(screen.getByText(/1 produto encontrado/i)).toBeInTheDocument();
    });

    and('devo poder combinar com outros filtros', () => {
      const priceFilter = screen.getByLabelText(/preço máximo/i);
      fireEvent.change(priceFilter, { target: { value: '20000' } });

      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
    });

    and('devo poder remover o filtro aplicado', () => {
      const clearFiltersButton = screen.getByRole('button', { name: /limpar filtros/i });
      fireEvent.click(clearFiltersButton);

      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('T-Shirt')).toBeInTheDocument();
    });
  });

  test('Filtro por disponibilidade de NFT', ({ given, when, then, and }) => {
    given('que existem produtos com e sem NFT', () => {
      expect(mockProducts[0].nftEnabled).toBe(true);
      expect(mockProducts[1].nftEnabled).toBe(false);
    });

    when('eu ativo o filtro "Apenas produtos com NFT"', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );

      const nftFilter = screen.getByLabelText(/apenas produtos com nft/i);
      fireEvent.click(nftFilter);
    });

    then('devo visualizar apenas produtos que geram NFT', () => {
      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.queryByText('Regular Concert Ticket')).not.toBeInTheDocument();
    });

    and('cada produto deve exibir o badge de NFT', () => {
      const nftBadges = screen.getAllByText('NFT');
      expect(nftBadges).toHaveLength(1);
    });

    and('devo poder desativar o filtro', () => {
      const nftFilter = screen.getByLabelText(/apenas produtos com nft/i);
      fireEvent.click(nftFilter);

      expect(screen.getByText('VIP Concert Ticket')).toBeInTheDocument();
      expect(screen.getByText('Regular Concert Ticket')).toBeInTheDocument();
    });
  });

  test('Visualização de detalhes do produto', ({ given, when, then, and }) => {
    given('que existe um produto no catálogo', () => {
      expect(mockProducts[0]).toBeDefined();
    });

    when('eu clico no produto para ver detalhes', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );

      const productCard = screen.getByText('VIP Concert Ticket').closest('div');
      fireEvent.click(productCard!);
    });

    then('devo ser direcionado para a página de detalhes', () => {
      expect(mockOnProductClick).toHaveBeenCalledWith('product-1');
    });

    and('devo visualizar informações completas', () => {
      // Este teste seria implementado na página de detalhes do produto
      expect(mockOnProductClick).toHaveBeenCalledTimes(1);
    });

    and('devo poder adicionar o produto ao carrinho', () => {
      const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      expect(addToCartButton).toBeInTheDocument();
    });
  });

  test('Produto com estoque limitado', ({ given, when, then, and }) => {
    given('que existe um produto com estoque baixo', () => {
      mockProducts = [
        TestDataBuilder.createProduct({
          id: 'product-1',
          name: 'Limited Edition Ticket',
          price: TestDataBuilder.createMoney(15000),
          stock: 3
        })
      ];
    });

    when('eu visualizo o produto no catálogo', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );
    });

    then('devo ver um indicador de "Estoque limitado"', () => {
      expect(screen.getByText('Estoque limitado')).toBeInTheDocument();
    });

    and('devo ver a quantidade exata disponível', () => {
      expect(screen.getByText('Apenas 3 unidades disponíveis')).toBeInTheDocument();
    });

    and('devo ser alertado sobre a escassez', () => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Estoque limitado');
    });
  });

  test('Produto esgotado', ({ given, when, then, and }) => {
    given('que existe um produto sem estoque', () => {
      mockProducts = [
        TestDataBuilder.createProduct({
          id: 'product-1',
          name: 'Sold Out Ticket',
          price: TestDataBuilder.createMoney(15000),
          stock: 0
        })
      ];
    });

    when('eu visualizo o produto no catálogo', () => {
      component = render(
        <ProductCatalog 
          products={mockProducts}
          onProductClick={mockOnProductClick}
        />
      );
    });

    then('devo ver o status "Esgotado"', () => {
      expect(screen.getByText('Esgotado')).toBeInTheDocument();
    });

    and('o botão de adicionar ao carrinho deve estar desabilitado', () => {
      const addToCartButton = screen.getByRole('button', { name: /adicionar ao carrinho/i });
      expect(addToCartButton).toBeDisabled();
    });

    and('devo poder ativar notificação de reabastecimento', () => {
      const notifyButton = screen.getByRole('button', { name: /notificar quando disponível/i });
      expect(notifyButton).toBeInTheDocument();
    });
  });
}); 