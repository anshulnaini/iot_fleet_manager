
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import { AppShell } from '../components/app/AppShell';
import { AppRoutes } from '../lib/routes';
import { AuthProvider, useAuth } from '../lib/auth';
import { useEffect } from 'react';

const AppContent = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isPublicRoute = router.pathname === AppRoutes.LOGIN;

  useEffect(() => {
    if (!isAuthenticated && !isPublicRoute) {
      router.push(AppRoutes.LOGIN);
    }
  }, [isAuthenticated, isPublicRoute, router]);

  if (!isAuthenticated && !isPublicRoute) {
    return null; // or a loading spinner
  }

  if (isPublicRoute) {
    return <Component {...pageProps} />;
  }

  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
};

function MyApp(props: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
