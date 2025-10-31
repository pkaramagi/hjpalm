import type { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { TablerProvider } from 'tabler-react-ui';
import "@tabler/core/dist/css/tabler-themes.min.css";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <TablerProvider theme="light" radius="2">{children}</TablerProvider>
    </BrowserRouter>
  );
}
