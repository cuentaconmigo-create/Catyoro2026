import { Bucket, CycleCadence } from "@prisma/client";
import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().min(2),
    description: z.string().min(3),
    bucket: z.nativeEnum(Bucket),
    status: z.string().min(1),
    userRole: z.string().min(1),
    horizon: z.string().min(1),
    isNogo: z.boolean().default(false),
    nogoReason: z.string().optional()
  })
  .refine((x) => !x.isNogo || !!x.nogoReason, {
    message: "nogo_reason es obligatorio si is_nogo=true",
    path: ["nogoReason"]
  });

export const cycleSchema = z.object({
  label: z.string().min(4),
  cadence: z.nativeEnum(CycleCadence),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  isActive: z.boolean().default(false)
});

export const scoreSchema = z.object({
  projectId: z.string().min(1),
  cycleId: z.string().min(1),
  profitability: z.number().min(0).max(5),
  growth: z.number().min(0).max(5),
  positioning: z.number().min(0).max(5),
  leverage: z.number().min(0).max(5),
  riskFavorable: z.number().min(0).max(5),
  timeEfficiency: z.number().min(0).max(5),
  purpose: z.number().min(0).max(5),
  energy: z.number().min(0).max(5),
  reputation: z.number().min(0).max(5),
  relationships: z.number().min(0).max(5),
  autonomy: z.number().min(0).max(5),
  governanceAdjust: z.number().min(-0.3).max(0.3)
});

export const timePlanSchema = z.object({
  cycleId: z.string().min(1),
  corePct: z.number().int().min(40).max(60),
  priorityPct: z.number().int().min(20).max(30),
  tacticalPct: z.number().int().min(10).max(20),
  opportunisticPct: z.number().int().min(0).max(10),
  distractorPct: z.number().int().min(0).max(5)
});

export const advisorNoteSchema = z.object({
  targetUserId: z.string().min(1),
  projectId: z.string().optional(),
  cycleId: z.string().optional(),
  content: z.string().min(4)
});
