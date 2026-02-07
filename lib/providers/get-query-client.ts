import { isServer, QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        // cacheTime: 30 * 60 * 1000, // 30 minutes
        // refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | null = null;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}