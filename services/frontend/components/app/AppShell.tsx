
import { Box, useDisclosure, useBreakpointValue } from '@chakra-ui/react';
import { Sidebar } from '../nav/Sidebar';
import { Topbar } from '../nav/Topbar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Box>
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box ml={isDesktop ? 60 : 0}> {/* Margin to offset for the sidebar width on desktop */}
        <Topbar onOpen={onOpen} />
        <Box as="main" p={8}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
