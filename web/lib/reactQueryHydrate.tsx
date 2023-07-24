"use client";

import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface ReactQueryHydrateProps {
  state: any;
  children: ReactNode;
}

const ReactQueryHydrate: React.FC<ReactQueryHydrateProps> = ({
  state,
  children,
}) => {
  const queryClientRef = React.useRef<QueryClient | null>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
    for (const key in state) {
      queryClientRef.current.setQueryData(key, state[key]);
    }
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryHydrate;
