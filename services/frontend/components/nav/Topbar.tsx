
import { Box, Flex, Text, IconButton, useColorMode, useBreakpointValue } from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

interface TopbarProps {
  onOpen: () => void;
}

export const Topbar = ({ onOpen }: TopbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      bg="surface.dark"
      borderBottomColor="gray.700"
      borderBottomWidth="1px"
      h={16}
      px={4}
    >
      {isMobile && (
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          mr={4}
        />
      )}
      <Text fontSize="xl" fontWeight="bold">
        Dashboard
      </Text>
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Flex>
  );
};
