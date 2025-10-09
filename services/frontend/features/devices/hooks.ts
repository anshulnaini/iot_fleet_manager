
import { useState, useEffect } from 'react';
import { getDevices, createDevice, updateDevice, deleteDevice, Device } from './api';

export const useDevices = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setIsLoading(true);
    getDevices()
      .then(setDevices)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refetch();
  }, []);

  return { devices, isLoading, error, refetch };
};

export const useCreateDevice = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data: Omit<Device, 'id' | 'lastSeenAt'>) => {
    setIsLoading(true);
    try {
      const newDevice = await createDevice(data);
      setIsLoading(false);
      return newDevice;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};

export const useUpdateDevice = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (id: string, data: Partial<Omit<Device, 'id' | 'lastSeenAt'>>) => {
    setIsLoading(true);
    try {
      const updatedDevice = await updateDevice(id, data);
      setIsLoading(false);
      return updatedDevice;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};

export const useDeleteDevice = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteDevice(id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};
