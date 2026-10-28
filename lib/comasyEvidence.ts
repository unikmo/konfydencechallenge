export function pilotEvidenceChecks(input:{adminCount:number;objectives:string|null;dataHandlingConfirmedAt:Date|null;evidenceOwner:string|null;evidenceReviewAt:Date|null;campaigns:Array<{designation:string}>;responses:number}) {
 return [
 {label:"Named organisation administrator",recorded:input.adminCount>0},
 {label:"Pilot objectives documented",recorded:Boolean(input.objectives)},
 {label:"Data-handling agreement recorded",recorded:Boolean(input.dataHandlingConfirmedAt)},
 {label:"Evidence owner assigned",recorded:Boolean(input.evidenceOwner)},
 {label:"Baseline campaign",recorded:input.campaigns.some(c=>c.designation==="BASELINE")},
 {label:"Follow-up campaign",recorded:input.campaigns.some(c=>c.designation==="FOLLOWUP")},
 {label:"Participant decisions recorded",recorded:input.responses>0},
 {label:"Results reviewed by the organisation",recorded:Boolean(input.evidenceReviewAt)},
 ];
}
