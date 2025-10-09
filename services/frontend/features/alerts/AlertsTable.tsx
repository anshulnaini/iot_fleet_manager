
import { Badge, Spinner, Center, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Alert } from './api';
import { EmptyState } from '../../components/common/EmptyState';

interface AlertsTableProps {
  alerts: Alert[];
  isLoading: boolean;
  error: Error | null;
}

export const AlertsTable = ({ alerts, isLoading, error }: AlertsTableProps) => {
  if (isLoading) {
    return <Center><Spinner /></Center>;
  }

  if (error) {
    return <Text color="danger.light">Error loading alerts.</Text>;
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        title="No alerts found"
        message="There are no alerts matching your filters."
      />
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Time</Th>
          <Th>Device ID</Th>
          <Th>Severity</Th>
          <Th>Message</Th>
          <Th>Status</Th>
        </Tr>
      </Thead>
      <Tbody>
        {alerts.map((alert) => (
          <Tr key={alert.id}>
            <Td>{new Date(alert.createdAt).toLocaleString()}</Td>
            <Td>{alert.deviceId}</Td>
            <Td><Badge colorScheme={alert.severity === 'error' ? 'red' : alert.severity === 'warning' ? 'yellow' : 'blue'}>{alert.severity}</Badge></Td>
            <Td>{alert.message}</Td>
            <Td><Badge colorScheme={alert.status === 'open' ? 'green' : 'gray'}>{alert.status}</Badge></Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
