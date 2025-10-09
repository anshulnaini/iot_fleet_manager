
import { Box, Button, Card, CardBody, Center, FormControl, FormLabel, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../lib/auth';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = (data: any) => {
    login(data.email);
  };

  return (
    <Center h="100vh" bg="gray.800">
      <Card w="md">
        <CardBody>
          <Heading as="h1" size="lg" textAlign="center" mb={6}>
            IoT Fleet Manager
          </Heading>
          <Text textAlign="center" color="muted.dark" mb={8}>
            Sign in to your account
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input type="email" {...register('email', { required: true })} />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register('password', { required: true })} />
              </FormControl>
              <Button type="submit" colorScheme="primary" mt={4}>
                Sign In
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Center>
  );
};

export default LoginPage;
