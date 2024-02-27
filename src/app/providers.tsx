'use client'

import { ChakraProvider } from '@chakra-ui/react'
import AuthProvider from './lib/firebase/auth_provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider><ChakraProvider>{children}</ChakraProvider></AuthProvider>
}