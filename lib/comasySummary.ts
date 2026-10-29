type SummaryInput={respondentCount:number;pauseAdoption:number;verificationRate:number;impulseRate:number};
export function buildShareableSummary(input:SummaryInput) {
 if(input.respondentCount<5)return {schemaVersion:1,withheld:true,reason:"Fewer than five participants have recorded decisions."};
 const round=(n:number)=>Math.round(Math.max(0,Math.min(100,n))/5)*5;
 return {schemaVersion:1,withheld:false,respondentBand:input.respondentCount<10?"5–9":input.respondentCount<20?"10–19":"20+",pauseAdoptionPercent:round(input.pauseAdoption),verificationPercent:round(input.verificationRate),impulsePercent:round(input.impulseRate)};
}
