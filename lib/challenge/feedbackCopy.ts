const FOUR_LEADS = [
  "No-brainer territory",
  "Clean call",
  "Sharp eyes",
  "Clever move",
  "Smart call",
  "First-class judgement",
  "Excellent pause",
  "Strong read",
  "Rocket-scientist energy",
  "Calm traveller instincts",
];

const FOUR_TAILS = [
  "you nailed it.",
  "you chose proof over pressure.",
  "you kept control of the next step.",
  "you checked before you clicked.",
  "you made the scam wait.",
];

const COMMENTS: Record<number, string[]> = {
  4: FOUR_LEADS.flatMap((lead) => FOUR_TAILS.map((tail) => lead + ": " + tail)),
  3: [
    "Very close. One more independent check would make this stronger.",
    "Good instinct. Keep the pause and tighten the verification.",
    "Nearly there. Check through a channel you chose yourself.",
    "Solid read. One small shortcut is still enough for a scammer to use.",
    "You saw the pressure. Now close the verification gap.",
    "Good call, with one loose end. Tie it up before acting.",
    "You were on the right track. Make the source prove itself.",
    "Almost first class. Add one independent check at the gate.",
    "The instinct was right; the channel needs a second look.",
    "You slowed things down. Now confirm who is really asking.",
    "Close one. A known route would make this much safer.",
    "Good judgement with a small opening left ajar.",
    "You caught the pressure, but do not let it choose the next step.",
    "Nearly nailed it. Verify outside the original message.",
    "A smart pause. Give the facts one more word.",
    "You read the warning sign. Now check the destination.",
    "Good traveller instinct. Keep your payment details out of the rush.",
    "The safe habit is forming. Add a direct source check.",
    "Nearly there. Suspicious convenience still needs proof.",
    "You protected part of the trip. Protect the handoff too.",
    "Good thinking. One extra step separates careful from certain.",
    "You did not panic. Now make sure the contact is genuine.",
    "Strong start. Finish the job through an official route.",
    "The scam did not get a free pass, but it got a small opening.",
    "Almost perfect. Your next upgrade is independent verification.",
  ],
  2: [
    "You saw part of the trap. The missing piece is an independent check.",
    "Not a bad instinct, but the request still has a small opening.",
    "You slowed the scam down. Now make sure the channel is genuinely yours.",
    "Halfway to a safer call: notice the pressure, then verify outside the message.",
    "You noticed the odd bit. Do not let the convenient bit win.",
    "There is a useful instinct here. Pair it with a known contact route.",
    "You took one step back. Take one more before sharing or paying.",
    "The story sounded plausible. Plausible still needs checking.",
    "You found the pressure point. Now protect the next action.",
    "A decent pause, but the source has not earned your trust yet.",
    "You are learning the pattern. Urgency is a clue, not a command.",
    "The answer had promise. Make verification the next move.",
    "You spotted the surface. Look for the official route underneath.",
    "Not far off. Keep the booking, account, and card out of the rush.",
    "A reasonable instinct needs a stronger finish.",
    "You resisted some pressure. Now resist the shortcut too.",
    "The trap is visible now. Next time, give it less room.",
    "Good lesson in progress: check the channel, not just the story.",
    "You did not miss everything. Build the independent-check habit.",
    "The safest move is still available: pause, verify, then act.",
  ],
  1: [
    "You noticed something, but the pressure still got a vote. Pause, verify, then act.",
    "The instinct was there. Do not let a plausible story choose the channel.",
    "You found one clue, but the request still moved you too quickly.",
    "Good place to practise: urgency is not evidence, even when the message sounds polished.",
    "You sensed a problem. Next time, stop the action before checking the details.",
    "One warning sign is useful; an independent check is safer.",
    "The message asked for speed. Your safer habit is to create time.",
    "You were right to be uneasy. Trust that feeling enough to verify.",
    "The story pulled you forward. Step back and use a known route.",
    "You caught a clue, but not the whole pattern yet.",
    "The safest answer starts with a pause, not a tap.",
    "A little more distance from the message would have helped here.",
    "You have the beginning of the habit. Now check before committing.",
    "The pressure sounded convincing. That is exactly when verification matters.",
    "You noticed the unusual detail. Let it stop you next time.",
    "The request was friendly, but friendly is not the same as official.",
    "You can recover this pattern: pause, open the real app, and check there.",
    "The clue was present. Give yourself time to act on it.",
    "A useful miss. The goal is to make the next decision calmer.",
    "You are not expected to know every scam. You are expected to verify the next step.",
  ],
  0: [
    "The pressure worked this time. That is exactly why we practise here.",
    "The request got you moving before the facts did. Next time, make verification first.",
    "No shame in a practice miss. Stop the rush and check independently.",
    "The scam tried to set the pace. Your next move is to take the pace back.",
    "That was a convincing setup. Leave the message and check elsewhere.",
    "The urgency won this round. It does not get to win the next one.",
    "A practice miss, not a verdict. Build in a pause before every payment or login.",
    "The story moved faster than the evidence. Slow the next one down.",
    "The request looked official enough. Open the real service yourself next time.",
    "You were given a rush instead of proof. Ask for proof first.",
    "The pressure found an opening. A known contact route closes it.",
    "This is the exact moment the pause habit is for.",
    "The scam borrowed trust. Return to a source you already know.",
    "A hard-looking scenario, and a useful lesson: never let the message set the rules.",
    "The request asked you to act now. Your safer answer is not yet.",
    "The trap was designed to feel ordinary. That is why independent checking matters.",
    "You can reset the pattern: stop, verify, and only then decide.",
    "The message got the first move. You can take back the next one.",
    "This one was built to create pressure. Practise creating time.",
    "A useful miss today can become a safer reflex tomorrow.",
  ],
};

function stableIndex(value: string, length: number) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash % length;
}

// The session-specific rotation feels random but remains stable on refresh.
export function getFeedbackComment(score: number, sessionId: string, sameScoreOrdinal: number) {
  const bucket = Math.max(0, Math.min(4, Math.trunc(score)));
  const options = COMMENTS[bucket] ?? COMMENTS[0];
  const start = stableIndex(sessionId + ":" + bucket, options.length);
  const step = options.length === 50 || options.length === 25 ? 7 : 3;
  const index = (start + Math.max(0, sameScoreOrdinal) * step) % options.length;
  return options[index];
}


