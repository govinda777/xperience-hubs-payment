'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, Copy, QrCode, CreditCard, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

type CheckoutStep = 'cart' | 'payment' | 'pix' | 'success';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [pixCode, setPixCode] = useState('');
  const [pixExpiration, setPixExpiration] = useState<Date | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const generatePixCode = async () => {
    setIsGeneratingPix(true);
    try {
      // TODO: Integrate with PIX payment service
      // Simulate PIX generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock PIX code
      setPixCode('00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Xperience Hubs6009Sao Paulo62070503***6304E2CA');
      
      // Set expiration to 30 minutes from now
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 30);
      setPixExpiration(expiration);
      
      setOrderId(`ORDER-${Date.now()}`);
      setCurrentStep('pix');
    } catch (error) {
      console.error('Error generating PIX:', error);
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      // TODO: Show success toast
    } catch (error) {
      console.error('Error copying PIX code:', error);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      // TODO: Check payment status from API
      // Simulate payment confirmation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsPaymentConfirmed(true);
      setCurrentStep('success');
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  useEffect(() => {
    if (currentStep === 'pix' && pixExpiration) {
      const interval = setInterval(() => {
        if (new Date() >= pixExpiration) {
          setCurrentStep('payment');
          setPixCode('');
          setPixExpiration(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, pixExpiration]);

  useEffect(() => {
    if (currentStep === 'pix' && !isPaymentConfirmed) {
      const interval = setInterval(checkPaymentStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [currentStep, isPaymentConfirmed]);

  if (items.length === 0 && currentStep !== 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao seu carrinho antes de finalizar a compra.
            </p>
            <Button asChild>
              <Link href="/demo">
                Continuar Comprando
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/demo">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Loja
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground">
            Complete sua compra de forma segura com PIX
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Review */}
            {currentStep === 'cart' && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Carrinho</CardTitle>
                  <CardDescription>
                    Revise os itens antes de prosseguir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.imageUrl || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </p>
                        {item.product.isNFT && (
                          <Badge className="mt-1 bg-purple-500 text-white text-xs">
                            NFT
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={() => setCurrentStep('payment')}
                    className="w-full"
                    size="lg"
                  >
                    Continuar para Pagamento
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Selection */}
            {currentStep === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pagamento</CardTitle>
                  <CardDescription>
                    Escolha como deseja pagar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={generatePixCode}
                      disabled={isGeneratingPix}
                      className="w-full h-16 text-left p-4"
                      variant="outline"
                    >
                      <div className="flex items-center space-x-4">
                        <QrCode className="w-8 h-8 text-green-600" />
                        <div>
                          <div className="font-semibold">PIX</div>
                          <div className="text-sm text-muted-foreground">
                            Pagamento instantâneo
                          </div>
                        </div>
                      </div>
                      {isGeneratingPix && (
                        <Loader2 className="w-5 h-5 animate-spin ml-auto" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PIX Payment */}
            {currentStep === 'pix' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pagamento PIX</CardTitle>
                  <CardDescription>
                    Escaneie o QR Code ou copie o código PIX
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code */}
                  <div className="qr-code-container">
                    <div className="qr-code bg-white p-4 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Escaneie com o app do seu banco
                    </p>
                  </div>

                  {/* PIX Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Código PIX</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={pixCode}
                        readOnly
                        className="input flex-1 font-mono text-sm"
                      />
                      <Button
                        onClick={copyPixCode}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expiration */}
                  {pixExpiration && (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Este código expira em{' '}
                        {Math.max(0, Math.floor((pixExpiration.getTime() - Date.now()) / 1000 / 60))} minutos
                      </p>
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Aguardando pagamento...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success */}
            {currentStep === 'success' && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
                  <p className="text-muted-foreground mb-4">
                    Seu pedido foi processado com sucesso.
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <p className="text-sm font-mono">Pedido: {orderId}</p>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/demo">
                        Continuar Comprando
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/dashboard">
                        Ver Meus Pedidos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="flex-1">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frete:</span>
                    <span className="text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Pagamento seguro com PIX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Dados criptografados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Confirmação instantânea</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 