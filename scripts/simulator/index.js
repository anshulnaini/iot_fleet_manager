const fetch = require('node-fetch');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:4000/api/ingest';
const DEVICES = (process.env.DEVICES || 'dev-1,dev-2,dev-3').split(',');
const PERIOD_MS = parseInt(process.env.PERIOD_MS || '3000', 10);

function generateTelemetry(deviceId) {
  return {
    deviceId,
    metrics: {
      temperature_c: 20 + Math.random() * 10,
      humidity_pct: 40 + Math.random() * 20,
      battery_pct: 100 - Math.random() * 10,
    },
  };
}

async function sendTelemetry(telemetry) {
  try {
    const response = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetry),
    });
    if (!response.ok) {
      console.error(`Error sending telemetry: ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Error sending telemetry: ${error.message}`);
  }
}

function main() {
  console.log(`Starting simulator for devices: ${DEVICES.join(', ')}`);
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Period: ${PERIOD_MS}ms`);

  setInterval(() => {
    for (const deviceId of DEVICES) {
      const telemetry = generateTelemetry(deviceId);
      sendTelemetry(telemetry);
    }
  }, PERIOD_MS);
}

main();
