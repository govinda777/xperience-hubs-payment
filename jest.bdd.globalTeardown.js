module.exports = async () => {
  console.log('🧹 Executando teardown global para testes BDD...');
  
  // Cleanup global após todos os testes BDD
  // Limpar variáveis de ambiente específicas do teste
  delete process.env.BDD_TIMEOUT;
  delete process.env.BDD_RETRY_COUNT;
  
  console.log('✅ Teardown global BDD concluído');
};