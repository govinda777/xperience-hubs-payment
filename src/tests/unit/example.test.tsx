import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

describe('Home', () => {
  it('renders a heading', () => {
    customRender(<Home />);

    const heading = screen.getByRole('heading', {
      name: /welcome to next.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
