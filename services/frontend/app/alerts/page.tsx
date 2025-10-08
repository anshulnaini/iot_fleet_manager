'use client'

import { useLiveStore } from '../live-store';
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';

export default function AlertsPage() {
  const alerts = useLiveStore((state) => state.alerts);

  return (
    <Box p={8}>
      <Heading mb={4}>Active Alerts</Heading>
      <List spacing={3}>
        {alerts.map((alert) => (
          <ListItem key={alert.id}>
            <Text>{new Date(alert.createdAt).toLocaleString()}: [{alert.deviceId}] {alert.message}</Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
