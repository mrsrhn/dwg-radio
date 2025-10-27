import React, { createContext } from 'react';
import RootStore from '../stores/rootStore';

export const rootStore = new RootStore();
export const RootStoreContext = createContext<RootStore>(rootStore);

interface StoreProviderProps {
  children: React.ReactNode;
}

function StoreProvider(props: StoreProviderProps) {
  const { children } = props;
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
}

export default StoreProvider;
