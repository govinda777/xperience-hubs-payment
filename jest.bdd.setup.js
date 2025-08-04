import 'jest-cucumber';
import '@testing-library/jest-dom';

// Setup global para BDD
global.console = {
  ...console,
  // Silenciar logs desnecessários durante os testes
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Configurações globais para cenários BDD
beforeEach(() => {
  // Limpar localStorage antes de cada cenário
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
  
  // Resetar todos os mocks
  jest.clearAllMocks();
});

// Helper para aguardar condições assíncronas
global.waitForCondition = async (condition, timeout = 5000) => {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
};

// Helper para simular delays em cenários
global.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));