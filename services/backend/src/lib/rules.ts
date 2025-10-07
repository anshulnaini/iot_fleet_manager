import prisma from './db';
import { Telemetry } from '@prisma/client';

async function evaluateRules(telemetry: Telemetry) {
  console.log('Evaluating rules for telemetry:', telemetry);
  const rules = await prisma.rule.findMany({ where: { enabled: true } });
  console.log('Found rules:', rules);

  for (const rule of rules) {
    const value = telemetry[rule.metric as keyof Telemetry];
    console.log(`Checking rule ${rule.id} for metric ${rule.metric} with value ${value}`);

    if (value !== null && typeof value === 'number') {
      let match = false;
      switch (rule.operator) {
        case '>':
          match = value > rule.value;
          break;
        case '>=':
          match = value >= rule.value;
          break;
        case '<':
          match = value < rule.value;
          break;
        case '<=':
          match = value <= rule.value;
          break;
      }

      console.log(`Rule match: ${match}`);

      if (match) {
        await prisma.alert.create({
          data: {
            deviceId: telemetry.deviceId,
            ruleId: rule.id,
            severity: rule.severity,
            message: `Alert: ${rule.metric} ${rule.operator} ${rule.value}`,
            context: {
              metric: rule.metric,
              value: value,
            },
          },
        });
        console.log('Created alert');
      }
    }
  }
}

export default evaluateRules;
