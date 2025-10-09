
import { useState, useEffect } from 'react';
import { getAlerts, Alert } from './api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setIsLoading(true);
    getAlerts()
      .then(setAlerts)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refetch();
  }, []);

  return { alerts, isLoading, error, refetch };
};
