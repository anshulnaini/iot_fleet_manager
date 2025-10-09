
import { Box, SimpleGrid, Card, CardHeader, Heading, CardBody, Text, Button, Stack } from '@chakra-ui/react';
import { useDevices } from '../features/devices/hooks';
import { useAlerts } from '../features/alerts/hooks';
import { useRules } from '../features/rules/hooks';
import NextLink from 'next/link';
import { AppRoutes } from '../lib/routes';

const HomePage = () => {
  const { devices } = useDevices();
  const { alerts } = useAlerts();
  const { rules } = useRules();

  const activeAlerts = alerts.filter(a => a.status === 'open').length;
  const enabledRules = rules.filter(r => r.enabled).length;

  return (
    <Box>
      <Heading as="h1" size="lg" mb={8}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Card as={NextLink} href={AppRoutes.DEVICES} _hover={{ shadow: 'md' }}>
          <CardHeader>
            <Heading size='md'>Devices</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="4xl" fontWeight="bold">{devices.length}</Text>
          </CardBody>
        </Card>
        <Card as={NextLink} href={AppRoutes.ALERTS} _hover={{ shadow: 'md' }}>
          <CardHeader>
            <Heading size='md'>Active Alerts</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="4xl" fontWeight="bold">{activeAlerts}</Text>
          </CardBody>
        </Card>
        <Card as={NextLink} href={AppRoutes.RULES} _hover={{ shadow: 'md' }}>
          <CardHeader>
            <Heading size='md'>Enabled Rules</Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="4xl" fontWeight="bold">{enabledRules}</Text>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading size='md'>Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <Stack direction="row" spacing={4}>
              <Button as={NextLink} href={AppRoutes.DEVICES} colorScheme="primary">Create Device</Button>
              <Button as={NextLink} href={AppRoutes.RULES} colorScheme="primary">Create Rule</Button>
            </Stack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;
