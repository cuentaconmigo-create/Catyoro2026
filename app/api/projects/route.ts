import { requireAuth } from "@/lib/auth";
import { bad, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  try {
    const session = await requireAuth();
    const projects = await prisma.project.findMany({ where: { userId: session.user.id } });
    return ok(projects);
  } catch {
    return bad("Unauthorized", 401);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const body = projectSchema.parse(await req.json());
    const project = await prisma.project.create({
      data: {
        ...body,
        userId: session.user.id
      }
    });
    if (project.isNogo) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: "PROJECT_NOGO_SET",
          entity: "Project",
          entityId: project.id,
          payload: { nogoReason: project.nogoReason }
        }
      });
    }
    return ok(project, 201);
  } catch (error) {
    return bad(error instanceof Error ? error.message : "Error");
  }
}
