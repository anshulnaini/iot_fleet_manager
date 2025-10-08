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
  addDevice: (device: Device) => void;
  addAlert: (alert: Alert) => void;
  updateDeviceTelemetry: (deviceId: string, telemetry: Telemetry) => void;
}

export const useLiveStore = create<LiveStore>((set) => ({
  devices: [],
  alerts: [],
  addDevice: (device) => set((state) => ({ devices: [...state.devices, device] })),
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
