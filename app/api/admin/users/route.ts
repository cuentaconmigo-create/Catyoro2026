import { requireAdmin } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      include: { profile: true },
      orderBy: { email: "asc" }
    });
    return ok(users);
  } catch {
    return bad("Forbidden", 403);
  }
}
