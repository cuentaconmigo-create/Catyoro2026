import { describe, expect, it } from "vitest";
import { deriveScore } from "@/lib/scoring";

describe("deriveScore", () => {
  it("calcula categoría CORE y recomendación", () => {
    const result = deriveScore({
      profitability: 5,
      growth: 4.5,
      positioning: 4.4,
      leverage: 4,
      riskFavorable: 4,
      timeEfficiency: 4,
      purpose: 4.5,
      energy: 4,
      reputation: 4.6,
      relationships: 4,
      autonomy: 4,
      governanceAdjust: 0
    });

    expect(result.category).toBe("CORE");
    expect(result.recommendation).toBe("INVEST");
  });

  it("marca TRAP por rentabilidad alta y energía baja", () => {
    const result = deriveScore({
      profitability: 4.2,
      growth: 3,
      positioning: 3,
      leverage: 3,
      riskFavorable: 3,
      timeEfficiency: 3,
      purpose: 3,
      energy: 2,
      reputation: 3,
      relationships: 3,
      autonomy: 3,
      governanceAdjust: 0
    });
    expect(result.isTrap).toBe(true);
  });
});
