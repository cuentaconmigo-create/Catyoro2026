import { requireAdmin } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { advisorNoteSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const userId = new URL(req.url).searchParams.get("userId") || undefined;
    const notes = await prisma.advisorNote.findMany({
      where: { targetUserId: userId },
      include: { project: true, cycle: true, targetUser: true, author: true },
      orderBy: { createdAt: "desc" }
    });
    return ok(notes);
  } catch {
    return bad("Forbidden", 403);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    const body = advisorNoteSchema.parse(await req.json());
    const note = await prisma.advisorNote.create({
      data: {
        ...body,
        authorId: session.user.id
      }
    });
    return ok(note, 201);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}
