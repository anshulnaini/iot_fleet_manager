'use client'

import { useEffect, useRef } from 'react';
import { useLiveStore } from './live-store';

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const { fetchDevices, fetchAlerts, addAlert, updateDeviceTelemetry } = useLiveStore();

  useEffect(() => {
    fetchDevices();
    fetchAlerts();
  }, [fetchDevices, fetchAlerts]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/live');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
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
  }, [addAlert, updateDeviceTelemetry]);

  return <>{children}</>;
}
