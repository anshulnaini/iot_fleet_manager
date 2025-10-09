
import { Badge, Button, ButtonGroup, Center, Spinner, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Device } from './api';
import { EmptyState } from '../../components/common/EmptyState';

interface DeviceTableProps {
  devices: Device[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
  onAdd: () => void;
}

export const DeviceTable = ({ devices, isLoading, error, onEdit, onDelete, onAdd }: DeviceTableProps) => {
  if (isLoading) {
    return <Center><Spinner /></Center>;
  }

  if (error) {
    return <Text color="danger.light">Error loading devices.</Text>;
  }

  if (devices.length === 0) {
    return (
      <EmptyState
        title="No devices found"
        message="Get started by adding a new device."
        actionButtonText="Add Device"
        onActionButtonClick={onAdd}
      />
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Status</Th>
          <Th>Last Seen</Th>
          <Th>Location</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {devices.map((device) => (
          <Tr key={device.id}>
            <Td>{device.name}</Td>
            <Td><Badge colorScheme={new Date(device.lastSeenAt) > new Date(Date.now() - 1000 * 60 * 5) ? 'success' : 'danger'}>Online</Badge></Td>
            <Td>{new Date(device.lastSeenAt).toLocaleString()}</Td>
            <Td>{device.locationHint ?? 'N/A'}</Td>
            <Td>
              <ButtonGroup variant="outline" size="sm">
                <Button onClick={() => onEdit(device)}>Edit</Button>
                <Button colorScheme="red" onClick={() => onDelete(device)}>Delete</Button>
              </ButtonGroup>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
