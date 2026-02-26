import { requireAuth } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { deriveScore } from "@/lib/scoring";
import { scoreSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = scoreSchema.parse(await req.json());

    const project = await prisma.project.findFirst({ where: { id: body.projectId, userId: session.user.id } });
    if (!project) return bad("Project not found", 404);

    const cycle = await prisma.reviewCycle.findUnique({ where: { id: body.cycleId } });
    if (!cycle) return bad("Cycle not found", 404);
    if (cycle.locked) return bad("Cycle locked", 409);

    const derived = deriveScore(body);
    const score = await prisma.projectScore.upsert({
      where: { projectId_cycleId: { projectId: body.projectId, cycleId: body.cycleId } },
      update: { ...body, ...derived, userId: session.user.id },
      create: { ...body, ...derived, userId: session.user.id }
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PROJECT_SCORE_UPSERT",
        entity: "ProjectScore",
        entityId: score.id,
        payload: body
      }
    });

    return ok(score, 201);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}
