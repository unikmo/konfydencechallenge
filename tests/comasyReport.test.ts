import { makeComasyCsv, makeComasyPdf } from "../lib/comasyReport";

const metrics = {
  participantCount: 20,
  activeCampaigns: 1,
  participationRate: 90,
  pauseAdoption: 72,
  verificationRate: 67,
  impulseRate: 18,
  prePostChange: 13,
  hackProfile: { H: 74, A: 58, C: 71, K: 69 },
  cohorts: [{ name: "Finance", responses: 40, pauseAdoption: 65, verificationRate: 60, impulseRate: 20 }],
};

describe("CoMaSy evidence exports", () => {
  it("exports the same core metrics to CSV", () => {
    const csv = makeComasyCsv("Acme GmbH", metrics, "executive");
    expect(csv).toContain('"Organisation","Acme GmbH"');
    expect(csv).toContain('"Pause Adoption %","72"');
    expect(csv).toContain('"Finance","40","65","60","20"');
  });

  it("generates a valid PDF and includes the compliance disclaimer", () => {
    const pdf = makeComasyPdf("Acme GmbH", metrics, "compliance");
    expect(pdf.subarray(0, 8).toString("ascii")).toBe("%PDF-1.4");
    const body = pdf.toString("ascii");
    expect(body).toContain("CoMaSy Compliance / NIS2 Evidence Report");
    expect(body).toContain("does not by itself establish NIS2 compliance");
  });
});
