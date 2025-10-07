'use client'

import { useEffect, useState } from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

interface Telemetry {
  id: string;
  timestamp: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  battery_pct: number | null;
}

interface Device {
  id: string;
  name: string;
  type: string;
  lastSeenAt: string;
  telemetry: Telemetry[];
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    async function fetchDevices() {
      const res = await fetch('/api/devices');
      const data = await res.json();
      setDevices(data);
    }
    fetchDevices();
  }, []);

  return (
    <Box p={8}>
      <Heading mb={4}>Devices</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Last Seen</Th>
            <Th>Temperature</Th>
            <Th>Humidity</Th>
            <Th>Battery</Th>
          </Tr>
        </Thead>
        <Tbody>
          {devices.map((device) => (
            <Tr key={device.id}>
              <Td>{device.id}</Td>
              <Td>{device.name}</Td>
              <Td>{device.type}</Td>
              <Td>{new Date(device.lastSeenAt).toLocaleString()}</Td>
              <Td>{device.telemetry[0]?.temperature_c ?? 'N/A'}</Td>
              <Td>{device.telemetry[0]?.humidity_pct ?? 'N/A'}</Td>
              <Td>{device.telemetry[0]?.battery_pct ?? 'N/A'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
