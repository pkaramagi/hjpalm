import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TablerProvider } from 'tabler-react-ui';
import "@tabler/core/dist/css/tabler-themes.min.css";
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ModalProvider } from '@/components/common/ModalProvider';

const queryClient = new QueryClient();

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TablerProvider theme="light" radius="1">
            <ModalProvider>{children}</ModalProvider>
          </TablerProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
