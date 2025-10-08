import { create } from 'zustand';

interface Telemetry {
  id: string;
  timestamp: string;
  temperature_c: number | null;
  humidity_pct: number | null;
  battery_pct: number | null;
}

interface Device {
  id: string;
  name: string;
  type: string;
  lastSeenAt: string;
  telemetry: Telemetry[];
}

interface Alert {
  id: string;
  deviceId: string;
  message: string;
  createdAt: string;
}

interface LiveStore {
  devices: Device[];
  alerts: Alert[];
  fetchDevices: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  addDevice: (device: Device) => void;
  removeDevice: (deviceId: string) => void;
  addAlert: (alert: Alert) => void;
  updateDeviceTelemetry: (deviceId: string, telemetry: Telemetry) => void;
}

export const useLiveStore = create<LiveStore>((set) => ({
  devices: [],
  alerts: [],
  fetchDevices: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/devices`);
      if (!res.ok) throw new Error('Failed to fetch devices');
      const devices = await res.json();
      set({ devices });
    } catch (error) {
      console.error(error);
    }
  },
  fetchAlerts: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/alerts?active=true`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      const alerts = await res.json();
      set((state) => ({ alerts: [...state.alerts, ...alerts] }));
    } catch (error) {
      console.error(error);
    }
  },
  addDevice: (device) =>
    set((state) => ({
      devices: state.devices.find((d) => d.id === device.id)
        ? state.devices.map((d) => (d.id === device.id ? device : d))
        : [...state.devices, device],
    })),
  removeDevice: (deviceId) =>
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== deviceId),
    })),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  updateDeviceTelemetry: (deviceId, telemetry) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId
          ? { ...device, telemetry: [telemetry, ...device.telemetry] }
          : device
      ),
    })),
}));
