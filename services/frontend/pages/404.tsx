
import { Center, Heading, Text, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AppRoutes } from '../lib/routes';

const NotFoundPage = () => {
  return (
    <Center h="100vh" flexDirection="column">
      <Heading as="h1" size="2xl" mb={4}>404</Heading>
      <Text fontSize="xl" mb={8}>Page Not Found</Text>
      <Button as={NextLink} href={AppRoutes.HOME} colorScheme="primary">
        Go to Home
      </Button>
    </Center>
  );
};

export default NotFoundPage;
