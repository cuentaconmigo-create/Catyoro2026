import { describe, expect, it } from "vitest";
import { projectSchema } from "@/lib/validation";

describe("projectSchema", () => {
  it("requiere nogoReason si isNogo=true", () => {
    const parsed = projectSchema.safeParse({
      name: "X",
      description: "YYY",
      bucket: "ACTIVE",
      status: "OPEN",
      userRole: "OWNER",
      horizon: "30d",
      isNogo: true
    });

    expect(parsed.success).toBe(false);
  });
});
