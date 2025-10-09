
// A mock API client. In the future, this will be a proper fetch wrapper.
const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`http://localhost:4000${url}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`http://localhost:4000${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
  put: async (url: string, data: any) => {
    const response = await fetch(`http://localhost:4000${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
  delete: async (url: string) => {
    const response = await fetch(`http://localhost:4000${url}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
};

export interface Device {
  id: string;
  name: string;
  type: string;
  lastSeenAt: string;
  tags: string[];
  locationHint?: string;
}

export const getDevices = (): Promise<Device[]> => {
  return apiClient.get('/api/devices');
};

export const createDevice = (data: Omit<Device, 'id' | 'lastSeenAt'>): Promise<Device> => {
  return apiClient.post('/api/devices', data);
};

export const updateDevice = (id: string, data: Partial<Omit<Device, 'id' | 'lastSeenAt'>>): Promise<Device> => {
  return apiClient.put(`/api/devices/${id}`, data);
};

export const deleteDevice = (id: string): Promise<void> => {
  return apiClient.delete(`/api/devices/${id}`);
};
