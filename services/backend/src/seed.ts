import prisma from './lib/db';

async function main() {
  const rule = await prisma.rule.upsert({
    where: { id: 'high_temp_rule' },
    update: {},
    create: {
      id: 'high_temp_rule',
      metric: 'temperature_c',
      operator: '>',
      value: 30,
      severity: 'critical',
    },
  });
  console.log({ rule });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
