import { Bucket, CycleCadence, PrismaClient, Role } from "@prisma/client";
import { deriveScore } from "../lib/scoring";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error("ADMIN_EMAIL missing");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: { email: adminEmail, role: Role.ADMIN }
  });

  const demo = await prisma.user.upsert({
    where: { email: "demo@portfoliorank.local" },
    update: {},
    create: { email: "demo@portfoliorank.local", role: Role.USER }
  });

  await prisma.profile.upsert({
    where: { userId: demo.id },
    update: { weeklyHoursAvailable: 40 },
    create: { userId: demo.id, weeklyHoursAvailable: 40 }
  });

  const monthly = await prisma.reviewCycle.upsert({
    where: { label: "2026-02" },
    update: { cadence: CycleCadence.MONTHLY, isActive: true },
    create: {
      label: "2026-02",
      cadence: CycleCadence.MONTHLY,
      startsAt: new Date("2026-02-01"),
      endsAt: new Date("2026-02-28"),
      isActive: true
    }
  });

  const quarterly = await prisma.reviewCycle.upsert({
    where: { label: "2026-Q1" },
    update: { cadence: CycleCadence.QUARTERLY },
    create: {
      label: "2026-Q1",
      cadence: CycleCadence.QUARTERLY,
      startsAt: new Date("2026-01-01"),
      endsAt: new Date("2026-03-31")
    }
  });

  const names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];
  for (const [idx, name] of names.entries()) {
    const project = await prisma.project.upsert({
      where: { id: `seed-${idx}` },
      update: {},
      create: {
        id: `seed-${idx}`,
        userId: demo.id,
        name,
        description: `Proyecto ${name}`,
        bucket: idx % 2 ? Bucket.POTENTIAL : Bucket.ACTIVE,
        status: "DISCOVERY",
        userRole: "OWNER",
        horizon: "90d",
        isNogo: false
      }
    });

    for (const cycle of [monthly, quarterly]) {
      const base = {
        projectId: project.id,
        cycleId: cycle.id,
        userId: demo.id,
        profitability: 2.5 + idx * 0.4,
        growth: 2.7 + idx * 0.35,
        positioning: 2.6 + idx * 0.3,
        leverage: 2.4 + idx * 0.2,
        riskFavorable: 2.5 + idx * 0.25,
        timeEfficiency: 2.6 + idx * 0.2,
        purpose: 3.0,
        energy: 2.0 + idx * 0.5,
        reputation: 2.8 + idx * 0.2,
        relationships: 2.4 + idx * 0.3,
        autonomy: 2.2 + idx * 0.25,
        governanceAdjust: 0
      };
      const d = deriveScore(base);
      await prisma.projectScore.upsert({
        where: { projectId_cycleId: { projectId: project.id, cycleId: cycle.id } },
        update: { ...base, ...d },
        create: { ...base, ...d }
      });
    }
  }

  await prisma.timePlan.upsert({
    where: { userId_cycleId: { userId: demo.id, cycleId: monthly.id } },
    update: {},
    create: {
      userId: demo.id,
      cycleId: monthly.id,
      corePct: 50,
      priorityPct: 25,
      tacticalPct: 15,
      opportunisticPct: 8,
      distractorPct: 2
    }
  });

  await prisma.advisorNote.create({
    data: {
      authorId: admin.id,
      targetUserId: demo.id,
      cycleId: monthly.id,
      content: "Revisar proyectos con TRAP y delegar tácticos."
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
