import { requireAdmin } from "@/lib/auth";
import { bad } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const cycleId = url.searchParams.get("cycleId") || undefined;
    if (!userId) return bad("userId required");

    const [user, scores, notes] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.projectScore.findMany({ where: { userId, cycleId }, include: { project: true }, orderBy: { totalScore: "desc" } }),
      prisma.advisorNote.findMany({ where: { targetUserId: userId, cycleId } })
    ]);

    const html = `<!doctype html><html><body><h1>Resumen PortfolioRank</h1><h2>${user?.email ?? "N/A"}</h2><h3>Ranking</h3><ul>${scores
      .map((s) => `<li>${s.project.name}: ${s.totalScore.toFixed(2)} (${s.category})</li>`)
      .join("")}</ul><h3>Notas</h3><ul>${notes.map((n) => `<li>${n.content}</li>`).join("")}</ul></body></html>`;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch {
    return bad("Forbidden", 403);
  }
}
