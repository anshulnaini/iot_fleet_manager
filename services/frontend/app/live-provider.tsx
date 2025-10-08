'use client'

import { useEffect } from 'react';
import { useLiveStore } from './live-store';

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const { addAlert, updateDeviceTelemetry, addDevice } = useLiveStore();

  useEffect(() => {
    async function fetchInitialData() {
      console.log('Fetching initial data...');
      const devicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/devices`);
      const devicesData = await devicesRes.json();
      console.log('Initial devices:', devicesData);
      devicesData.forEach((device: any) => addDevice(device));

      const alertsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/alerts?active=true`);
      const alertsData = await alertsRes.json();
      console.log('Initial alerts:', alertsData);
      alertsData.forEach((alert: any) => addAlert(alert));
    }

    fetchInitialData();

    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/live');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      const message = JSON.parse(event.data);
      if (message.type === 'telemetry') {
        updateDeviceTelemetry(message.payload.deviceId, message.payload.rec);
      } else if (message.type === 'alert') {
        addAlert(message.payload);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [addAlert, updateDeviceTelemetry, addDevice]);

  return <>{children}</>;
}
