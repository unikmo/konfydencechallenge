import {
  clampTo0to4,
  computeKRSLevel,
  computePercent,
  computeChallengeTotals,
  computeHackBreakdown,
  computeHackProfile,
  computeCategoryBreakdown,
} from "../lib/scoring/scoringEngine";
import { HACK_LABELS } from "../lib/challenge/labels";

describe("H.A.C.K. framework", () => {
  test("uses the canonical customer-facing framework", () => {
    expect(HACK_LABELS.H.internal).toBe("Hurry");
    expect(HACK_LABELS.A.internal).toBe("Authority");
    expect(HACK_LABELS.C.internal).toBe("Comfort");
    expect(HACK_LABELS.K.internal).toBe("Kill-Switch");
    expect(HACK_LABELS.C.short).not.toBe("Connection");
  });
});

describe("clampTo0to4", () => {
  test("clamps and truncates defensive input", () => {
    expect(clampTo0to4(3.9)).toBe(3);
    expect(clampTo0to4(5)).toBe(4);
    expect(clampTo0to4(-1)).toBe(0);
    expect(clampTo0to4(NaN)).toBe(0);
    expect(clampTo0to4(Infinity)).toBe(0);
  });
});

describe("computePercent", () => {
  test("calculates and clamps percentages", () => {
    expect(computePercent({ total: 24, max: 32 })).toBe(75);
    expect(computePercent({ total: 96, max: 96 })).toBe(100);
    expect(computePercent({ total: 150, max: 100 })).toBe(100);
    expect(computePercent({ total: -10, max: 100 })).toBe(0);
    expect(computePercent({ total: 10, max: 0 })).toBe(0);
  });
});

describe("computeKRSLevel", () => {
  test("uses the 8-card / 32-point diagnostic bands", () => {
    expect(computeKRSLevel({ totalScoreTotal: 29, totalScoreMax: 32 })).toBe("Sharp Spotter");
    expect(computeKRSLevel({ totalScoreTotal: 24, totalScoreMax: 32 })).toBe("Nearly Ready");
    expect(computeKRSLevel({ totalScoreTotal: 18, totalScoreMax: 32 })).toBe("Pressure-Prone");
    expect(computeKRSLevel({ totalScoreTotal: 12, totalScoreMax: 32 })).toBe("Needs Practice");
  });

  test("uses the full-run bands whenever the max exceeds the 32-point free-check ceiling", () => {
    expect(computeKRSLevel({ totalScoreTotal: 87, totalScoreMax: 96 })).toBe("Scam-Strong");
    expect(computeKRSLevel({ totalScoreTotal: 72, totalScoreMax: 96 })).toBe("On Track");
    expect(computeKRSLevel({ totalScoreTotal: 52, totalScoreMax: 96 })).toBe("Needs Practice");
    expect(computeKRSLevel({ totalScoreTotal: 40, totalScoreMax: 96 })).toBe("High Risk");
  });
});

describe("computeChallengeTotals", () => {
  test("returns percent and readiness label", () => {
    const diagnostic = computeChallengeTotals({ scoreTotal: 24, scoreMax: 32 });
    expect(diagnostic.totalPercent).toBe(75);
    expect(diagnostic.level).toBe("Nearly Ready");

    const full = computeChallengeTotals({ scoreTotal: 72, scoreMax: 96 });
    expect(full.totalPercent).toBe(75);
    expect(full.level).toBe("On Track");
  });
});

describe("computeHackBreakdown", () => {
  const balanced = [
    { hackKey: "H", score: 4 }, { hackKey: "H", score: 3 },
    { hackKey: "A", score: 4 }, { hackKey: "A", score: 4 },
    { hackKey: "C", score: 2 }, { hackKey: "C", score: 1 },
    { hackKey: "K", score: 3 }, { hackKey: "K", score: 2 },
  ];

  test("keeps each H.A.C.K. dimension separate", () => {
    const result = computeHackBreakdown(balanced);
    expect(result.map((item) => item.hackKey)).toEqual(["H", "A", "C", "K"]);
    expect(result.every((item) => item.cardCount === 2)).toBe(true);
    expect(result.find((item) => item.hackKey === "A")?.pct).toBe(100);
    expect(result.find((item) => item.hackKey === "C")?.pct).toBe(37.5);
  });
});

describe("computeHackProfile", () => {
  test("identifies the weakest pressure pattern and strongest reflex", () => {
    const profile = computeHackProfile([
      { hackKey: "H", score: 4 }, { hackKey: "H", score: 3 },
      { hackKey: "A", score: 4 }, { hackKey: "A", score: 4 },
      { hackKey: "C", score: 1 }, { hackKey: "C", score: 1 },
      { hackKey: "K", score: 3 }, { hackKey: "K", score: 3 },
    ]);

    expect(profile.primaryVulnerability?.hackKey).toBe("C");
    expect(profile.primaryVulnerability?.level).toBe("vulnerable");
    expect(profile.primaryVulnerability?.practice).toContain("familiarity");
    expect(profile.strongestReflex?.hackKey).toBe("A");
  });
});

describe("computeCategoryBreakdown", () => {
  test("ignores null categories and sorts strongest category first", () => {
    const result = computeCategoryBreakdown([
      { category: "Phishing", score: 4 },
      { category: "Phishing", score: 3 },
      { category: "Payments", score: 2 },
      { category: "Payments", score: 1 },
      { category: null, score: 4 },
    ]);
    expect(result.map((item) => item.category)).toEqual(["Phishing", "Payments"]);
    expect(result[0].pct).toBe(87.5);
  });
});
