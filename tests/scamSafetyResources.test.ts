import fs from "node:fs";
import path from "node:path";
import { SCAM_SAFETY_RESOURCES } from "../lib/scamSafetyResources";

describe("scam safety resource previews", () => {
  test("uses bundled same-origin previews for every resource", () => {
    expect(SCAM_SAFETY_RESOURCES).toHaveLength(21);

    for (const resource of SCAM_SAFETY_RESOURCES) {
      expect(resource.previewPath).toMatch(/^\/resources\/[^?]+\.svg$/);
      expect(resource.previewPath).not.toContain("/api/");
      expect(fs.existsSync(path.join(process.cwd(), "public", resource.previewPath))).toBe(true);
      expect(resource.downloadPath).toBe(`/api/resources/asset?resource=${resource.id}`);
    }
  });
});
