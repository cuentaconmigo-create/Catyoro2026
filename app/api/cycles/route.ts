import { requireAuth } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { cycleSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAuth();
    const cycles = await prisma.reviewCycle.findMany({ orderBy: { startsAt: "desc" } });
    return ok(cycles);
  } catch {
    return bad("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    await requireAuth();
    const body = cycleSchema.parse(await req.json());
    if (body.isActive) {
      await prisma.reviewCycle.updateMany({ data: { isActive: false }, where: { isActive: true } });
    }
    const cycle = await prisma.reviewCycle.create({ data: body });
    return ok(cycle, 201);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAuth();
    const { cycleId, isActive, locked } = await req.json();
    if (isActive) {
      await prisma.reviewCycle.updateMany({ data: { isActive: false }, where: { isActive: true } });
    }
    const cycle = await prisma.reviewCycle.update({
      where: { id: cycleId },
      data: { isActive: !!isActive, locked: !!locked }
    });
    return ok(cycle);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}
