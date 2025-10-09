
const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`http://localhost:4000${url}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
};

export interface Alert {
    id: string;
    deviceId: string;
    ruleId: string;
    createdAt: string;
    severity: 'info' | 'warning' | 'error';
    message: string;
    context?: any;
    // We'll add a client-side status, as the backend doesn't have one yet
    status: 'open' | 'acked' | 'closed';
}

export const getAlerts = (): Promise<Alert[]> => {
  // Mocking the status, as it's not in the backend model
  return apiClient.get('/api/alerts').then(alerts => alerts.map((a: Omit<Alert, 'status'>) => ({ ...a, status: 'open' })));
};
