import { classifyScenarioResponse, summarizeBehaviour } from "../lib/comasyMetrics";

describe("CoMaSy behavioural measurement", () => {
  const participant = (id: string) => ({ participantId: id, participant: { cohortId: "finance", cohort: { name: "Finance" } } });
  const row = (participantId: string, designation: string, pause: boolean, verification: boolean, impulse: boolean, hackKey: string, score: number) => ({
    ...participant(participantId), score, pause, verification, impulse, hackKey, campaign: { designation },
  });

  it("calculates participation, operational metrics and pre/post movement from decisions", () => {
    const responses = [
      row("p1","BASELINE",false,false,true,"H",0), row("p1","BASELINE",false,false,true,"A",0), row("p1","BASELINE",false,false,true,"C",0), row("p1","BASELINE",true,true,false,"K",4),
      row("p2","BASELINE",false,false,true,"H",0), row("p2","BASELINE",false,false,true,"A",0), row("p2","BASELINE",false,false,true,"C",0), row("p2","BASELINE",true,true,false,"K",4),
      row("p1","FOLLOWUP",true,true,false,"H",4), row("p1","FOLLOWUP",true,true,false,"A",4), row("p1","FOLLOWUP",true,true,false,"C",4), row("p1","FOLLOWUP",false,false,true,"K",0),
      row("p2","FOLLOWUP",true,true,false,"H",4), row("p2","FOLLOWUP",true,true,false,"A",4), row("p2","FOLLOWUP",true,true,false,"C",4), row("p2","FOLLOWUP",false,false,true,"K",0),
    ];
    const m = summarizeBehaviour(responses, 4, 1);
    expect(m.participationRate).toBe(50);
    expect(m.pauseAdoption).toBe(50);
    expect(m.verificationRate).toBe(50);
    expect(m.impulseRate).toBe(50);
    expect(m.baselinePause).toBe(25);
    expect(m.followupPause).toBe(75);
    expect(m.prePostChange).toBe(50);
    expect(m.cohorts[0]).toMatchObject({ name: "Finance", responses: 16, pauseAdoption: 50, verificationRate: 50, impulseRate: 50 });
    expect(m.attentionCohorts).toHaveLength(1);
  });

  it("uses explicit scenario behaviour keys when configured", () => {
    expect(classifyScenarioResponse({ selectedKey: "B", answerText: "Proceed", score: 2, pauseKeys: "B,C", verificationKeys: "C", impulseKeys: "A" })).toEqual({ pause: true, verification: false, impulse: false });
  });

  it("uses transparent score/language fallbacks without profile overrides", () => {
    expect(classifyScenarioResponse({ selectedKey: "C", answerText: "Call the supplier using a known number and verify first", score: 4 })).toEqual({ pause: true, verification: true, impulse: false });
    expect(classifyScenarioResponse({ selectedKey: "A", answerText: "Pay immediately", score: 0 })).toEqual({ pause: false, verification: false, impulse: true });
  });
});
