import { z } from 'zod';

export const telemetrySchema = z.object({
  deviceId: z.string(),
  timestamp: z.string().datetime().optional(),
  metrics: z.object({
    temperature_c: z.number().optional(),
    humidity_pct: z.number().optional(),
    battery_pct: z.number().optional(),
  }),
  extras: z.record(z.any()).optional(),
});
