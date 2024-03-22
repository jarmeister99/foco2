import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const focusDropTypes = [
    {
      name: 'PROMPT',
      description:
        'The initial message in a Focus Drop. Usually asks the user to set a goal or intention for the day.',
    },
    {
      name: 'NUDGE',
      description:
        'A message that is sent to the user to remind them to check in with their goal or intention.',
    },
    {
      name: 'REFLECTION',
      description:
        'A message that is sent to the user to ask them to reflect on their goal or intention.',
    },
  ];

  await prisma.focusDropType.deleteMany({});
  for (const type of focusDropTypes) {
    await prisma.focusDropType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  const messageContentStrategies = [
    {
      name: 'STATIC',
      description:
        'This is a non-dynamic message payload. What you see is what the users get.',
      strategyAttributeKeys: ['body', 'mediaUrl'],
    },
    {
      name: 'TEMPLATED',
      description:
        'This is a dynamic message payload. It can be customized with user attributes.',
      strategyAttributeKeys: ['bodyTemplate', 'mediaUrl'],
    },
  ];

  await prisma.messageContentStrategy.deleteMany({});
  for (const strategy of messageContentStrategies) {
    await prisma.messageContentStrategy.upsert({
      where: { name: strategy.name },
      update: {},
      create: strategy,
    });
  }

  const autoreplyContentStrategies = [
    {
      name: 'STATIC',
      description:
        'This is a non-dynamic message payload. What you see is what the users get.',
      strategyAttributeKeys: ['body', 'mediaUrl'],
    },
    {
      name: 'TEMPLATED',
      description:
        'This is a dynamic message payload. It can be customized with user attributes.',
      strategyAttributeKeys: ['bodyTemplate', 'mediaUrl'],
    },
  ];

  await prisma.autoreplyContentStrategy.deleteMany({});
  for (const strategy of autoreplyContentStrategies) {
    await prisma.autoreplyContentStrategy.upsert({
      where: { name: strategy.name },
      update: {},
      create: strategy,
    });
  }

  const autoreplyTimingStrategies = [
    {
      name: 'TIMED',
      description:
        'Send the autoreply a specified number of minutes after the user sends a message.',
      strategyAttributeKeys: ['delayMinutes'],
    },
  ];

  await prisma.autoreplyTimingStrategy.deleteMany({});
  for (const strategy of autoreplyTimingStrategies) {
    await prisma.autoreplyTimingStrategy.upsert({
      where: { name: strategy.name },
      update: {},
      create: strategy,
    });
  }

  const deliveryStrategies = [
    {
      name: 'SPECIFIC_TIME',
      description: 'Send the message at a particular time',
      strategyAttributeKeys: ['time'],
    },
  ];

  await prisma.deliveryStrategy.deleteMany({});
  for (const strategy of deliveryStrategies) {
    await prisma.deliveryStrategy.upsert({
      where: { name: strategy.name },
      update: {},
      create: strategy,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
