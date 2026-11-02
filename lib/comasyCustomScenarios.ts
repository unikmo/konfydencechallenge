// Customer-authored CoMaSy scenarios.
//
// A customer writes a situation and three possible responses, and says what each
// response amounts to. We store it as an ordinary `Scenario` row (edition
// "custom", `organizationId` set) so the existing practice page, scoring and
// reporting work unchanged. The seed only retires rows in the five public
// editions, so custom rows are never touched by it.

export const CUSTOM_EDITION = "custom";
// Active custom scenarios allowed per organisation: a pilot gets 10, a paying
// customer 40. "Paying" matches the dashboard's own definition (ARR above zero,
// or stage WON / EXPANSION). Archived scenarios do not count toward the limit.
export const PILOT_CUSTOM_SCENARIO_LIMIT = 10;
export const CUSTOMER_CUSTOM_SCENARIO_LIMIT = 40;
// Hard ceiling on rows kept per organisation, archived ones included.
export const MAX_CUSTOM_SCENARIO_ROWS = 200;

export function customScenarioLimit(org: { stage: string; arr: number }): number {
  const paying = org.arr > 0 || org.stage === "WON" || org.stage === "EXPANSION";
  return paying ? CUSTOMER_CUSTOM_SCENARIO_LIMIT : PILOT_CUSTOM_SCENARIO_LIMIT;
}

export type AnswerKind = "strong" | "partial" | "weak";

/** Score per kind. Metrics treat score >= 3 as a pause and score <= 1 as an impulse. */
export const ANSWER_SCORE: Record<AnswerKind, number> = { strong: 3, partial: 2, weak: 0 };

export type UiLang = "en" | "de";

export const ANSWER_KIND_LABEL: Record<UiLang, Record<AnswerKind, string>> = {
  en: {
    strong: "Strong: pauses and verifies independently",
    partial: "Partly safe: some caution, but still exposed",
    weak: "Weak: acts on the pressure",
  },
  de: {
    strong: "Stark: hält inne und prüft unabhängig nach",
    partial: "Teils sicher: etwas Vorsicht, aber noch angreifbar",
    weak: "Schwach: gibt dem Druck nach",
  },
};

const ERRORS = {
  en: {
    title: (n: number) => `Give the scenario a title (up to ${n} characters).`,
    prompt: (n: number) => `Describe the situation in 20 to ${n} characters.`,
    hack: "Choose the pressure pattern the scenario is built around.",
    answers: (n: number) => `Each response needs 3 to ${n} characters.`,
    kinds: "Say what each response amounts to.",
    noStrong: "At least one response must be the strong one.",
    noWeaker: "Include at least one response that is weaker than the strong one.",
    distinct: "The three responses must be different.",
  },
  de: {
    title: (n: number) => `Gebt dem Szenario einen Titel (bis zu ${n} Zeichen).`,
    prompt: (n: number) => `Beschreibt die Situation in 20 bis ${n} Zeichen.`,
    hack: "Wählt das Druckmuster, um das das Szenario aufgebaut ist.",
    answers: (n: number) => `Jede Reaktion braucht 3 bis ${n} Zeichen.`,
    kinds: "Legt fest, was jede Reaktion bedeutet.",
    noStrong: "Mindestens eine Reaktion muss die starke sein.",
    noWeaker: "Nehmt mindestens eine Reaktion auf, die schwächer ist als die starke.",
    distinct: "Die drei Reaktionen müssen sich unterscheiden.",
  },
} as const;

const LIMITS = { title: 120, prompt: 1200, answer: 400, explanation: 700, proTip: 300 };

export type ParsedScenario =
  | {
      ok: true;
      value: {
        title: string;
        prompt: string;
        lang: "en" | "de";
        hackKey: "H" | "A" | "C" | "K";
        answers: [string, string, string];
        kinds: [AnswerKind, AnswerKind, AnswerKind];
        explanation: string | null;
        proTip: string | null;
        roleFocus: string | null;
      };
    }
  | { ok: false; error: string };

const text = (form: FormData, key: string) => String(form.get(key) ?? "").replace(/\s+\n/g, "\n").trim();
const isKind = (value: string): value is AnswerKind => value === "strong" || value === "partial" || value === "weak";

export function parseScenarioForm(form: FormData): ParsedScenario {
  const e = ERRORS[text(form, "uiLang") === "de" ? "de" : "en"];
  const title = text(form, "title");
  const prompt = text(form, "prompt");
  const lang = text(form, "lang") === "de" ? "de" : "en";
  const hack = text(form, "hackKey");
  const answers = ["answerA", "answerB", "answerC"].map((k) => text(form, k)) as [string, string, string];
  const kindValues = ["kindA", "kindB", "kindC"].map((k) => text(form, k));

  if (!title || title.length > LIMITS.title) return { ok: false, error: e.title(LIMITS.title) };
  if (prompt.length < 20 || prompt.length > LIMITS.prompt) return { ok: false, error: e.prompt(LIMITS.prompt) };
  if (!["H", "A", "C", "K"].includes(hack)) return { ok: false, error: e.hack };
  if (answers.some((a) => a.length < 3 || a.length > LIMITS.answer)) return { ok: false, error: e.answers(LIMITS.answer) };
  if (!kindValues.every(isKind)) return { ok: false, error: e.kinds };
  const kinds = kindValues as [AnswerKind, AnswerKind, AnswerKind];
  if (!kinds.includes("strong")) return { ok: false, error: e.noStrong };
  if (!kinds.includes("weak") && !kinds.includes("partial")) return { ok: false, error: e.noWeaker };
  if (new Set(answers.map((a) => a.toLowerCase())).size < 3) return { ok: false, error: e.distinct };

  const explanation = text(form, "explanation").slice(0, LIMITS.explanation) || null;
  const proTip = text(form, "proTip").slice(0, LIMITS.proTip) || null;
  const roleFocus = text(form, "roleFocus").slice(0, 80) || null;

  return { ok: true, value: { title, prompt, lang, hackKey: hack as "H" | "A" | "C" | "K", answers, kinds, explanation, proTip, roleFocus } };
}

/** Columns of a Scenario row built from a parsed form. */
export function scenarioColumns(parsed: Extract<ParsedScenario, { ok: true }>["value"]) {
  const [a, b, c] = parsed.answers;
  const [ka, kb, kc] = parsed.kinds;
  return {
    lang: parsed.lang,
    category: "custom",
    cardType: "scenario",
    scored: true,
    hackKey: parsed.hackKey,
    title: parsed.title,
    prompt: parsed.prompt,
    answersA: a,
    answersB: b,
    answersC: c,
    answersD: "",
    scoresA: ANSWER_SCORE[ka],
    scoresB: ANSWER_SCORE[kb],
    scoresC: ANSWER_SCORE[kc],
    scoresD: 0,
    explanation: parsed.explanation,
    proTip: parsed.proTip,
    active: true,
  };
}

/** Letters of the responses that count as each signal, for ComasyScenarioProfile. */
export function profileKeys(kinds: [AnswerKind, AnswerKind, AnswerKind]) {
  const letters = ["A", "B", "C"];
  const pick = (match: (k: AnswerKind) => boolean) => letters.filter((_, i) => match(kinds[i])).join(",") || null;
  return {
    pauseKeys: pick((k) => k === "strong"),
    verificationKeys: pick((k) => k === "strong"),
    impulseKeys: pick((k) => k === "weak"),
  };
}

export function kindOf(score: number): AnswerKind {
  return score >= 3 ? "strong" : score >= 1 ? "partial" : "weak";
}
