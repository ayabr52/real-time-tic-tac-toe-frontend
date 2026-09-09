'use client';

import { createContext, useContext, ReactNode } from 'react';
import Echo from 'laravel-echo';
import echoInstance from '@/lib/echo';

const EchoContext = createContext<Echo<any> | null>(null);

export const EchoProvider = ({ children }: { children: ReactNode }) => {
  return (
    <EchoContext.Provider value={echoInstance}>
      {children}
    </EchoContext.Provider>
  );
};

export const useEcho = (): Echo<any> | null => useContext(EchoContext);