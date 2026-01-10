import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000, // Cache time: 5 minutes
      staleTime: 1 * 60 * 1000, // Stale time: 1 minute
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
    mutations: {
      retry: 1,
    },
  },
});

export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (search?: string, category?: string) => 
      ['products', 'list', search, category] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  users: {
    all: ['users'] as const,
    list: () => ['users', 'list'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
};
