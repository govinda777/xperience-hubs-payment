## Estrutura de Pastas do Projeto Xperience Hubs Payment

A arquitetura de pastas do projeto Xperience Hubs Payment é desenhada para refletir a modularidade, escalabilidade e centralização da lógica em smart contracts. A seguir, um exemplo de como a estrutura costuma ser organizada, alinhada às melhores práticas de projetos Next.js modernos e à abordagem de use cases:

```
/xperience-hubs-payment
│
├── public/                  # Arquivos estáticos (imagens, favicon, etc.)
├── pages/                   # Rotas dinâmicas do Next.js
│   ├── [contractAddress]/   # Hotsite dinâmico de cada lojista
│   │   ├── index.js         # Página principal do lojista
│   │   ├── checkout.js      # Checkout dinâmico
│   │   ├── products/
│   │   │   └── [productId].js # Detalhes de produto
│   │   ├── dashboard.js     # Painel administrativo
│   │   └── [...slug].js     # Catch-all para rotas personalizadas
│   └── api/                 # APIs customizadas (se necessário)
│
├── use_cases/               # Módulos de funcionalidades (use cases)
│   ├── checkout/
│   │   └── index.js
│   ├── onboarding/
│   │   └── index.js
│   ├── mintNFT/
│   │   └── index.js
│   └── accessValidation/
│       └── index.js
│
├── components/              # Componentes reutilizáveis de UI
│   ├── Layout/
│   ├── ProductCard/
│   ├── NFTDisplay/
│   └── ...
│
├── hooks/                   # Hooks customizados (ex: leitura on-chain)
│   ├── useContractData.js
│   ├── useNFTStatus.js
│   └── ...
│
├── services/                # Serviços auxiliares (ex: integração PIX, web3)
│   ├── pixService.js
│   ├── web3Service.js
│   └── ...
│
├── abi/                     # ABIs dos smart contracts
│   ├── LojistaContract.json
│   └── ...
│
├── tests/                   # Testes automatizados
│   ├── use_cases/
│   ├── components/
│   └── ...
│
├── package.json
├── README.md
└── ...                      # Outros arquivos de configuração
```

### Destaques da Estrutura

- **pages/[contractAddress]/**: Rotas dinâmicas para múltiplos lojistas, cada um com seu próprio hotsite, checkout, painel e produtos.
- **use_cases/**: Cada fluxo de negócio (onboarding, checkout, mint de NFT, validação de acesso) é encapsulado em um módulo independente, facilitando manutenção e expansão.
- **components/**: UI modular e reutilizável para garantir consistência visual e agilidade no desenvolvimento.
- **hooks/**: Hooks customizados para leitura de dados on-chain, status de NFTs e integração com smart contracts.
- **services/**: Serviços para integração com sistemas externos, como PIX e web3.
- **abi/**: Armazena os ABIs dos contratos inteligentes para facilitar integração e manutenção.
- **tests/**: Estrutura pronta para testes automatizados, garantindo robustez e confiabilidade.

Essa arquitetura permite rápida evolução, personalização por lojista e integração transparente com blockchain, alinhando-se ao modelo dinâmico e elástico proposto para o Xperience Hubs Payment.

[1] https://github.com/PayHelper/payments-hub
[2] https://www.pwc.in/assets/pdfs/consulting/financial-services/fintech/point-of-view/pov-downloads/payments-hub-redefining-payments-infrastructure.pdf
[3] https://omdia.tech.informa.com/om021010/fundamentals-of-payment-hubs-key-features-and-requirements
[4] https://www.bottomline.com/resources/payments-hub
[5] https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346?permalink_comment_id=1768060
[6] https://www.youtube.com/watch?v=SP_X_XfTDjE
[7] https://experienceleague.adobe.com/en/docs/experience-manager-65/content/forms/use-aem-forms-workspace/folder-structure
[8] https://dev.to/barryosull/folder-structure-and-frameworks-what-is-exerting-control-4kpi
[9] https://www.nomentia.com/blog/payment-hub-implementation-checklist
[10] https://developer.salesforce.com/docs/atlas.en-us.communities_dev.meta/communities_dev/communities_dev_migrate_expbundle.htm
[11] https://github.com/angular/angular/issues/61157
[12] https://github.com/projectsend/projectsend/issues/129
[13] https://docs.github.com/en/webhooks/webhook-events-and-payloads
[14] https://experienceleague.adobe.com/en/docs/experience-platform/sources/sdk/documentation/github
[15] https://stackoverflow.com/questions/25881079/github-setup-for-freelance-employer-use-case
[16] https://stackoverflow.com/questions/57122435/github-folder-structure-or-layout-issue/57130603
[17] https://github.com/w3c-webmob/payments-use-cases/blob/master/existingpaymentsolutions.md
[18] https://www.youtube.com/watch?v=WUoFZKYDDCQ
[19] https://stackoverflow.com/questions/16897723/how-to-add-my-current-project-to-an-already-existing-github-repository
[20] https://github.com/lokeshmori/Payment-Processing-System
[21] https://github.com/mermaid-js/mermaid/issues/2645
[22] https://www.nomentia.com/blog/implementing-a-global-enterprise-scale-payment-hub-the-challenges-and-business-impacts
[23] https://github.com/joshuaalpuerto/node-ddd-boilerplate/blob/master/docs/organization-architecture/folder-structure.md
[24] https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/implementing/developing/repository-structure-package
[25] https://www.finastra.com/sites/default/files/file/2024-04/resource-embracing-revenue-generating-opportunities-modern-payment-hub.pdf
[26] https://docs.kentico.com/documentation/developers-and-admins/configuration/content-hub-configuration
[27] https://stackoverflow.com/questions/60619940/design-structuring-a-large-enterprice-signalr-core-project-multiple-hubs-only
[28] https://finzly.com/insights/the-rise-of-payment-hub-20-from-tech-upgrade-to-strategic-imperative/
[29] https://docs.kentico.com/api/content-management/content-hub-folders
[30] https://omdia.tech.informa.com/om123092/market-fundamentals-payment-hubs-202425
[31] https://stackoverflow.com/questions/41570076/how-to-pull-the-specific-folder-from-github-repository
[32] https://github.com/expo/expo/issues/5927
[33] https://github.com/TheXperienceProject
[34] https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages
[35] https://github.com/openMF/ph-ee-operations-web/issues/87
[36] https://github.com/project-chip/connectedhomeip
[37] https://github.com/parcel-bundler/parcel/issues/233
