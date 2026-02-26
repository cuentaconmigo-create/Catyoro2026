export type ScoreInput = {
  profitability: number;
  growth: number;
  positioning: number;
  leverage: number;
  riskFavorable: number;
  timeEfficiency: number;
  purpose: number;
  energy: number;
  reputation: number;
  relationships: number;
  autonomy: number;
  governanceAdjust: number;
};

const weights = {
  profitability: 0.2,
  growth: 0.15,
  positioning: 0.15,
  leverage: 0.1,
  riskFavorable: 0.1,
  timeEfficiency: 0.1,
  purpose: 0.1,
  energy: 0.05,
  reputation: 0.1,
  relationships: 0.05,
  autonomy: 0.05
};

export function deriveScore(input: ScoreInput) {
  const totalScore =
    input.profitability * weights.profitability +
    input.growth * weights.growth +
    input.positioning * weights.positioning +
    input.leverage * weights.leverage +
    input.riskFavorable * weights.riskFavorable +
    input.timeEfficiency * weights.timeEfficiency +
    input.purpose * weights.purpose +
    input.energy * weights.energy +
    input.reputation * weights.reputation +
    input.relationships * weights.relationships +
    input.autonomy * weights.autonomy +
    input.governanceAdjust;

  const category =
    totalScore >= 4.2
      ? "CORE"
      : totalScore >= 3.5
        ? "PRIORITY"
        : totalScore >= 2.8
          ? "TACTICAL"
          : totalScore >= 2
            ? "OPPORTUNISTIC"
            : "DISTRACTOR";

  const recommendationMap: Record<string, string> = {
    CORE: "INVEST",
    PRIORITY: "MAINTAIN",
    TACTICAL: "DELEGATE",
    OPPORTUNISTIC: "PAUSE",
    DISTRACTOR: "EXIT"
  };

  return {
    totalScore,
    category,
    recommendation: recommendationMap[category],
    isTrap: input.profitability >= 4 && input.energy <= 2
  };
}
