
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

export interface Rule {
    id: string;
    name: string;
    metric: string;
    operator: '>' | '=' | '<' | '<=';
    value: number;
    severity: 'info' | 'warning' | 'error';
    enabled: boolean;
}

export const getRules = (): Promise<Rule[]> => {
  return apiClient.get('/api/rules');
};

export const createRule = (data: Omit<Rule, 'id'>): Promise<Rule> => {
  return apiClient.post('/api/rules', data);
};

export const updateRule = (id: string, data: Partial<Omit<Rule, 'id'>>): Promise<Rule> => {
  return apiClient.put(`/api/rules/${id}`, data);
};

export const deleteRule = (id: string): Promise<void> => {
  return apiClient.delete(`/api/rules/${id}`);
};
