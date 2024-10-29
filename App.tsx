import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Layout from './src/components/layout';
import StoreProvider from './src/providers/storeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 30 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Layout />
        </GestureHandlerRootView>
      </StoreProvider>
    </QueryClientProvider>
  );
}
