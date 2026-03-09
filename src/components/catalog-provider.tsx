'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { CatalogData } from '@/lib/catalog-types';

const CatalogContext = createContext<CatalogData | null>(null);

export function CatalogProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: CatalogData;
}) {
  return (
    <CatalogContext.Provider value={initialData}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);

  if (!context) {
    throw new Error('useCatalog must be used within CatalogProvider.');
  }

  return context;
}
