type Draft = { id: string; title: string | null; prompt: string; lang: string; hackKey: string | null; answersA: string; answersB: string; answersC: string; scoresA: number; scoresB: number; scoresC: number; explanation: string | null; proTip: string | null; comasyProfile: { pauseKeys: string | null; verificationKeys: string | null; impulseKeys: string | null } | null };
export function CustomScenarioForm({ draft }: { draft?: Draft }) {
  return <form className="form" action="/api/comasy/scenarios" method="post">
    <input type="hidden" name="action" value={draft ? "edit" : "create"} />
    {draft ? <input type="hidden" name="scenarioId" value={draft.id} /> : null}
    <label>Title<input name="title" required minLength={5} maxLength={160} defaultValue={draft?.title || ""} /></label>
    <div className="split"><label>Language<select name="lang" defaultValue={draft?.lang || "en"}><option value="en">English</option><option value="de">Deutsch</option></select></label><label>Pressure pattern<select name="hackKey" defaultValue={draft?.hackKey || "H"}><option value="H">Hurry</option><option value="A">Authority</option><option value="C">Comfort</option><option value="K">Kill-Switch / Critical Action</option></select></label></div>
    <label>Situation<textarea name="prompt" required minLength={30} maxLength={5000} rows={5} defaultValue={draft?.prompt} /></label>
    {(["A", "B", "C"] as const).map(key => <div className="split" key={key}><label>Action {key}<textarea name={"answers" + key} required minLength={5} maxLength={1000} defaultValue={draft?.[("answers" + key) as "answersA" | "answersB" | "answersC"]} /></label><label>Score {key} (0–4)<input name={"scores" + key} type="number" min={0} max={4} required defaultValue={draft?.[("scores" + key) as "scoresA" | "scoresB" | "scoresC"] ?? (key === "B" ? 4 : key === "C" ? 2 : 0)} /></label></div>)}
    <label>Explanation<textarea name="explanation" required minLength={30} maxLength={3000} defaultValue={draft?.explanation || ""} /></label>
    <label>Reusable verification rule<textarea name="proTip" required minLength={10} maxLength={1000} defaultValue={draft?.proTip || ""} /></label>
    <p className="muted">Exactly one answer must score 4. Explicitly classify actions for reporting using A, B or C, separated by commas. An impulse action cannot also count as pause or verification.</p>
    <label>Pause actions<input name="pauseKeys" required pattern="[ABC](,[ABC])*" defaultValue={draft?.comasyProfile?.pauseKeys || "B,C"} /></label>
    <label>Independent verification actions<input name="verificationKeys" required pattern="[ABC](,[ABC])*" defaultValue={draft?.comasyProfile?.verificationKeys || "B"} /></label>
    <label>Impulse actions<input name="impulseKeys" required pattern="[ABC](,[ABC])*" defaultValue={draft?.comasyProfile?.impulseKeys || "A"} /></label>
    <button className="submit" type="submit">Save draft</button>
  </form>;
}
