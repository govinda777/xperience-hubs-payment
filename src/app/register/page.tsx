import { RegisterForm } from '@/components/auth/RegisterForm';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Xperience Hubs
            </span>
          </Link>
        </div>

        {/* Register Form */}
        <RegisterForm 
          onSuccess={() => {
            // TODO: Redirect to onboarding or dashboard
            console.log('Registration successful');
          }}
          onError={(error) => {
            console.error('Registration error:', error);
            // TODO: Show error toast/notification
          }}
        />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Termos de Serviço
            </Link>{' '}
            e{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 