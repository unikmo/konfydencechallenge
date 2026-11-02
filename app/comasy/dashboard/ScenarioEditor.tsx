import { ANSWER_KIND_LABEL, kindOf, type AnswerKind } from "@/lib/comasyCustomScenarios";

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

const PRESSURE: Record<string, string> = { H: "Hurry", A: "Authority", C: "Comfort", K: "Critical Action" };

const KINDS: AnswerKind[] = ["strong", "partial", "weak"];

function ScenarioFields({ scenario }: { scenario?: CustomScenarioRow }) {
  const answers = scenario ? [scenario.answersA, scenario.answersB, scenario.answersC] : ["", "", ""];
  const kinds = scenario
    ? [kindOf(scenario.scoresA), kindOf(scenario.scoresB), kindOf(scenario.scoresC)]
    : (["strong", "partial", "weak"] as AnswerKind[]);
  return (
    <>
      <label>Title<input name="title" required maxLength={120} defaultValue={scenario?.title ?? ""} placeholder="Supplier changes bank details" /></label>
      <label>
        The situation
        <textarea name="prompt" required rows={5} maxLength={1200} defaultValue={scenario?.prompt ?? ""} placeholder="Describe what the person sees or is asked to do, in the voice of the message or call. Use a realistic, but invented, situation." />
      </label>
      <div className="split">
        <label>
          Pressure pattern
          <select name="hackKey" required defaultValue={scenario?.hackKey ?? ""}>
            <option value="" disabled>Choose…</option>
            <option value="H">Hurry</option>
            <option value="A">Authority</option>
            <option value="C">Comfort</option>
            <option value="K">Critical Action</option>
          </select>
        </label>
        <label>
          Language
          <select name="lang" defaultValue={scenario?.lang ?? "en"}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </label>
      </div>
      <p className="miniTitle">Three possible responses, and what each one amounts to</p>
      {(["A", "B", "C"] as const).map((letter, i) => (
        <div key={letter} className="answerRow">
          <label>
            Response {letter}
            <input name={`answer${letter}`} required maxLength={400} defaultValue={answers[i]} />
          </label>
          <label>
            What it amounts to
            <select name={`kind${letter}`} defaultValue={kinds[i]}>
              {KINDS.map((k) => <option key={k} value={k}>{ANSWER_KIND_LABEL[k]}</option>)}
            </select>
          </label>
        </div>
      ))}
      <label>Why the strong response is stronger <small>(shown after the answer)</small>
        <textarea name="explanation" rows={3} maxLength={700} defaultValue={scenario?.explanation ?? ""} />
      </label>
      <label>One-line tip <small>(optional)</small>
        <input name="proTip" maxLength={300} defaultValue={scenario?.proTip ?? ""} />
      </label>
      <label>Role focus <small>(optional, for your own filtering)</small>
        <input name="roleFocus" maxLength={80} defaultValue={scenario?.roleFocus ?? ""} placeholder="Accounts payable" />
      </label>
    </>
  );
}

export function ScenarioCreateForm() {
  return (
    <form className="form" action="/api/comasy/manage" method="post">
      <input type="hidden" name="action" value="create_scenario" />
      <ScenarioFields />
      <button className="submit" type="submit">Save scenario<span>→</span></button>
    </form>
  );
}

export function ScenarioList({ scenarios }: { scenarios: CustomScenarioRow[] }) {
  if (!scenarios.length) {
    return <p className="miniTitle">You have not written any scenarios yet. Scenarios you save here appear in the library when you create a campaign.</p>;
  }
  return (
    <div className="scenarioList">
      {scenarios.map((s) => (
        <article key={s.id} className={s.active ? "scenarioItem" : "scenarioItem isArchived"}>
          <header>
            <b>{s.title || s.prompt.slice(0, 60)}</b>
            <span className="status">{s.active ? "ACTIVE" : "ARCHIVED"}</span>
          </header>
          <small>
            {PRESSURE[s.hackKey ?? ""] ?? "—"} · {s.lang === "de" ? "Deutsch" : "English"} · {s.responseCount} response{s.responseCount === 1 ? "" : "s"}
            {s.roleFocus ? ` · ${s.roleFocus}` : ""}
          </small>
          <p>{s.prompt.length > 180 ? `${s.prompt.slice(0, 180)}…` : s.prompt}</p>
          <div className="inline">
            <form action="/api/comasy/manage" method="post" className="inline">
              <input type="hidden" name="action" value={s.active ? "archive_scenario" : "restore_scenario"} />
              <input type="hidden" name="scenarioId" value={s.id} />
              <button>{s.active ? "Archive" : "Restore"}</button>
            </form>
          </div>
          {s.responseCount === 0 ? (
            <details>
              <summary>Edit</summary>
              <form className="form" action="/api/comasy/manage" method="post">
                <input type="hidden" name="action" value="update_scenario" />
                <input type="hidden" name="scenarioId" value={s.id} />
                <ScenarioFields scenario={s} />
                <button className="submit" type="submit">Save changes<span>→</span></button>
              </form>
            </details>
          ) : (
            <small className="locked">Locked: people have already answered it. Archive it and write a new version so earlier results stay accurate.</small>
          )}
        </article>
      ))}
    </div>
  );
}
