import { requireAuth } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const url = new URL(req.url);
    const cycleId = url.searchParams.get("cycleId");
    const bucket = url.searchParams.get("bucket");
    const status = url.searchParams.get("status");
    const includeNogo = url.searchParams.get("includeNogo") === "true";

    const scores = await prisma.projectScore.findMany({
      where: {
        userId: session.user.id,
        cycleId: cycleId || undefined,
        project: {
          bucket: bucket || undefined,
          status: status || undefined,
          ...(includeNogo ? {} : { isNogo: false })
        }
      },
      include: { project: true, cycle: true },
      orderBy: { totalScore: "desc" }
    });

    return ok(scores);
  } catch {
    return bad("Unauthorized", 401);
  }
}
