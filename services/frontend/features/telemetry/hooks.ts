
import { useState, useEffect, useRef } from 'react';
import { getTelemetry, Telemetry } from './api';

export const useTelemetry = (deviceIds?: string[]) => {
  const [telemetry, setTelemetry] = useState<Telemetry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    // Do not set loading to true on refetch to avoid UI flicker
    getTelemetry(deviceIds)
      .then(setTelemetry)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    refetch();
  }, [JSON.stringify(deviceIds)]); // Refetch when deviceIds change

  // Polling
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [JSON.stringify(deviceIds)]);

  return { telemetry, isLoading, error, refetch };
};
