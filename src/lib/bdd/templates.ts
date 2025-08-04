/**
 * Templates para criação consistente de testes BDD
 */

// Template para componentes React
export const COMPONENT_BDD_TEMPLATE = `
import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from '../ComponentName';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/component-name.feature');

defineFeature(feature, test => {
  let component: any;
  let mockProps: any;

  beforeEach(() => {
    mockProps = {
      // Setup inicial dos props
    };
  });

  test('Nome do cenário', ({ given, when, then }) => {
    given('que o usuário está na página', () => {
      component = render(<ComponentName {...mockProps} />);
    });

    when('o usuário interage com o componente', async () => {
      // Ações do usuário
    });

    then('o sistema deve responder adequadamente', () => {
      // Verificações
    });
  });
});
`;

// Template para casos de uso (Use Cases)
export const USE_CASE_BDD_TEMPLATE = `
import { defineFeature, loadFeature } from 'jest-cucumber';
import { UseCaseName } from '../UseCaseName';
import { Given, When, Then, TestDataBuilder, MockServiceHelper } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/use-case-name.feature');

defineFeature(feature, test => {
  let useCase: UseCaseName;
  let mockDependencies: any;
  let result: any;

  beforeEach(() => {
    mockDependencies = {
      // Setup dos mocks das dependências
    };
    useCase = new UseCaseName(...Object.values(mockDependencies));
  });

  test('Nome do cenário de negócio', ({ given, when, then }) => {
    given('que existe um contexto de negócio', () => {
      // Setup do contexto
    });

    when('o caso de uso é executado', async () => {
      result = await useCase.execute(/* parâmetros */);
    });

    then('o resultado deve atender às regras de negócio', () => {
      // Verificações das regras de negócio
    });
  });
});
`;

// Template para hooks
export const HOOK_BDD_TEMPLATE = `
import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderHook, act } from '@testing-library/react';
import { useHookName } from '../useHookName';
import { Given, When, Then, TestDataBuilder } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/hook-name.feature');

defineFeature(feature, test => {
  let hookResult: any;

  test('Nome do cenário do hook', ({ given, when, then }) => {
    given('que o hook é inicializado', () => {
      hookResult = renderHook(() => useHookName());
    });

    when('uma ação é executada', () => {
      act(() => {
        // Ação no hook
      });
    });

    then('o estado deve ser atualizado corretamente', () => {
      // Verificações do estado
    });
  });
});
`;

// Template para integração API/Service
export const SERVICE_BDD_TEMPLATE = `
import { defineFeature, loadFeature } from 'jest-cucumber';
import { ServiceName } from '../ServiceName';
import { Given, When, Then, MockServiceHelper } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/service-name.feature');

defineFeature(feature, test => {
  let service: ServiceName;
  let result: any;
  let error: any;

  beforeEach(() => {
    service = new ServiceName();
  });

  test('Nome do cenário de integração', ({ given, when, then }) => {
    given('que o serviço está configurado', () => {
      // Setup do serviço
    });

    when('uma operação é executada', async () => {
      try {
        result = await service.operation();
      } catch (err) {
        error = err;
      }
    });

    then('o resultado deve ser o esperado', () => {
      // Verificações
    });
  });
});
`;

// Template básico de feature file (.feature)
export const FEATURE_FILE_TEMPLATE = `
Feature: Nome da Funcionalidade
  Como um [tipo de usuário]
  Eu quero [objetivo]
  Para que [benefício/razão]

  Background:
    Given que o sistema está configurado
    And que existem dados de teste necessários

  Scenario: Cenário de sucesso principal
    Given que o usuário tem permissões adequadas
    When ele executa a ação principal
    Then o sistema deve responder com sucesso
    And o resultado deve ser visível para o usuário

  Scenario: Cenário de erro de validação
    Given que o usuário fornece dados inválidos
    When ele tenta executar a ação
    Then o sistema deve mostrar mensagem de erro
    And o usuário deve ser orientado sobre como corrigir

  Scenario: Cenário de autorização negada
    Given que o usuário não tem permissões adequadas
    When ele tenta executar a ação
    Then o sistema deve negar o acesso
    And mostrar mensagem apropriada
`;

// Template para testes de performance/stress
export const PERFORMANCE_BDD_TEMPLATE = `
import { defineFeature, loadFeature } from 'jest-cucumber';
import { Given, When, Then } from '@/lib/bdd/helpers';

const feature = loadFeature('./features/performance.feature');

defineFeature(feature, test => {
  let startTime: number;
  let endTime: number;
  let results: any[];

  test('Performance sob carga', ({ given, when, then }) => {
    given('que o sistema está sob carga normal', () => {
      results = [];
    });

    when('múltiplas operações são executadas simultaneamente', async () => {
      startTime = Date.now();
      
      const promises = Array.from({ length: 100 }, async () => {
        // Executar operação
      });
      
      results = await Promise.all(promises);
      endTime = Date.now();
    });

    then('todas as operações devem completar dentro do tempo aceitável', () => {
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(5000); // 5 segundos
      expect(results).toHaveLength(100);
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    });
  });
});
`;

export const BDD_TEMPLATES = {
  component: COMPONENT_BDD_TEMPLATE,
  useCase: USE_CASE_BDD_TEMPLATE,
  hook: HOOK_BDD_TEMPLATE,
  service: SERVICE_BDD_TEMPLATE,
  feature: FEATURE_FILE_TEMPLATE,
  performance: PERFORMANCE_BDD_TEMPLATE,
};