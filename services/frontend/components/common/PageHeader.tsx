
import { Box, Button, Flex, Heading } from '@chakra-ui/react';

interface PageHeaderProps {
  title: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

export const PageHeader = ({ title, actionButtonText, onActionButtonClick }: PageHeaderProps) => {
  return (
    <Flex justify="space-between" align="center" mb={8}>
      <Heading as="h1" size="lg">
        {title}
      </Heading>
      {actionButtonText && onActionButtonClick && (
        <Button colorScheme="primary" onClick={onActionButtonClick}>
          {actionButtonText}
        </Button>
      )}
    </Flex>
  );
};
