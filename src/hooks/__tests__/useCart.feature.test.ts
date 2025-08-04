import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCart } from '../useCart';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';
import { Product } from '@/core/entities/Product';

// Carrega o arquivo .feature correspondente
const feature = loadFeature('./features/cart/cart-management.feature');

defineFeature(feature, test => {
  let hookResult: any;
  let product1: Product;
  let product2: Product;
  let localStorageMock: any;

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Criar produtos de teste
    product1 = TestDataBuilder.createProduct({
      id: 'product-1',
      name: 'Camiseta',
      price: TestDataBuilder.createMoney(5000), // R$ 50,00
    });

    product2 = TestDataBuilder.createProduct({
      id: 'product-2',
      name: 'Tênis',
      price: TestDataBuilder.createMoney(20000), // R$ 200,00
      // discountPercentage: 10,
    });

    jest.clearAllMocks();
  });

  test('Adicionar produto ao carrinho vazio', ({ given, when, then, and }) => {
    given('que o carrinho está vazio', () => {
      localStorageMock.getItem.mockReturnValue(null);
      hookResult = renderHook(() => useCart());
      
      expect(hookResult.result.current.items).toEqual([]);
      expect(hookResult.result.current.totalItems).toBe(0);
    });

    and('que existe um produto "Camiseta" com preço R$ 50,00', () => {
      expect(product1.name).toBe('Camiseta');
      expect(product1.price).toBe(50);
    });

    when('o cliente adiciona 2 unidades do produto ao carrinho', () => {
      act(() => {
        hookResult.result.current.addToCart(product1, 2);
      });
    });

    then('o carrinho deve conter 1 item', () => {
      expect(hookResult.result.current.items).toHaveLength(1);
    });

    and('o item deve ter quantidade 2', () => {
      expect(hookResult.result.current.items[0].quantity).toBe(2);
      expect(hookResult.result.current.totalItems).toBe(2);
    });

    and('o total do carrinho deve ser R$ 100,00', () => {
      expect(hookResult.result.current.totalPrice).toBe(100);
    });

    and('o carrinho deve ser salvo no localStorage', () => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cart',
        expect.stringContaining('Camiseta')
      );
    });
  });

  test('Adicionar produto já existente no carrinho', ({ given, when, then, and }) => {
    given('que existe um produto "Camiseta" já no carrinho com quantidade 1', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
      });
      
      expect(hookResult.result.current.items).toHaveLength(1);
      expect(hookResult.result.current.items[0].quantity).toBe(1);
    });

    when('o cliente adiciona mais 2 unidades do mesmo produto', () => {
      act(() => {
        hookResult.result.current.addToCart(product1, 2);
      });
    });

    then('o carrinho deve conter 1 item', () => {
      expect(hookResult.result.current.items).toHaveLength(1);
    });

    and('a quantidade do item deve ser 3', () => {
      expect(hookResult.result.current.items[0].quantity).toBe(3);
      expect(hookResult.result.current.totalItems).toBe(3);
    });

    and('o total deve ser atualizado para R$ 150,00', () => {
      expect(hookResult.result.current.totalPrice).toBe(150);
    });
  });

  test('Atualizar quantidade de produto no carrinho', ({ given, when, then, and }) => {
    given('que existe um produto "Camiseta" no carrinho com quantidade 2', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 2);
      });
      
      expect(hookResult.result.current.items[0].quantity).toBe(2);
    });

    when('o cliente atualiza a quantidade para 5', () => {
      act(() => {
        hookResult.result.current.updateQuantity(product1.id, 5);
      });
    });

    then('a quantidade do produto deve ser 5', () => {
      expect(hookResult.result.current.items[0].quantity).toBe(5);
      expect(hookResult.result.current.totalItems).toBe(5);
    });

    and('o total deve ser atualizado para R$ 250,00', () => {
      expect(hookResult.result.current.totalPrice).toBe(250);
    });

    and('as alterações devem ser salvas no localStorage', () => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  test('Remover produto do carrinho', ({ given, when, then, and }) => {
    given('que existem 2 produtos diferentes no carrinho', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
        hookResult.result.current.addToCart(product2, 1);
      });
      
      expect(hookResult.result.current.items).toHaveLength(2);
    });

    when('o cliente remove um dos produtos', () => {
      act(() => {
        hookResult.result.current.removeFromCart(product1.id);
      });
    });

    then('o carrinho deve conter apenas 1 produto', () => {
      expect(hookResult.result.current.items).toHaveLength(1);
    });

    and('o total deve ser recalculado', () => {
      // Produto2 tem desconto de 10%: 200 * 0.9 = 180
      expect(hookResult.result.current.totalPrice).toBe(180);
    });

    and('o produto removido não deve aparecer na lista', () => {
      const remainingProduct = hookResult.result.current.items[0];
      expect(remainingProduct.product.id).toBe(product2.id);
      expect(remainingProduct.product.id).not.toBe(product1.id);
    });
  });

  test('Limpar carrinho completamente', ({ given, when, then, and }) => {
    given('que existem 3 produtos no carrinho', () => {
      hookResult = renderHook(() => useCart());
      
      const product3 = TestDataBuilder.createProduct({
        id: 'product-3',
        name: 'Calça',
        price: TestDataBuilder.createMoney(8000), // R$ 80,00
      });
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
        hookResult.result.current.addToCart(product2, 1);
        hookResult.result.current.addToCart(product3, 1);
      });
      
      expect(hookResult.result.current.items).toHaveLength(3);
    });

    when('o cliente limpa o carrinho', () => {
      act(() => {
        hookResult.result.current.clearCart();
      });
    });

    then('o carrinho deve estar vazio', () => {
      expect(hookResult.result.current.items).toEqual([]);
      expect(hookResult.result.current.totalItems).toBe(0);
    });

    and('o total deve ser R$ 0,00', () => {
      expect(hookResult.result.current.totalPrice).toBe(0);
      expect(hookResult.result.current.subtotal).toBe(0);
    });

    and('o localStorage deve ser limpo', () => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', '[]');
    });
  });

  test('Carrinho com produtos com desconto', ({ given, when, then, and }) => {
    given('que existe um produto "Tênis" com preço R$ 200,00 e 10% de desconto', () => {
      expect(product2.name).toBe('Tênis');
      expect(product2.price).toBe(200);
      expect(product2.discountPercentage).toBe(10);
    });

    when('o cliente adiciona 1 unidade ao carrinho', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product2, 1);
      });
    });

    then('o subtotal deve ser R$ 200,00', () => {
      expect(hookResult.result.current.subtotal).toBe(200);
    });

    and('o total com desconto deve ser R$ 180,00', () => {
      // 200 * (1 - 0.10) = 180
      expect(hookResult.result.current.totalPrice).toBe(180);
    });

    and('a economia deve ser exibida como R$ 20,00', () => {
      const economia = hookResult.result.current.subtotal - hookResult.result.current.totalPrice;
      expect(economia).toBe(20);
    });
  });

  test('Verificar se produto está no carrinho', ({ given, when, then }) => {
    given('que existe um produto "Camiseta" no carrinho', () => {
      hookResult = renderHook(() => useCart());
      
      act(() => {
        hookResult.result.current.addToCart(product1, 1);
      });
    });

    when('o sistema verifica se o produto está no carrinho', () => {
      // Esta verificação será feita no then
    });

    then('deve retornar verdadeiro', () => {
      expect(hookResult.result.current.isInCart(product1.id)).toBe(true);
    });

    when('o sistema verifica um produto que não está no carrinho', () => {
      // Esta verificação será feita no then
    });

    then('deve retornar falso', () => {
      expect(hookResult.result.current.isInCart(product2.id)).toBe(false);
    });
  });
});