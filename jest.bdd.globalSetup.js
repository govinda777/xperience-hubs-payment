module.exports = async () => {
  console.log('🥒 Iniciando setup global para testes BDD...');
  
  // Setup global para ambiente de testes BDD
  process.env.NODE_ENV = 'test';
  process.env.NEXT_PUBLIC_ENV = 'test';
  
  // Configurações específicas para BDD
  process.env.BDD_TIMEOUT = '30000';
  process.env.BDD_RETRY_COUNT = '3';
  
  console.log('✅ Setup global BDD concluído');
};