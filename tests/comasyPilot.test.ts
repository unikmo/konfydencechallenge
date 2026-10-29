import {PILOT_LIMITS,scenarioProgrammeIds,pilotExpired} from "../lib/comasyPlans";
import {buildShareableSummary} from "../lib/comasySummary";
import {pilotEvidenceChecks} from "../lib/comasyEvidence";
describe("free organisation pilots",()=>{
 it("bounds participants and unique scenarios across campaigns",()=>{expect(PILOT_LIMITS).toEqual({days:28,participants:20,scenarios:12});expect(scenarioProgrammeIds([{scenarioIds:"a,b"},{scenarioIds:"b,c"}],["c","d"])).toEqual(["a","b","c","d"]);});
 it("expires at the agreed end date",()=>{expect(pilotExpired({pilotEndsAt:new Date("2026-10-28")},new Date("2026-10-28"))).toBe(true);expect(pilotExpired({pilotEndsAt:null})).toBe(false);});
 it("suppresses summaries until five people have recorded decisions",()=>{expect(buildShareableSummary({respondentCount:4,pauseAdoption:100,verificationRate:100,impulseRate:0})).toEqual({schemaVersion:1,withheld:true,reason:"Fewer than five participants have recorded decisions."});});
 it("exports only coarse organisation-level fields",()=>{const result=buildShareableSummary({respondentCount:7,pauseAdoption:72,verificationRate:68,impulseRate:19});expect(result).toEqual({schemaVersion:1,withheld:false,respondentBand:"5–9",pauseAdoptionPercent:70,verificationPercent:70,impulsePercent:20});});
 it("shows incomplete evidence as gaps rather than compliance",()=>{const rows=pilotEvidenceChecks({adminCount:1,objectives:null,dataHandlingConfirmedAt:null,evidenceOwner:null,evidenceReviewAt:null,campaigns:[],responses:0});expect(rows.filter(r=>r.recorded)).toHaveLength(1);expect(rows.filter(r=>!r.recorded)).toHaveLength(7);});
});
