#!/usr/bin/env python3
"""Read-only desktop/mobile smoke test of production Konfydence editorial flows."""
import asyncio, json, os, sys, time
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("KONFYDENCE_URL", "https://konfydence.com").rstrip("/")
ART = Path("artifacts/konfydence-live"); ART.mkdir(parents=True, exist_ok=True)
TESTS = []
ROUTES = [
    ("/", "Your trip should be the adventure."),
    ("/challenge", "There is one way to find out."),
    ("/family", "Mom, it’s me. I need money."),
    ("/school", "You just won. Claim it now."),
    ("/university", "Great apartment. One deposit away."),
    ("/workplace", "The CEO needs this approved. Immediately."),
    ("/travelsafe", "Your booking needs attention. Right now."),
    ("/pricing", "Curious what you would do next?"),
    ("/faq", "Everything you were wondering, answered."),
    ("/hack-method", "Why did that message almost work?"),
    ("/de", "Du kennst die Warnzeichen."),
    ("/de/challenge", "Glaubst du, du würdest es erkennen?"),
    ("/de/travelsafe", "Deine Buchung muss sofort bestätigt werden."),
    ("/de/pricing", "Neugierig auf deine nächste Entscheidung?"),
    ("/de/faq", "Gute Fragen. Klare Antworten."),
    ("/privacy-policy", "Privacy"),
    ("/terms-of-service", "Terms"),
]
def record(name, passed, detail=""):
    item = {"test": name, "result": "PASS" if passed else "FAIL", "detail": str(detail)[:300]}
    TESTS.append(item)
    print(json.dumps(item, ensure_ascii=False), flush=True)
async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        for device, width, height in [("desktop", 1440, 900), ("mobile", 390, 844)]:
            context = await browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=1)
            page = await context.new_page()
            errors = []
            page.on("pageerror", lambda exc: errors.append(str(exc)[:300]))
            for path, expected in ROUTES:
                try:
                    response = await page.goto(BASE + path, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(250)
                    body = await page.locator("body").inner_text()
                    status = response.status if response else 0
                    record(f"{device} route {path}", status == 200 and expected.lower() in body.lower(),
                           f"HTTP {status} heading={expected!r} title={await page.title()!r}")
                    overflow = await page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 4")
                    record(f"{device} overflow {path}", not overflow, "No major horizontal scroll")
                    if path == "/":
                        record(f"{device} retained TravelSafe hero", "Not the scam." in body and "Practise the decision before the pressure is real." in body)
                    if path == "/challenge":
                        record(f"{device} free challenge href",
                               await page.locator('a[href="/challenge/family/start?mode=diagnostic"]').count() > 0,
                               "Link exists; free session not started")
                        record(f"{device} price disclosures", "$6.99" in body and "$24.99" in body)
                    if path == "/pricing":
                        record(f"{device} annual plan disclosure", "annual" in body.lower() and "$6.99" in body and "$24.99" in body)
                        record(f"{device} protection disclaimer", "does not guarantee protection" in body.lower())
                    if path in ["/faq", "/de/faq"]:
                        details = page.locator("section details")
                        record(f"{device} FAQ questions {path}", await details.count() >= 12, f"{await details.count()} disclosures")
                        if await details.count() > 0:
                            await details.first.locator("summary").click(timeout=6000)
                            record(f"{device} FAQ accordion {path}", await details.first.evaluate("(el) => el.open"))
                    if path in ["/", "/challenge", "/pricing", "/faq", "/family", "/de/faq"]:
                        await page.screenshot(path=str(ART / f"{device}-{(path.strip('/') or 'home').replace('/', '-')}.png"), full_page=True)
                except Exception as exc:
                    record(f"{device} route {path}", False, repr(exc))
            record(f"{device} JS errors", len(errors) == 0, errors[:5])
            await context.close()
        await browser.close()
    report = {"url": BASE, "timestamp": int(time.time()), "passed": sum(t["result"] == "PASS" for t in TESTS),
              "failed": sum(t["result"] == "FAIL" for t in TESTS), "tests": TESTS}
    (ART / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print("KONFYDENCE_E2E_REPORT=" + json.dumps({"passed": report["passed"], "failed": report["failed"]}), flush=True)
    return 0 if report["failed"] == 0 else 1
if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
