
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    primary: {
      light: '#3182CE',
      dark: '#63B3ED',
    },
    surface: {
      light: '#FFFFFF',
      dark: '#1A202C',
    },
    muted: {
      light: '#718096',
      dark: '#A0AEC0',
    },
    danger: {
      light: '#E53E3E',
      dark: '#FC8181',
    },
    success: {
      light: '#38A169',
      dark: '#68D391',
    },
  },
  radii: {
    md: '0.375rem',
    lg: '0.5rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
});
