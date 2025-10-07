'use client'

import { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Text } from '@chakra-ui/react';

interface Alert {
  id: string;
  deviceId: string;
  message: string;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function fetchAlerts() {
      const res = await fetch('/api/alerts?active=true');
      const data = await res.json();
      setAlerts(data);
    }
    fetchAlerts();
  }, []);

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
