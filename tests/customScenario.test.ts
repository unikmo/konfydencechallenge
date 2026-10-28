import { customScenarioSchema } from "../lib/customScenario";
import { availableComasyScenarios, COMASY_PLANS, isComasyPlan } from "../lib/comasyPlans";
const valid = { title: "Urgent supplier change", prompt: "A supplier requests an urgent change to their bank details before the next payment run.", lang: "en", hackKey: "H", answersA: "Change the bank details now", answersB: "Call a known supplier contact to verify", answersC: "Hold the payment and ask a colleague", scoresA: 0, scoresB: 4, scoresC: 2, explanation: "Verify a bank change through a previously known contact before changing payment details.", proTip: "Use a known number rather than replying to the message.", pauseKeys: "B,C", verificationKeys: "B", impulseKeys: "A" };
describe("custom scenario authoring", () => {
 it("accepts English and German scenarios with explicit scoring",()=>{expect(customScenarioSchema.safeParse(valid).success).toBe(true);expect(customScenarioSchema.safeParse({...valid,lang:"de"}).success).toBe(true);});
 it.each([{scoresA:4},{scoresB:3},{scoresC:5},{answersC:valid.answersA},{hackKey:"X"},{impulseKeys:"A,B"},{verificationKeys:""},{prompt:"short"}])("rejects invalid content/classifications %j", patch=>{expect(customScenarioSchema.safeParse({...valid,...patch}).success).toBe(false);});
 it("scopes availability to shared and this tenant's published content",()=>{expect(availableComasyScenarios("org-a")).toEqual({active:true,scored:true,OR:[{organizationId:null},{organizationId:"org-a",publicationStatus:"PUBLISHED"}]});});
 it("includes twelve self-authored scenarios in every free pilot",()=>{expect(COMASY_PLANS.FREE.priceUsd).toBe(0);expect(COMASY_PLANS.FREE.customScenarioLimit).toBe(12);expect(isComasyPlan("toString")).toBe(false);});
});
