
import { Box, Heading, Text, Button, useColorMode, Switch, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { useAuth } from '../../lib/auth';
import { PageHeader } from '../../components/common/PageHeader';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <PageHeader title="Account" />
      <VStack spacing={8} align="start">
        <Box>
          <Heading size="md">Profile</Heading>
          <Text>Name: {user?.name}</Text>
          <Text>Email: {user?.email}</Text>
        </Box>
        <Box>
          <Heading size="md">Preferences</Heading>
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="color-mode-switch" mb="0">
              Dark Mode
            </FormLabel>
            <Switch id="color-mode-switch" isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
          </FormControl>
        </Box>
        <Button colorScheme="red" onClick={logout}>
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default AccountPage;
