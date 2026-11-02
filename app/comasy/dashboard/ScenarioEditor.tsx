import { ANSWER_KIND_LABEL, kindOf, type AnswerKind, type UiLang } from "@/lib/comasyCustomScenarios";

export type CustomScenarioRow = {
  id: string;
  title: string | null;
  prompt: string;
  lang: string;
  hackKey: string | null;
  answersA: string;
  answersB: string;
  answersC: string;
  scoresA: number;
  scoresB: number;
  scoresC: number;
  explanation: string | null;
  proTip: string | null;
  active: boolean;
  responseCount: number;
  roleFocus: string | null;
};

const COPY = {
  en: {
    pressure: { H: "Hurry", A: "Authority", C: "Comfort", K: "Critical Action" } as Record<string, string>,
    title: "Title",
    titlePlaceholder: "Supplier changes bank details",
    situation: "The situation",
    situationPlaceholder: "Describe what the person sees or is asked to do, in the voice of the message or call. Use a realistic, but invented, situation.",
    pattern: "Pressure pattern",
    choose: "Choose…",
    language: "Language",
    responsesTitle: "Three possible responses, and what each one amounts to",
    response: "Response",
    amounts: "What it amounts to",
    why: "Why the strong response is stronger",
    whyNote: "(shown after the answer)",
    tip: "One-line tip",
    optional: "(optional)",
    role: "Role focus",
    roleNote: "(optional, for your own filtering)",
    rolePlaceholder: "Accounts payable",
    save: "Save scenario",
    saveChanges: "Save changes",
    empty: "You have not written any scenarios yet. Scenarios you save here appear in the library when you create a campaign.",
    active: "ACTIVE",
    archived: "ARCHIVED",
    response1: "response",
    responseN: "responses",
    archive: "Archive",
    restore: "Restore",
    edit: "Edit",
    locked: "Locked: people have already answered it. Archive it and write a new version so earlier results stay accurate.",
  },
  de: {
    pressure: { H: "Hetze", A: "Autorität", C: "Vertrautheit", K: "Notbremse" } as Record<string, string>,
    title: "Titel",
    titlePlaceholder: "Lieferant ändert seine Bankverbindung",
    situation: "Die Situation",
    situationPlaceholder: "Beschreibt, was die Person sieht oder tun soll, im Ton der Nachricht oder des Anrufs. Nehmt eine realistische, aber erfundene Situation.",
    pattern: "Druckmuster",
    choose: "Bitte wählen …",
    language: "Sprache",
    responsesTitle: "Drei mögliche Reaktionen, und was jede davon bedeutet",
    response: "Reaktion",
    amounts: "Was sie bedeutet",
    why: "Warum die starke Reaktion die bessere ist",
    whyNote: "(wird nach der Antwort angezeigt)",
    tip: "Tipp in einem Satz",
    optional: "(optional)",
    role: "Rollenfokus",
    roleNote: "(optional, zum Filtern für euch)",
    rolePlaceholder: "Kreditorenbuchhaltung",
    save: "Szenario speichern",
    saveChanges: "Änderungen speichern",
    empty: "Ihr habt noch keine eigenen Szenarien geschrieben. Gespeicherte Szenarien erscheinen in der Bibliothek, wenn ihr eine Kampagne anlegt.",
    active: "AKTIV",
    archived: "ARCHIVIERT",
    response1: "Antwort",
    responseN: "Antworten",
    archive: "Archivieren",
    restore: "Wiederherstellen",
    edit: "Bearbeiten",
    locked: "Gesperrt: Es wurde schon geantwortet. Archiviert das Szenario und schreibt eine neue Fassung, damit frühere Ergebnisse stimmen.",
  },
} as const;

const KINDS: AnswerKind[] = ["strong", "partial", "weak"];

function ScenarioFields({ scenario, lang }: { scenario?: CustomScenarioRow; lang: UiLang }) {
  const t = COPY[lang];
  const answers = scenario ? [scenario.answersA, scenario.answersB, scenario.answersC] : ["", "", ""];
  const kinds = scenario
    ? [kindOf(scenario.scoresA), kindOf(scenario.scoresB), kindOf(scenario.scoresC)]
    : (["strong", "partial", "weak"] as AnswerKind[]);
  return (
    <>
      <input type="hidden" name="uiLang" value={lang} />
      <label>{t.title}<input name="title" required maxLength={120} defaultValue={scenario?.title ?? ""} placeholder={t.titlePlaceholder} /></label>
      <label>
        {t.situation}
        <textarea name="prompt" required rows={5} maxLength={1200} defaultValue={scenario?.prompt ?? ""} placeholder={t.situationPlaceholder} />
      </label>
      <div className="split">
        <label>
          {t.pattern}
          <select name="hackKey" required defaultValue={scenario?.hackKey ?? ""}>
            <option value="" disabled>{t.choose}</option>
            {(["H", "A", "C", "K"] as const).map((k) => <option key={k} value={k}>{t.pressure[k]}</option>)}
          </select>
        </label>
        <label>
          {t.language}
          <select name="lang" defaultValue={scenario?.lang ?? lang}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </label>
      </div>
      <p className="miniTitle">{t.responsesTitle}</p>
      {(["A", "B", "C"] as const).map((letter, i) => (
        <div key={letter} className="answerRow">
          <label>
            {t.response} {letter}
            <input name={`answer${letter}`} required maxLength={400} defaultValue={answers[i]} />
          </label>
          <label>
            {t.amounts}
            <select name={`kind${letter}`} defaultValue={kinds[i]}>
              {KINDS.map((k) => <option key={k} value={k}>{ANSWER_KIND_LABEL[lang][k]}</option>)}
            </select>
          </label>
        </div>
      ))}
      <label>{t.why} <small>{t.whyNote}</small>
        <textarea name="explanation" rows={3} maxLength={700} defaultValue={scenario?.explanation ?? ""} />
      </label>
      <label>{t.tip} <small>{t.optional}</small>
        <input name="proTip" maxLength={300} defaultValue={scenario?.proTip ?? ""} />
      </label>
      <label>{t.role} <small>{t.roleNote}</small>
        <input name="roleFocus" maxLength={80} defaultValue={scenario?.roleFocus ?? ""} placeholder={t.rolePlaceholder} />
      </label>
    </>
  );
}

export function ScenarioCreateForm({ lang = "en" }: { lang?: UiLang }) {
  const t = COPY[lang];
  return (
    <form className="form" action="/api/comasy/manage" method="post">
      <input type="hidden" name="action" value="create_scenario" />
      <ScenarioFields lang={lang} />
      <button className="submit" type="submit">{t.save}<span>→</span></button>
    </form>
  );
}

export function ScenarioList({ scenarios, lang = "en" }: { scenarios: CustomScenarioRow[]; lang?: UiLang }) {
  const t = COPY[lang];
  if (!scenarios.length) {
    return <p className="miniTitle">{t.empty}</p>;
  }
  return (
    <div className="scenarioList">
      {scenarios.map((s) => (
        <article key={s.id} className={s.active ? "scenarioItem" : "scenarioItem isArchived"}>
          <header>
            <b>{s.title || s.prompt.slice(0, 60)}</b>
            <span className="status">{s.active ? t.active : t.archived}</span>
          </header>
          <small>
            {t.pressure[s.hackKey ?? ""] ?? "—"} · {s.lang === "de" ? "Deutsch" : "English"} · {s.responseCount} {s.responseCount === 1 ? t.response1 : t.responseN}
            {s.roleFocus ? ` · ${s.roleFocus}` : ""}
          </small>
          <p>{s.prompt.length > 180 ? `${s.prompt.slice(0, 180)}…` : s.prompt}</p>
          <div className="inline">
            <form action="/api/comasy/manage" method="post" className="inline">
              <input type="hidden" name="action" value={s.active ? "archive_scenario" : "restore_scenario"} />
              <input type="hidden" name="scenarioId" value={s.id} />
              <button>{s.active ? t.archive : t.restore}</button>
            </form>
          </div>
          {s.responseCount === 0 ? (
            <details>
              <summary>{t.edit}</summary>
              <form className="form" action="/api/comasy/manage" method="post">
                <input type="hidden" name="action" value="update_scenario" />
                <input type="hidden" name="scenarioId" value={s.id} />
                <ScenarioFields scenario={s} lang={lang} />
                <button className="submit" type="submit">{t.saveChanges}<span>→</span></button>
              </form>
            </details>
          ) : (
            <small className="locked">{t.locked}</small>
          )}
        </article>
      ))}
    </div>
  );
}
