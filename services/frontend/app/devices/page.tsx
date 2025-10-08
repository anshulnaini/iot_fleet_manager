'use client'

import { useState } from 'react';
import { useLiveStore } from '../live-store';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, useDisclosure } from '@chakra-ui/react';
import { DeviceForm } from './device-form';

export default function DevicesPage() {
  const devices = useLiveStore((state) => state.devices);
  const { removeDevice, fetchDevices } = useLiveStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleAdd = () => {
    setSelectedDevice(null);
    onOpen();
  };

  const handleEdit = (device: any) => {
    setSelectedDevice(device);
    onOpen();
  };

  const handleDelete = async (deviceId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/devices/${deviceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete device');
      removeDevice(deviceId); // Optimistic update
    } catch (error) {
      console.error(error);
      // Optional: Add user feedback here, e.g., a toast notification
    }
  };

  const handleSubmit = async (data: any) => {
    const url = selectedDevice
      ? `${process.env.NEXT_PUBLIC_API_BASE}/api/devices/${(selectedDevice as any).id}`
      : `${process.env.NEXT_PUBLIC_API_BASE}/api/devices`;
    const method = selectedDevice ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save device');
      fetchDevices(); // Re-fetch devices to update the list
      onClose();
    } catch (error) {
      console.error(error);
      // Optional: Add user feedback here
    }
  };

  return (
    <Box p={8}>
      <HStack justify="space-between" mb={4}>
        <Heading>Devices</Heading>
        <Button colorScheme="green" onClick={handleAdd}>Add Device</Button>
      </HStack>
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
            <Th>Actions</Th>
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
              <Td>
                <HStack spacing={2}>
                  <Button size="sm" colorScheme="blue" onClick={() => handleEdit(device)}>Edit</Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDelete(device.id)}>Delete</Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <DeviceForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} device={selectedDevice} />
    </Box>
  );
}
