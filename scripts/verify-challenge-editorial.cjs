const fs = require("node:fs");
const assert = require("node:assert/strict");
const read = (path) => fs.readFileSync(path, "utf8");
const expected = {
  "app/page.tsx": [
    "Your trip should be the adventure.", "Not the scam.",
    "It looks legitimate.", "Why did that message almost work?",
    'href="/faq"'
  ],
  "app/travelsafe/page.tsx": [
    "Your booking needs attention. Right now.", "What is your next move?",
    'href="/faq"'
  ],
  "app/challenge/page.tsx": [
    "There is one way to find out.", "40+ real-life scenarios",
    "Mom, it’s me. I need money.", "Great apartment. One deposit away.",
    "The CEO needs this approved. Immediately.", 'href="/faq"'
  ],
  "app/[edition]/page.tsx": [
    "Your booking needs attention. Right now.",
    "Mom, it’s me. I need money.",
    "You just won. Claim it now.",
    "Great apartment. One deposit away.",
    "The CEO needs this approved. Immediately.",
    'href="/faq"'
  ],
  "app/pricing/page.tsx": [
    "Curious what you would do next?", "$6.99",
    "$24.99", "$4.99", "/ year", "Unlock all five",
    "does not guarantee protection", 'href="/faq"'
  ],
  "lib/challenge/uiStrings.ts": [
    "You are up. What is your move?",
    "See how my move holds up", "Du bist dran."
  ],
  "lib/challenge/resultStrings.ts": [
    "You made the calls. Now see your pattern.",
    "Your score tells one story.",
    "Now practise changing it.",
    "$6.99/year", "$24.99/year",
    "not a guarantee of protection"
  ],
  "app/challenge/session/[sessionId]/feedback/page.tsx": [
    "Good catch. You kept the next move yours.",
    "That choice gave the request control.",
    "Verify"
  ],
  "app/faq/page.tsx": [
    "What can I try for free?", "Do I need an email address",
    "16 or older", "two free readiness checks",
    "annual subscriptions", "does not", "Privacy Policy"
  ],
  "app/de/faq/page.tsx": [
    "Was ist kostenlos?", "Brauche ich eine E-Mail-Adresse",
    "Jahresabos", "Datenschutzerkl"
  ],
  "components/PremiumSiteChrome.tsx": [
    'href="/faq"', 'href="/de/faq"',
    '"/faq": "/de/faq"'
  ],
};
for (const [file, needles] of Object.entries(expected)) {
  const content = read(file);
  for (const needle of needles) {
    assert.ok(content.includes(needle), `${file} is missing ${JSON.stringify(needle)}`);
  }
}
assert.ok(read("lib/challenge/startHandler.ts").includes("FREE_DIAGNOSTIC_ROUNDS = 2"), "Do not change free limit in editorial release");
assert.ok(read("app/challenge/[edition]/start/route.ts").includes("handleChallengeStart"), "Retain session workflow");
assert.ok(read("app/challenge/session/[sessionId]/results/page.tsx").includes("computeHackProfile"), "Retain actual scoring model");
console.log("PASS: Konfydence desired editorial hooks, claims, bilingual FAQs, pricing and challenge session boundaries");
