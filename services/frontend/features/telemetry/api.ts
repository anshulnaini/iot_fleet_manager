
const apiClient = {
  get: async (url: string) => {
    const response = await fetch(`http://localhost:4000${url}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  },
};

export interface Telemetry {
    id: string;
    deviceId: string;
    timestamp: string;
    temperature_c?: number;
    humidity_pct?: number;
    battery_pct?: number;
    extras?: any;
}

export const getTelemetry = (deviceIds?: string[]): Promise<Telemetry[]> => {
    const params = new URLSearchParams();
    if (deviceIds && deviceIds.length > 0) {
        deviceIds.forEach(id => params.append('deviceId', id));
    }
    return apiClient.get(`/api/telemetry?${params.toString()}`);
};
