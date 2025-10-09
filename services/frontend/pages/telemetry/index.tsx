
import { useState } from 'react';
import { Box, Flex, Select } from '@chakra-ui/react';
import { PageHeader } from '../../components/common/PageHeader';
import { TelemetryTable } from '../../features/telemetry/TelemetryTable';
import { useTelemetry } from '../../features/telemetry/hooks';
import { useDevices } from '../../features/devices/hooks';

const TelemetryPage = () => {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);
  const { telemetry, isLoading, error } = useTelemetry(selectedDevice ? [selectedDevice] : undefined);
  const { devices } = useDevices();

  return (
    <Box>
      <PageHeader title="Telemetry Stream" />
      <Flex mb={4}>
        <Select
          w="300px"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value || undefined)}
          placeholder="All Devices"
        >
          {devices.map(device => (
            <option key={device.id} value={device.id}>{device.name}</option>
          ))}
        </Select>
      </Flex>
      <TelemetryTable telemetry={telemetry} isLoading={isLoading} error={error} />
    </Box>
  );
};

export default TelemetryPage;
