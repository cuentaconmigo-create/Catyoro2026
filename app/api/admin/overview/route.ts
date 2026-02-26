import { requireAdmin } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const cycleId = url.searchParams.get("cycleId") || undefined;
    if (!userId) return bad("userId required");

    const ranking = await prisma.projectScore.findMany({
      where: { userId, cycleId },
      include: { project: true, cycle: true },
      orderBy: { totalScore: "desc" }
    });

    return ok({
      ranking,
      traps: ranking.filter((r) => r.isTrap),
      quadrants: ranking.map((r) => ({
        projectId: r.projectId,
        name: r.project.name,
        profitabilityVsEnergy: [r.profitability, r.energy],
        positioningVsTime: [r.positioning, r.timeEfficiency]
      }))
    });
  } catch {
    return bad("Forbidden", 403);
  }
}
