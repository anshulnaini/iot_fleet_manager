
import { Center, Heading, Text, VStack, Button } from '@chakra-ui/react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

export const EmptyState = ({ title, message, actionButtonText, onActionButtonClick }: EmptyStateProps) => {
  return (
    <Center p={16} borderWidth="2px" borderStyle="dashed" borderRadius="lg">
      <VStack spacing={4}>
        <Heading as="h3" size="md">{title}</Heading>
        <Text color="muted.dark">{message}</Text>
        {actionButtonText && onActionButtonClick && (
          <Button colorScheme="primary" onClick={onActionButtonClick}>
            {actionButtonText}
          </Button>
        )}
      </VStack>
    </Center>
  );
};
