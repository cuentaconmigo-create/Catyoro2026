import { requireAuth } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { timePlanSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const cycleId = new URL(req.url).searchParams.get("cycleId");
    if (!cycleId) return bad("cycleId required");

    const plan = await prisma.timePlan.findUnique({ where: { userId_cycleId: { userId: session.user.id, cycleId } } });
    return ok(
      plan || {
        cycleId,
        corePct: 50,
        priorityPct: 25,
        tacticalPct: 15,
        opportunisticPct: 8,
        distractorPct: 2
      }
    );
  } catch {
    return bad("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = timePlanSchema.parse(await req.json());
    const plan = await prisma.timePlan.upsert({
      where: { userId_cycleId: { userId: session.user.id, cycleId: body.cycleId } },
      update: body,
      create: { ...body, userId: session.user.id }
    });
    return ok(plan, 201);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}
