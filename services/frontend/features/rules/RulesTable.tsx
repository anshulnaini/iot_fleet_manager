
import { Badge, Button, ButtonGroup, Center, Spinner, Switch, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Rule } from './api';
import { EmptyState } from '../../components/common/EmptyState';
import { useUpdateRule } from './hooks';

interface RulesTableProps {
  rules: Rule[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (rule: Rule) => void;
  onDelete: (rule: Rule) => void;
  onAdd: () => void;
  refetch: () => void;
}

export const RulesTable = ({ rules, isLoading, error, onEdit, onDelete, onAdd, refetch }: RulesTableProps) => {
  const updateRuleMutation = useUpdateRule();

  const handleToggle = async (rule: Rule) => {
    await updateRuleMutation.mutate(rule.id, { enabled: !rule.enabled });
    refetch();
  };

  if (isLoading) {
    return <Center><Spinner /></Center>;
  }

  if (error) {
    return <Text color="danger.light">Error loading rules.</Text>;
  }

  if (rules.length === 0) {
    return (
      <EmptyState
        title="No rules found"
        message="Get started by adding a new rule."
        actionButtonText="Add Rule"
        onActionButtonClick={onAdd}
      />
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Condition</Th>
          <Th>Severity</Th>
          <Th>Enabled</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rules.map((rule) => (
          <Tr key={rule.id}>
            <Td>{rule.name}</Td>
            <Td>{`Metric ${rule.metric} ${rule.operator} ${rule.value}`}</Td>
            <Td><Badge colorScheme={rule.severity === 'error' ? 'red' : rule.severity === 'warning' ? 'yellow' : 'blue'}>{rule.severity}</Badge></Td>
            <Td>
              <Switch isChecked={rule.enabled} onChange={() => handleToggle(rule)} />
            </Td>
            <Td>
              <ButtonGroup variant="outline" size="sm">
                <Button onClick={() => onEdit(rule)}>Edit</Button>
                <Button colorScheme="red" onClick={() => onDelete(rule)}>Delete</Button>
              </ButtonGroup>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
