import { 
  clampTo0to4, 
  computeKRSLevel, 
  computePercent, 
  computeChallengeTotals,
  computeHackBreakdown,
  computeCategoryBreakdown,
  type HackBreakdownEntry,
  type CategoryBreakdownEntry
} from '../lib/scoring/scoringEngine';

describe('clampTo0to4', () => {
  test('clamps positive integers within range', () => {
    expect(clampTo0to4(3)).toBe(3);
    expect(clampTo0to4(0)).toBe(0);
    expect(clampTo0to4(4)).toBe(4);
  });

  test('clamps values above 4 to 4', () => {
    expect(clampTo0to4(5)).toBe(4);
    expect(clampTo0to4(100)).toBe(4);
  });

  test('clamps values below 0 to 0', () => {
    expect(clampTo0to4(-1)).toBe(0);
    expect(clampTo0to4(-10)).toBe(0);
  });

  test('handles non-integer values by truncating', () => {
    expect(clampTo0to4(2.7)).toBe(2);
    expect(clampTo0to4(3.9)).toBe(3);
  });

  test('handles non-finite numbers', () => {
    expect(clampTo0to4(NaN)).toBe(0);
    expect(clampTo0to4(Infinity)).toBe(0);
    expect(clampTo0to4(-Infinity)).toBe(0);
  });
});

describe('computeKRSLevel', () => {
  describe('full deck bands (max > 40)', () => {
    const max = 200; // typical full deck max

    test('returns "Scam-Strong" for 180-200', () => {
      expect(computeKRSLevel({ totalScoreTotal: 180, totalScoreMax: max })).toBe('Scam-Strong');
      expect(computeKRSLevel({ totalScoreTotal: 190, totalScoreMax: max })).toBe('Scam-Strong');
      expect(computeKRSLevel({ totalScoreTotal: 200, totalScoreMax: max })).toBe('Scam-Strong');
    });

    test('returns "On Track" for 140-179', () => {
      expect(computeKRSLevel({ totalScoreTotal: 140, totalScoreMax: max })).toBe('On Track');
      expect(computeKRSLevel({ totalScoreTotal: 150, totalScoreMax: max })).toBe('On Track');
      expect(computeKRSLevel({ totalScoreTotal: 179, totalScoreMax: max })).toBe('On Track');
    });

    test('returns "Needs Practice" for 100-139', () => {
      expect(computeKRSLevel({ totalScoreTotal: 100, totalScoreMax: max })).toBe('Needs Practice');
      expect(computeKRSLevel({ totalScoreTotal: 120, totalScoreMax: max })).toBe('Needs Practice');
      expect(computeKRSLevel({ totalScoreTotal: 139, totalScoreMax: max })).toBe('Needs Practice');
    });

    test('returns "High Risk" for 0-99', () => {
      expect(computeKRSLevel({ totalScoreTotal: 0, totalScoreMax: max })).toBe('High Risk');
      expect(computeKRSLevel({ totalScoreTotal: 50, totalScoreMax: max })).toBe('High Risk');
      expect(computeKRSLevel({ totalScoreTotal: 99, totalScoreMax: max })).toBe('High Risk');
    });
  });

  describe('diagnostic bands (max <= 40)', () => {
    const max = 40;

    test('returns "Sharp Spotter" for 36-40', () => {
      expect(computeKRSLevel({ totalScoreTotal: 36, totalScoreMax: max })).toBe('Sharp Spotter');
      expect(computeKRSLevel({ totalScoreTotal: 38, totalScoreMax: max })).toBe('Sharp Spotter');
      expect(computeKRSLevel({ totalScoreTotal: 40, totalScoreMax: max })).toBe('Sharp Spotter');
    });

    test('returns "Nearly Ready" for 28-35', () => {
      expect(computeKRSLevel({ totalScoreTotal: 28, totalScoreMax: max })).toBe('Nearly Ready');
      expect(computeKRSLevel({ totalScoreTotal: 30, totalScoreMax: max })).toBe('Nearly Ready');
      expect(computeKRSLevel({ totalScoreTotal: 35, totalScoreMax: max })).toBe('Nearly Ready');
    });

    test('returns "Pressure-Prone" for 18-27', () => {
      expect(computeKRSLevel({ totalScoreTotal: 18, totalScoreMax: max })).toBe('Pressure-Prone');
      expect(computeKRSLevel({ totalScoreTotal: 20, totalScoreMax: max })).toBe('Pressure-Prone');
      expect(computeKRSLevel({ totalScoreTotal: 27, totalScoreMax: max })).toBe('Pressure-Prone');
    });

    test('returns "Needs Practice" for 0-17', () => {
      expect(computeKRSLevel({ totalScoreTotal: 0, totalScoreMax: max })).toBe('Needs Practice');
      expect(computeKRSLevel({ totalScoreTotal: 10, totalScoreMax: max })).toBe('Needs Practice');
      expect(computeKRSLevel({ totalScoreTotal: 17, totalScoreMax: max })).toBe('Needs Practice');
    });
  });

  test('handles edge cases', () => {
    expect(computeKRSLevel({ totalScoreTotal: -5, totalScoreMax: 200 })).toBe('High Risk');
    // Scores above max fall through to last band (High Risk) because not in any band range
    expect(computeKRSLevel({ totalScoreTotal: 300, totalScoreMax: 200 })).toBe('High Risk');
  });
});

describe('computePercent', () => {
  test('calculates percentage correctly', () => {
    expect(computePercent({ total: 25, max: 100 })).toBe(25);
    expect(computePercent({ total: 0, max: 100 })).toBe(0);
    expect(computePercent({ total: 100, max: 100 })).toBe(100);
    expect(computePercent({ total: 75, max: 150 })).toBe(50);
  });

  test('handles zero max', () => {
    expect(computePercent({ total: 10, max: 0 })).toBe(0);
  });

  test('clamps between 0 and 100', () => {
    expect(computePercent({ total: 150, max: 100 })).toBe(100);
    expect(computePercent({ total: -50, max: 100 })).toBe(0);
  });

  test('handles non-finite values', () => {
    expect(computePercent({ total: NaN, max: 100 })).toBe(0);
    expect(computePercent({ total: Infinity, max: 100 })).toBe(0);
  });
});

describe('computeChallengeTotals', () => {
  test('calculates totals and level correctly', () => {
    const result = computeChallengeTotals({ scoreTotal: 150, scoreMax: 200 });
    expect(result.totalScoreMax).toBe(200);
    expect(result.totalScoreTotal).toBe(150);
    expect(result.totalPercent).toBe(75);
    expect(result.level).toBe('On Track');
  });

  test('works with diagnostic scale', () => {
    const result = computeChallengeTotals({ scoreTotal: 30, scoreMax: 40 });
    expect(result.totalPercent).toBe(75);
    expect(result.level).toBe('Nearly Ready');
  });

  test('handles zero score', () => {
    const result = computeChallengeTotals({ scoreTotal: 0, scoreMax: 200 });
    expect(result.totalPercent).toBe(0);
    expect(result.level).toBe('High Risk');
  });
});

describe('computeHackBreakdown', () => {
  const sampleCards = [
    { hackKey: 'H', score: 3 },
    { hackKey: 'H', score: 4 },
    { hackKey: 'A', score: 2 },
    { hackKey: 'A', score: 3 },
    { hackKey: 'A', score: 4 },
    { hackKey: 'C', score: 0 },
    { hackKey: 'C', score: 1 },
    { hackKey: 'K', score: 4 },
    { hackKey: null, score: 3 }, // should be ignored
    { hackKey: 'H', score: null }, // should be ignored for score
  ];

  test('calculates breakdown per HACK key', () => {
    const result = computeHackBreakdown(sampleCards);
    
    expect(result).toHaveLength(4);
    expect(result[0].hackKey).toBe('H');
    expect(result[0].scoreEarned).toBe(7); // 3 + 4
    expect(result[0].scoreMax).toBe(12); // 3 cards × 4 (including the null score card still counts)
    expect(result[0].pct).toBeCloseTo(58.333); // 7 ÷ 12
    expect(result[0].cardCount).toBe(3);

    expect(result[1].hackKey).toBe('A');
    expect(result[1].scoreEarned).toBe(9); // 2 + 3 + 4
    expect(result[1].scoreMax).toBe(12);
    expect(result[1].pct).toBe(75);
    expect(result[1].cardCount).toBe(3);

    expect(result[2].hackKey).toBe('C');
    expect(result[2].scoreEarned).toBe(1); // 0 + 1
    expect(result[2].scoreMax).toBe(8);
    expect(result[2].pct).toBe(12.5);
    expect(result[2].cardCount).toBe(2);

    expect(result[3].hackKey).toBe('K');
    expect(result[3].scoreEarned).toBe(4);
    expect(result[3].scoreMax).toBe(4);
    expect(result[3].pct).toBe(100);
    expect(result[3].cardCount).toBe(1);
  });

  test('handles empty array', () => {
    const result = computeHackBreakdown([]);
    expect(result).toHaveLength(4);
    expect(result.every(r => r.scoreEarned === 0 && r.scoreMax === 0 && r.pct === 0 && r.cardCount === 0)).toBe(true);
  });
});

describe('computeCategoryBreakdown', () => {
  const sampleCards = [
    { category: 'Phishing', score: 4 },
    { category: 'Phishing', score: 3 },
    { category: 'Impersonation', score: 2 },
    { category: 'Impersonation', score: 1 },
    { category: 'Impersonation', score: 0 },
    { category: 'Money', score: 4 },
    { category: null, score: 3 }, // should be ignored
    { category: 'Money', score: null }, // should be ignored for score
  ];

  test('calculates breakdown per category', () => {
    const result = computeCategoryBreakdown(sampleCards);
    
    expect(result).toHaveLength(3);
    
    // Sorted by pct descending
    // Money: 4/4 = 100%
    // Phishing: 7/8 = 87.5%
    // Impersonation: 3/12 = 25%
    expect(result[0].category).toBe('Money');
    expect(result[0].scoreEarned).toBe(4);
    expect(result[0].scoreMax).toBe(4);
    expect(result[0].pct).toBe(100);
    expect(result[0].cardCount).toBe(1);

    expect(result[1].category).toBe('Phishing');
    expect(result[1].scoreEarned).toBe(7);
    expect(result[1].scoreMax).toBe(8);
    expect(result[1].pct).toBe(87.5);
    expect(result[1].cardCount).toBe(2);

    expect(result[2].category).toBe('Impersonation');
    expect(result[2].scoreEarned).toBe(3); // 2 + 1 + 0
    expect(result[2].scoreMax).toBe(12);
    expect(result[2].pct).toBe(25);
    expect(result[2].cardCount).toBe(3);
  });

  test('handles empty array', () => {
    const result = computeCategoryBreakdown([]);
    expect(result).toHaveLength(0);
  });

  test('handles cards with null category', () => {
    const cards = [
      { category: null, score: 4 },
      { category: null, score: 3 },
    ];
    const result = computeCategoryBreakdown(cards);
    expect(result).toHaveLength(0);
  });
});