
import { Spinner, Center, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Telemetry } from './api';
import { EmptyState } from '../../components/common/EmptyState';

interface TelemetryTableProps {
  telemetry: Telemetry[];
  isLoading: boolean;
  error: Error | null;
}

export const TelemetryTable = ({ telemetry, isLoading, error }: TelemetryTableProps) => {
  if (isLoading) {
    return <Center><Spinner /></Center>;
  }

  if (error) {
    return <Text color="danger.light">Error loading telemetry.</Text>;
  }

  if (telemetry.length === 0) {
    return (
      <EmptyState
        title="No telemetry data"
        message="No telemetry data has been received yet for the selected device(s)."
      />
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Timestamp</Th>
          <Th>Device ID</Th>
          <Th>Temperature (°C)</Th>
          <Th>Humidity (%)</Th>
          <Th>Battery (%)</Th>
        </Tr>
      </Thead>
      <Tbody>
        {telemetry.map((t) => (
          <Tr key={t.id}>
            <Td>{new Date(t.timestamp).toLocaleString()}</Td>
            <Td>{t.deviceId}</Td>
            <Td>{t.temperature_c ?? 'N/A'}</Td>
            <Td>{t.humidity_pct ?? 'N/A'}</Td>
            <Td>{t.battery_pct ?? 'N/A'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
