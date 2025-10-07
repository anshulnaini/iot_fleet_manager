import { Box, Heading, Link, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Home() {
  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Heading>IoT Fleet Manager</Heading>
        <Link as={NextLink} href="/devices">View Devices</Link>
        <Link as={NextLink} href="/alerts">View Alerts</Link>
      </VStack>
    </Box>
  );
}
