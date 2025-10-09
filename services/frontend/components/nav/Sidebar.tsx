
import { Box, VStack, Link as ChakraLink, Text, Drawer, DrawerContent, DrawerOverlay, useBreakpointValue, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AppRoutes } from '../../lib/routes';
import { useAuth } from '../../lib/auth';

const NAV_ITEMS = [
  { label: 'Home', href: AppRoutes.HOME },
  { label: 'Devices', href: AppRoutes.DEVICES },
  { label: 'Alerts', href: AppRoutes.ALERTS },
  { label: 'Rules', href: AppRoutes.RULES },
  { label: 'Telemetry', href: AppRoutes.TELEMETRY },
  { label: 'Account', href: AppRoutes.ACCOUNT },
];

const SidebarContent = () => {
  const { logout } = useAuth();
  return (
    <VStack spacing={4} align="stretch" h="full">
      <Text fontSize="2xl" fontWeight="bold" color="white" mb={8}>
        IoT Fleet
      </Text>
      {NAV_ITEMS.map((item) => (
        <ChakraLink
          key={item.label}
          as={NextLink}
          href={item.href}
          p={2}
          borderRadius="md"
          _hover={{ bg: 'primary.dark' }}
          color="muted.dark"
        >
          {item.label}
        </ChakraLink>
      ))}
      <Box flex={1} />
      <Button onClick={logout} colorScheme="red">Logout</Button>
    </VStack>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const isDrawer = useBreakpointValue({ base: true, md: false });

  if (isDrawer) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="surface.dark" p={4}>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="full"
      w={60}
      bg="surface.dark"
      borderRightColor="gray.700"
      borderRightWidth="1px"
      p={4}
    >
      <SidebarContent />
    </Box>
  );
};
