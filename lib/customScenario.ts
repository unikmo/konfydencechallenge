import { z } from "zod";
const keys = z.string().regex(/^[ABC](,[ABC])*$/, "Use A, B or C, separated by commas");
export const customScenarioSchema = z.object({
  title: z.string().trim().min(5).max(160),
  prompt: z.string().trim().min(30).max(5000),
  lang: z.enum(["en", "de"]),
  hackKey: z.enum(["H", "A", "C", "K"]),
  answersA: z.string().trim().min(5).max(1000),
  answersB: z.string().trim().min(5).max(1000),
  answersC: z.string().trim().min(5).max(1000),
  scoresA: z.coerce.number().int().min(0).max(4),
  scoresB: z.coerce.number().int().min(0).max(4),
  scoresC: z.coerce.number().int().min(0).max(4),
  explanation: z.string().trim().min(30).max(3000),
  proTip: z.string().trim().min(10).max(1000),
  pauseKeys: keys, verificationKeys: keys, impulseKeys: keys,
}).superRefine((value, ctx) => {
  const scores = [value.scoresA, value.scoresB, value.scoresC];
  if (Math.max(...scores) !== 4 || scores.filter(s => s === 4).length !== 1) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Exactly one strongest answer must score 4.", path: ["scoresA"] });
  }
  if (new Set([value.answersA, value.answersB, value.answersC].map(s => s.toLowerCase())).size !== 3) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Provide three distinct actions.", path: ["answersA"] });
  }
  for (const key of ["A", "B", "C"]) {
    if (value.impulseKeys.split(",").includes(key) && [...value.pauseKeys.split(","), ...value.verificationKeys.split(",")].includes(key)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "An impulse action cannot count as pause or verification.", path: ["impulseKeys"] });
    }
  }
});
export function parseCustomScenario(form: FormData) {
  const fields = ["title", "prompt", "lang", "hackKey", "answersA", "answersB", "answersC", "scoresA", "scoresB", "scoresC", "explanation", "proTip", "pauseKeys", "verificationKeys", "impulseKeys"];
  return customScenarioSchema.safeParse(Object.fromEntries(fields.map(key => [key, String(form.get(key) ?? "").trim()])));
}
