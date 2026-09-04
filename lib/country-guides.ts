/**
 * Country scam guides — the SEO content layer for /countries/[country].
 *
 * A country only enters the sitemap and is indexable once its guide has
 * status: "published". Draft / missing guides render a minimal noindex page.
 *
 * Each scam is tagged with the H.A.C.K. pressure pattern it uses
 * (H = Hurry, A = Authority, C = Comfort, K = Kill-Switch) and the
 * Pause · Assess · Talk move that defuses it — the Konfydence angle that
 * makes these pages more than another listicle.
 */

export type HackKey = "H" | "A" | "C" | "K";

export type CountryScam = {
  name: string;
  how: string;
  hack: HackKey;
  move: string;
};

export type CountryFaq = { q: string; a: string };

export type CountryGuide = {
  intro: string;
  scams: CountryScam[];
  faqs: CountryFaq[];
  lastReviewed: string; // YYYY-MM
  status: "draft" | "published";
};

export const HACK_LABEL: Record<HackKey, string> = {
  H: "Hurry",
  A: "Authority",
  C: "Comfort",
  K: "Kill-Switch",
};

export const HACK_DEF: Record<HackKey, string> = {
  H: "Urgency. A deadline, a countdown or a “right now” that leaves no time to check.",
  A: "Officialdom. A badge, a title, a uniform or an official-sounding request you feel you can't question.",
  C: "Familiarity. A friendly local, a routine or an emotion that makes the request feel safer than it is.",
  K: "The cut-off. The moment you're pushed to pay, click, hand over a document or follow someone — before you can verify.",
};

/** The pressure pattern(s) most common in a guide's scams, most frequent first. */
export function dominantPatterns(guide: CountryGuide): HackKey[] {
  const counts = { H: 0, A: 0, C: 0, K: 0 } as Record<HackKey, number>;
  for (const s of guide.scams) counts[s.hack] += 1;
  const max = Math.max(...Object.values(counts));
  return (["H", "A", "C", "K"] as HackKey[]).filter((k) => counts[k] === max && max > 0);
}

export const COUNTRY_GUIDES: Record<string, CountryGuide> = {
  thailand: {
    intro:
      "Most scams in Thailand are friendly, not aggressive. They start with a helpful local near a temple, a tuk-tuk driver with a great idea, or a rental shop that seems relaxed about paperwork. The money is lost later, quietly.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "“The Grand Palace is closed” gem-shop tour",
        how: "A well-dressed stranger near a major temple tells you it is closed for a ceremony until the afternoon, then arranges a cheap tuk-tuk “tour” that stops at a gem or tailor shop where you are pressured to buy.",
        hack: "C",
        move: "Check opening hours on the official site yourself. Government temples do not close for private ceremonies. Walk to the gate and look.",
      },
      {
        name: "Jet-ski and motorbike damage claim",
        how: "You rent a jet-ski or scooter, hand over your passport as deposit, and on return the operator points to existing scratches and demands hundreds of dollars, keeping your passport until you pay.",
        hack: "K",
        move: "Never leave your passport — offer a cash deposit or a photocopy. Film the vehicle from every angle before you ride, with the operator in shot.",
      },
      {
        name: "Rigged taxi meter / “meter broken”",
        how: "Airport and tourist-area taxis refuse the meter and quote a flat fare two to three times the real price, or run a meter that climbs abnormally fast.",
        hack: "H",
        move: "Use Grab or the airport's public taxi desk. If a driver won't start the meter, get out before the doors close.",
      },
      {
        name: "Bar bill and “ping-pong show” overcharge",
        how: "A tout walks you to a show with “no entry fee”; inside, drinks are billed at 10x and a large bill plus “fines” appear when you try to leave, with staff blocking the door.",
        hack: "K",
        move: "Decline street touts entirely. If you are already inside and the bill is wrong, pay only what you ordered, photograph the menu, and leave toward a busy street.",
      },
      {
        name: "Fake tourist police and “fine” demands",
        how: "Someone in a vaguely official shirt stops you for “jaywalking”, “vaping” or dropping litter and demands an on-the-spot cash fine, sometimes with a fake ID.",
        hack: "A",
        move: "Real fines are paid at a station, not in cash on the street. Ask to walk to the nearest police station together — a scammer will drop it.",
      },
      {
        name: "Airport SIM and currency “help”",
        how: "A helper at a counter or ATM offers to “assist”, switches notes during the count, or sells an overpriced SIM with far less data than promised.",
        hack: "C",
        move: "Count cash yourself, away from the counter. Buy SIMs from the official carrier booths (AIS, TrueMove, dtac) and check the package on your phone before leaving.",
      },
    ],
    faqs: [
      {
        q: "What is the most common scam in Thailand?",
        a: "The “the temple is closed” gem-shop tour is the classic. A friendly, well-spoken local tells you a major attraction is shut, then routes you via tuk-tuk to shops that pay them commission.",
      },
      {
        q: "Are taxis in Thailand safe?",
        a: "Metered taxis are generally fine when the meter is actually used. The problem is drivers refusing the meter for a flat fare. Grab removes the negotiation entirely and is widely used.",
      },
      {
        q: "Should I hand over my passport to rent a scooter in Thailand?",
        a: "No. Passport-as-deposit is how damage-claim scams work — the operator holds your document hostage against an invented charge. Offer cash or a photocopy, and film the vehicle first.",
      },
    ],
  },

  spain: {
    intro:
      "Spain's scams are about your hands and your attention, not confrontation. Barcelona and Madrid have some of Europe's most practised pickpocket teams, and the street games are designed to move a crowd's focus for three seconds.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Distraction pickpocketing on Las Ramblas and the metro",
        how: "One person asks for directions, spills something on you, or shows you a map while a second lifts your phone or wallet. Common on Barcelona's Las Ramblas, around Sagrada Família, and on Line 3 of the metro.",
        hack: "C",
        move: "If a stranger crowds your space or touches you, step back and put a hand on your bag. Wear it across your front in crowds and on escalators.",
      },
      {
        name: "The “found” gold ring",
        how: "Someone picks up a ring in front of you, asks if it is yours, then insists you take it — and follows up asking for money “for the find” or to buy it. The ring is worthless.",
        hack: "C",
        move: "Don't take it and don't stop walking. Engaging at all is the hook.",
      },
      {
        name: "Rosemary sprig / flamenco flower",
        how: "A woman presses a sprig of rosemary into your hand “for luck” or as a “gift”, reads your palm, then aggressively demands payment and won't let go of your hand. Common outside Seville and Granada cathedrals.",
        hack: "H",
        move: "Keep your hands in your pockets near cathedral entrances. If you've taken it, drop it and walk — there is no obligation.",
      },
      {
        name: "Fake police “drug check”",
        how: "Men in plain clothes flash a badge, claim to be police checking for counterfeit notes or drugs, and ask to inspect your wallet or passport — palming cash or cards during the “check”.",
        hack: "A",
        move: "Real Spanish police in plain clothes will not check your cash in the street. Say you'll walk to the nearest station and keep your wallet in your pocket.",
      },
      {
        name: "Restaurant menu-price switch",
        how: "Tourist-strip restaurants near major sights bring a different, pricier menu after you sit, add a “cover” and “bread” you didn't order, or charge “terrace” rates not shown outside.",
        hack: "C",
        move: "Photograph the posted menu before sitting. Refuse and return anything you didn't order; check the bill line by line.",
      },
      {
        name: "Holiday-rental deposit fraud",
        how: "A listing (often copied from a real one, priced slightly low) asks for a deposit or full payment by bank transfer before viewing. The flat doesn't exist or isn't the owner's to rent.",
        hack: "K",
        move: "Never pay by transfer for an unseen flat. Book through a platform that holds payment until check-in, and reverse-image-search the photos.",
      },
    ],
    faqs: [
      {
        q: "Is Barcelona safe for tourists?",
        a: "Violent crime against tourists is rare; pickpocketing is not. Las Ramblas, the metro, the beach and the area around Sagrada Família are the hotspots. Keep bags closed and worn across the front.",
      },
      {
        q: "Do fake police operate in Spain?",
        a: "Yes, mainly in Barcelona and Madrid. The tell is that they ask to see or handle your wallet, cash or cards. Real officers don't. Offer to walk to a station instead.",
      },
    ],
  },

  italy: {
    intro:
      "Rome, Florence and Venice run on tourist volume, and a layer of small scams runs on top of it: fixed-price things sold as favours, official-looking helpers at ticket machines, and taxis that forget the airport flat fare exists.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "“Skip the line” ticket touts",
        how: "Outside the Colosseum, Vatican Museums and Uffizi, people in lanyards sell “fast-track” tickets at a large markup, or tours that dump you at the normal queue anyway.",
        hack: "H",
        move: "Buy from the official site (coopculture.it, museivaticani.va) before you travel. The real skip-the-line is the timed ticket you booked, not a person on the street.",
      },
      {
        name: "Airport taxi overcharge",
        how: "Drivers at Rome Fiumicino and Milan quote €80–100 or run a “tourist meter”, ignoring the fixed fare to the city centre (Rome: €50 to inside the Aurelian walls).",
        hack: "A",
        move: "Only take white taxis from the official rank. Confirm “fixed fare, fifty euro” before the doors close, or use the train (Leonardo Express).",
      },
      {
        name: "Friendship bracelet / grain for the birds",
        how: "A man ties a bracelet on your wrist or thrusts grain or a rose into your hand near the Spanish Steps or St Mark's Square, then demands several euros and blocks your path.",
        hack: "C",
        move: "Hands in pockets, don't slow down, don't make eye contact. If it's on your wrist, cut it off later — you owe nothing.",
      },
      {
        name: "Gladiator photo fee",
        how: "Costumed “centurions” near the Colosseum pose with you or your kids, then demand €10–20 per person, sometimes surrounding you.",
        hack: "H",
        move: "Agree a price out loud before any photo, or just say no. If they've already posed, hand over a couple of euros total and walk.",
      },
      {
        name: "Ticket-machine “helper” at stations",
        how: "At Termini and other stations, someone “helps” you use the machine, then demands a tip, or steers you to buy the wrong (pricier) ticket while a partner watches your bag.",
        hack: "C",
        move: "Use the Trenitalia or Italo app. If someone approaches the machine, stop and wait for them to leave.",
      },
      {
        name: "Restaurant cover and “fish by weight”",
        how: "Near major sights, a coperto and service you weren't told about appear, or fresh fish is billed “per 100g” at a rate that turns a main course into €60+.",
        hack: "C",
        move: "Ask the price of the fish before ordering and get the per-portion cost. A coperto is legal but must be on the menu — check it is.",
      },
    ],
    faqs: [
      {
        q: "How much should a taxi from Rome airport cost?",
        a: "There is a fixed fare of €50 from Fiumicino to anywhere inside the Aurelian walls, luggage included. Any higher quote from an official white taxi is an overcharge; unofficial drivers should be avoided entirely.",
      },
      {
        q: "Are the Colosseum ticket sellers on the street legitimate?",
        a: "Mostly not. Official tickets are sold online and at the site's own box office. Street sellers add a markup, and some “tours” leave you in the standard line.",
      },
    ],
  },

  france: {
    intro:
      "Paris scams cluster tightly around a handful of monuments — Sacré-Cœur, the Eiffel Tower, the Louvre, Pont Neuf — and on the metro line to the airport. Away from those, the city is mostly just a city.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Friendship-bracelet men at Sacré-Cœur",
        how: "On the steps below the basilica, men grab your wrist or finger to start braiding a bracelet, then demand €10–20 and won't release your hand until you pay, working in groups.",
        hack: "K",
        move: "Keep hands in pockets and take the funicular or side stairs, not the main steps. If grabbed, pull away firmly and keep moving toward the crowd.",
      },
      {
        name: "The “gold ring”",
        how: "Someone bends down, “finds” a gold ring near your feet, asks if it's yours, then offers to sell it cheap or asks for a reward. It's brass.",
        hack: "C",
        move: "“Non” and keep walking. Any response is the opening they want.",
      },
      {
        name: "Petition / “deaf charity” clipboard",
        how: "Young women with a clipboard ask you to sign a petition for a disability charity; while you read it, a partner opens your bag, or they demand a cash “donation” once you've signed.",
        hack: "C",
        move: "Don't stop, don't take the clipboard. Legitimate charities don't collect cash via street petitions at tourist sites.",
      },
      {
        name: "Shell game / three-card monte",
        how: "Near Pont Neuf and under the Eiffel Tower, a fast-hands game with cups or cards runs with planted “winners” in the crowd. You cannot win, and the crowd includes pickpockets.",
        hack: "H",
        move: "Never play, never stop to watch — the audience is the target as much as the player.",
      },
      {
        name: "Fake taxi at Charles de Gaulle",
        how: "Men approach in the arrivals hall offering “taxi?” and charge €90–150 flat for a ride that should be a fixed €56 (right bank) or €65 (left bank) in an official taxi.",
        hack: "A",
        move: "Ignore anyone offering a ride inside the terminal. Walk to the marked taxi rank; the fixed fare to central Paris is posted on the window.",
      },
      {
        name: "Metro Line 1 / RER B pickpockets",
        how: "Teams work the doors as they close on the airport line and near Louvre-Rivoli, one blocking, one lifting. Phones held near the door are the main target.",
        hack: "C",
        move: "Stand away from the doors with your bag in front. Don't hold your phone loosely near an open door at a station.",
      },
    ],
    faqs: [
      {
        q: "What's the fixed taxi fare from CDG to Paris?",
        a: "Official Paris taxis charge a flat €56 to the Right Bank and €65 to the Left Bank, luggage included. Anyone quoting more, or approaching you inside the terminal, is not an official taxi.",
      },
      {
        q: "Where do most Paris scams happen?",
        a: "Sacré-Cœur's steps, the Eiffel Tower lawns, around the Louvre, Pont Neuf, and on the RER B / Metro Line 1. The scams barely exist elsewhere in the city.",
      },
    ],
  },

  mexico: {
    intro:
      "For visitors, the day-to-day risk in Mexico's tourist areas is financial, not violent: card skimming, taxi overcharging, timeshare pressure and rental-car “damage”. The single best habit is to use ride apps and bank ATMs.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "ATM skimming and “helpful” card swaps",
        how: "Standalone ATMs in tourist zones (not inside banks) are fitted with skimmers, or a stranger “helps” at the machine and swaps your card. Cloned cards are drained later.",
        hack: "C",
        move: "Only use ATMs inside a bank branch during opening hours. Cover the keypad, and if anyone hovers, cancel and leave.",
      },
      {
        name: "Taxi “broken meter” and long routes",
        how: "Street taxis, especially from airports and tourist strips, refuse the meter, quote inflated flat fares, or take long routes. In a few cases this escalates to “express kidnapping” and forced ATM withdrawals.",
        hack: "K",
        move: "Use Uber, DiDi or the airport's prepaid taxi booth where you pay a fixed price inside before boarding. Don't flag taxis on the street.",
      },
      {
        name: "Timeshare / “vacation club” pressure",
        how: "At resort airports and lobbies, “welcome” staff offer free tours, breakfasts or transport, then hold you in a 90-minute hard-sell for a timeshare with a same-day-only “discount”.",
        hack: "H",
        move: "Decline the “free” offer at the airport. No genuine deal disappears if you leave the room to think or check reviews.",
      },
      {
        name: "Rental-car damage and insurance games",
        how: "The counter pushes expensive “mandatory” insurance on top of what you booked, or on return claims pre-existing scratches and charges your card without agreement.",
        hack: "A",
        move: "Photograph and video the car in full before leaving the lot, with a dated timestamp. Get any damage claim in writing and dispute the charge with your card issuer if needed.",
      },
      {
        name: "Police “fine” (mordida)",
        how: "An officer stops you for a vague or invented offence and suggests paying a cash “fine” on the spot to avoid going to the station or losing your licence.",
        hack: "A",
        move: "Stay calm and polite, ask for a written ticket (“infracción”) and to pay at the station. Note the officer's name and patrol number.",
      },
      {
        name: "Currency and change short-changing",
        how: "Vendors and some taxi drivers quote in dollars at a poor rate, or hand back change counting on you not knowing the notes. 20 and 500 peso notes look similar.",
        hack: "C",
        move: "Agree the price in pesos, count change before you move off, and learn the note colours on day one.",
      },
    ],
    faqs: [
      {
        q: "Is it safe to use taxis in Mexico?",
        a: "In tourist areas, use Uber, DiDi, or the airport's prepaid booth rather than hailing on the street. The common problem is overcharging; the rare but serious one is forced ATM withdrawals, which app-booked rides largely remove.",
      },
      {
        q: "How do I avoid card skimming in Mexico?",
        a: "Only withdraw cash from ATMs physically inside a bank branch, during business hours. Avoid standalone machines in shops, hotels and on the street, which are the ones most often tampered with.",
      },
    ],
  },

  turkey: {
    intro:
      "Istanbul's Sultanahmet district concentrates most tourist scams: over-friendly “guides” who route you to a shop, restaurants with no prices, and the classic shoeshine drop. The scams are persuasion, not force.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "The dropped shoeshine brush",
        how: "A shoeshiner walking ahead of you drops a brush; you pick it up and hand it back; he insists on shining your shoes as “thanks”, then demands a large fee.",
        hack: "C",
        move: "Let him pick up his own brush. If he starts on your shoes anyway, walk — you didn't agree a price or a service.",
      },
      {
        name: "“Let me show you my shop”",
        how: "A charming local strikes up conversation, walks with you, then leads you to a relative's carpet, jewellery or leather shop where tea appears and leaving without buying becomes very awkward.",
        hack: "C",
        move: "Enjoy the chat but don't follow anyone to a shop. “Maybe later, thank you” and change direction.",
      },
      {
        name: "Restaurants with no prices",
        how: "In Sultanahmet, menus omit prices or a waiter recommends dishes and mezes that aren't priced; the bill is two to three times normal, with “service” and “cover” added.",
        hack: "K",
        move: "Only sit where every item has a printed price. Ask the price of anything the waiter suggests, out loud, before it's served.",
      },
      {
        name: "Taxi note-switch and long routes",
        how: "You pay with a 200 lira note; the driver palms it and shows a 20, claiming you underpaid. Or the meter is on a fast “night” rate during the day, or the route loops.",
        hack: "H",
        move: "Say the note's value out loud as you hand it over, and photograph it first if you can. Use BiTaksi or Uber; check the route on your own map.",
      },
      {
        name: "The “raki bar” / hostess bill",
        how: "Men near Taksim or Istiklal invite you for a drink; inside, women join you, drinks are ordered, and a bill of several hundred euros arrives with security at the door.",
        hack: "K",
        move: "Never follow a street invitation to a bar. If you're already trapped, pay for your own drinks only, photograph the menu, and leave toward Istiklal's crowds.",
      },
      {
        name: "Fake ticket sellers at attractions",
        how: "Outside Hagia Sophia, the Basilica Cistern and Topkapı, sellers offer “no queue” tickets or tours at a markup, some invalid.",
        hack: "H",
        move: "Buy the Museum Pass or timed tickets on the official muze.gov.tr site. The real fast lane is your pre-booked slot.",
      },
    ],
    faqs: [
      {
        q: "Are restaurants in Istanbul a scam risk?",
        a: "Only the ones near Sultanahmet with no printed prices, or where the waiter brings unrequested mezes. Anywhere with a clear priced menu is fine. Always confirm the price of a recommended dish before it arrives.",
      },
      {
        q: "How should I pay for a taxi in Istanbul?",
        a: "Use the BiTaksi or Uber app so the fare and route are fixed. If paying cash, state the note's value aloud as you hand it over to prevent the note-switch trick.",
      },
    ],
  },

  egypt: {
    intro:
      "Around the Pyramids, Luxor and the Nile cruises, almost every interaction has a tip (baksheesh) attached, and a few of them are outright scams: “free” gifts, camel rides that cost more to get off than to get on, and “your hotel is closed” redirects.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "“It costs more to get down” camel and horse rides",
        how: "At Giza you agree a price for a camel or horse ride; once you're up and away from the entrance, the handler stops and demands a much larger sum to bring you back or help you dismount.",
        hack: "K",
        move: "Agree the full round-trip price in writing on your phone, pay half at the start and half back at the gate, and don't mount until that's clear. Better: book through your hotel.",
      },
      {
        name: "The “free gift”",
        how: "A vendor presses a scarab, bracelet or “gift for your wife” into your hand or bag, refuses to take it back, then follows you demanding payment.",
        hack: "C",
        move: "Keep your hands closed and say “no, thank you” without taking anything. If it's in your bag, put it down on their stall and walk.",
      },
      {
        name: "“Your hotel is closed / moved”",
        how: "A taxi driver or “helpful” man says your hotel has closed, is full, or has bad reviews, and takes you to one that pays him commission.",
        hack: "A",
        move: "Call your hotel directly to confirm. Insist on the address you booked; a driver who won't take you there is the scam.",
      },
      {
        name: "Papyrus and perfume “museum” tours",
        how: "A tour or driver includes a stop at a “government papyrus institute” or “perfume museum” — actually a shop with a hard sell and inflated prices for banana-leaf “papyrus” and diluted oils.",
        hack: "A",
        move: "Tell your guide up front: no shopping stops. If the car pulls in anyway, stay in it.",
      },
      {
        name: "Baksheesh ambush at monuments",
        how: "A “guard” waves you past a rope, points out a carving, or offers to take your photo in a tomb, then demands a tip and blocks the exit; some also try to get you to hand over your camera.",
        hack: "A",
        move: "Decline any unrequested “help” from someone in uniform inside a site. Keep hold of your phone. A small note ends most of these if you're stuck.",
      },
      {
        name: "Felucca and Nile boat overcharge",
        how: "A felucca captain quotes a per-hour price, then claims you agreed per person, or extends the trip and bills the extra time.",
        hack: "C",
        move: "Write the total price, duration and number of people on your phone and show the captain before boarding.",
      },
    ],
    faqs: [
      {
        q: "How much should I tip in Egypt?",
        a: "Small tips (5–20 EGP) are normal for genuine service — bathroom attendants, help with bags, a real explanation. What isn't normal is being blocked or followed for a tip after unrequested “help”; that's a scam, and a small note usually ends it.",
      },
      {
        q: "Is the camel ride at the Pyramids a scam?",
        a: "Not inherently, but the “it costs more to get down” version is common. Agree the full round-trip price before you mount, pay half up front and half at the gate, or book the ride through your hotel.",
      },
    ],
  },

  greece: {
    intro:
      "Greece is low-crime for visitors, but Athens has a persistent bar scam near Syntagma and the Plaka, and taxis from the airport and ports test whether you know the fixed fare.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "The Athens bar / “friendly local” scam",
        how: "One or two friendly men (often claiming to be tourists too) chat with you near Syntagma or Monastiraki and suggest a bar. Women join your table, expensive drinks are ordered for them, and a bill of hundreds of euros arrives with intimidation to pay.",
        hack: "C",
        move: "Don't let a new acquaintance choose the venue. If you're in it, refuse to pay for anything you didn't order, photograph the bill, and head for a busy street or a police officer.",
      },
      {
        name: "Airport and port taxi overcharge",
        how: "Drivers ignore the fixed €40 daytime fare from Athens airport to the centre (€55 at night), or at Piraeus quote a flat tourist price and run no meter.",
        hack: "A",
        move: "Confirm “fixed fare, forty euro” before getting in from the airport, or use the metro. In the city, insist on the meter (“taximetro”).",
      },
      {
        name: "Restaurant “fish by the kilo” and cover charges",
        how: "Seafront tavernas quote fresh fish per kilo without weighing it in front of you, or add bread, water and “service” that inflate a simple meal.",
        hack: "C",
        move: "Ask for the fish to be weighed and priced before it's cooked. Check whether bread and cover are itemised on the menu.",
      },
      {
        name: "Ferry ticket touts",
        how: "Near ports and on popular islands, people sell “last tickets” for sold-out ferries at a markup, or tickets for the wrong sailing.",
        hack: "H",
        move: "Buy from the official ferry company counter or a known site (ferryhopper, official lines). “Sold out” pressure on the street is the tell.",
      },
      {
        name: "“Free” shots and photos",
        how: "In tourist nightlife strips (Mykonos, Ios, Athens), staff hand you a “welcome” shot or a promoter takes a photo, then a charge appears on the bill.",
        hack: "C",
        move: "Ask “is this free?” before accepting anything, and check the bill against what you actually ordered.",
      },
    ],
    faqs: [
      {
        q: "What is the bar scam in Athens?",
        a: "Friendly strangers near Syntagma or Monastiraki invite you to a bar where women join your table, costly drinks are ordered, and you're pressured to pay a very large bill. The defence is simple: never go to a bar chosen by someone you just met.",
      },
      {
        q: "How much is a taxi from Athens airport to the centre?",
        a: "There is a fixed fare of €40 during the day and €55 at night to the city centre. Agree that figure before you get in, or take the metro, which runs directly from the airport.",
      },
    ],
  },

  vietnam: {
    intro:
      "Vietnam's scams are small and high-volume: rigged taxi meters, motorbike-rental damage claims, and bills that grow between the order and the payment. Ride apps and a bit of note-checking remove most of them.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Rigged taxi meters and fake companies",
        how: "Taxis at airports and tourist areas run meters that climb two to five times too fast, or use names and colours nearly identical to the reputable firms (Vinasun, Mai Linh).",
        hack: "H",
        move: "Use Grab or Xanh SM (the app fixes the price). If you must take a street taxi, only Vinasun or Mai Linh, and watch the meter against your map.",
      },
      {
        name: "Motorbike rental damage and passport hold",
        how: "You rent a scooter, leave your passport as deposit, and on return the shop finds “new” damage or claims the bike was stolen from where you parked, keeping the passport until you pay.",
        hack: "K",
        move: "Never leave your passport — pay a cash deposit. Film the bike in detail before riding, and use your own lock.",
      },
      {
        name: "Note confusion (20,000 vs 500,000 dong)",
        how: "Several Vietnamese notes are similar in colour. Drivers and vendors give change short, or claim you paid a 20k note when you paid 500k.",
        hack: "C",
        move: "Separate large notes into a different pocket. Count out payment slowly and say the amount; count change before moving off.",
      },
      {
        name: "“Practice my English” café bill",
        how: "A friendly student in Hanoi or Ho Chi Minh City wants to practise English, suggests a café or bar, and you end up covering an inflated bill — sometimes with “hostess” charges.",
        hack: "C",
        move: "Chat in a public place, not a venue they pick. If you go somewhere, choose it yourself and see prices first.",
      },
      {
        name: "Cyclo (xích lô) price after the ride",
        how: "A cyclo driver agrees a low price, then at the end insists it was per person, in dollars, or for a fraction of the distance actually covered.",
        hack: "H",
        move: "Write the price, currency and route on your phone and show the driver before starting. Agree it's the total.",
      },
      {
        name: "Shoeshine and coconut-seller grab",
        how: "A shoeshiner starts “repairing” your sandal uninvited, or a street seller puts their yoke and hat on your shoulder for a photo, then demands payment.",
        hack: "C",
        move: "Pull your foot back; don't let anyone put anything on you. No agreement, no payment — keep walking.",
      },
    ],
    faqs: [
      {
        q: "Are taxis in Vietnam safe?",
        a: "The reputable firms (Vinasun, Mai Linh) are fine, but many taxis run fast meters or imitate those brands. Grab and Xanh SM fix the fare in the app and are the simplest way to avoid the problem.",
      },
      {
        q: "Should I leave my passport to rent a motorbike in Vietnam?",
        a: "No. A held passport is leverage for an invented damage or “stolen bike” charge on return. Offer a cash deposit, film the bike before you ride, and use a lock.",
      },
    ],
  },

  indonesia: {
    intro:
      "In Bali, the recurring problems are money-changer sleight-of-hand, scooter-rental damage claims, and ATM issues. Elsewhere the pattern is similar. Authorised changers and app-booked rides cover most of it.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Money-changer short-count",
        how: "A changer offering a rate well above the others distracts you mid-count, folds notes back, or uses a rigged calculator, so you leave with far less than agreed.",
        hack: "C",
        move: "Only use changers marked “PT” / authorised, count the full amount yourself before handing over your dollars, and don't let them re-handle the stack.",
      },
      {
        name: "Scooter rental damage and passport hold",
        how: "The rental holds your passport, then on return points to scratches (often pre-existing) and charges a heavy “repair” fee, or claims the bike was stolen.",
        hack: "K",
        move: "Leave a cash deposit, not the passport. Photograph and film every panel before riding, with the owner present.",
      },
      {
        name: "ATM skimming and “card swallowed”",
        how: "Machines in Kuta, Seminyak and Canggu are skimmed, or a device holds your card and a “helpful” bystander watches you enter the PIN, retrieving the card after you leave.",
        hack: "C",
        move: "Use ATMs attached to a bank branch, in daylight. If a card is retained, call your bank immediately and stay at the machine.",
      },
      {
        name: "Taxi cartel vs. Grab/Gojek",
        how: "In some areas local taxi groups block or intimidate app drivers and charge tourists several times the app price, refusing meters.",
        hack: "A",
        move: "Book Grab or Gojek and meet the driver a short walk from the taxi rank if there's tension. Know the app price so you can judge a cash quote.",
      },
      {
        name: "“Your card was declined” double charge",
        how: "A shop or restaurant says the first card payment failed and runs it again; both go through, or a tip line is altered after you sign.",
        hack: "K",
        move: "Watch the terminal, keep every receipt, and check your statement daily. Dispute duplicates immediately.",
      },
      {
        name: "Gili Islands boat overcharge",
        how: "Touts sell “fast boat” tickets at inflated prices, oversell sailings, or the “insurance” and “port tax” add-ons appear at the dock.",
        hack: "H",
        move: "Book with an established operator online, confirm the total price includes taxes, and keep the booking confirmation on your phone.",
      },
    ],
    faqs: [
      {
        q: "How do I avoid being scammed by money changers in Bali?",
        a: "Use only authorised changers (they display “PT” and a licence), refuse ones with a rate far above the market, count your money fully before handing over your currency, and don't let the cashier re-touch the counted stack.",
      },
      {
        q: "Is it safe to rent a scooter in Bali?",
        a: "Yes, if you leave a cash deposit rather than your passport and film the bike's condition before riding. Passport-as-deposit is what enables the inflated damage claim on return.",
      },
    ],
  },

  morocco: {
    intro:
      "In Marrakesh and Fez, the medina scams revolve around navigation: unofficial “guides” who attach themselves to you, “this way is closed” redirects toward shops, and tanneries you didn't ask to visit. Firm politeness handles most of it.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Unofficial “guides” in the medina",
        how: "A young man offers directions or “just practising English”, walks with you through the souks, then demands a substantial fee, sometimes aggressively, when you arrive.",
        hack: "C",
        move: "Decline clearly and don't let anyone walk you anywhere. If one attaches anyway, stop, say “no guide, thank you” and step into a shop until they leave.",
      },
      {
        name: "“This street is closed / the square is that way”",
        how: "Someone tells you the route is blocked, there's a festival, or the tannery is only open now, and steers you to a relative's shop or a viewpoint that then demands a tip.",
        hack: "H",
        move: "Use your phone's map and trust it. Streets in the medina are rarely closed; the redirect is the scam.",
      },
      {
        name: "Henna grab",
        how: "Women in Jemaa el-Fnaa take your hand and start applying henna before you agree, then demand a large price for a design you didn't want (and the henna may be black “PPD”, which can burn).",
        hack: "K",
        move: "Keep your hands out of reach and don't stop. If it's started, pull away — you have no obligation to pay for an unrequested service.",
      },
      {
        name: "Taxi “no meter” and shared-taxi overcharge",
        how: "Petit taxis refuse the meter (“compteur”) and quote a flat tourist fare; grand taxis charge you for empty seats.",
        hack: "A",
        move: "Insist on the meter or agree the price before getting in. Know the rough local fare (short city trips are a few dirham).",
      },
      {
        name: "Photo fee in the square",
        how: "Snake charmers, monkey handlers and water sellers in Jemaa el-Fnaa pose or put an animal on you, then demand 100–200 dirham per person for photos.",
        hack: "H",
        move: "Agree a price out loud before any photo, or don't engage. If an animal's been put on you, hand over a small note and step back.",
      },
      {
        name: "Carpet and argan-oil hard sell",
        how: "Mint tea and hospitality precede a long, high-pressure sales session where leaving without buying is framed as an insult, and prices start at five to ten times fair value.",
        hack: "C",
        move: "It's fine to accept tea and still say no. Decide your ceiling before you enter, and be willing to walk out mid-pitch.",
      },
    ],
    faqs: [
      {
        q: "Do I need a guide in the Marrakesh medina?",
        a: "Not for wandering — your phone's map works. If you want a guide, hire a licensed one through your riad or a registered agency. The men who approach you in the street are unlicensed and will demand a large fee at the end.",
      },
      {
        q: "Is the henna in Jemaa el-Fnaa safe?",
        a: "Agree it in advance from a stall, and ask for natural (brown) henna, not black. Black “henna” often contains PPD dye, which can cause chemical burns and lasting scarring. Never let someone start on your hand uninvited.",
      },
    ],
  },

  india: {
    intro:
      "In Delhi, Agra and Jaipur, the scams target arrivals: “your hotel is closed” taxi redirects, fake tourist offices near the railway station, and the gem-export “business opportunity”. Pre-booked transport removes most of the risk.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "“Your hotel is closed / burned down”",
        how: "A prepaid-taxi or auto driver from Delhi airport or the railway station claims your hotel has closed, is full, or is in a “riot area”, and takes you to one that pays commission — often after a stop at a “travel agent”.",
        hack: "A",
        move: "Call your hotel to confirm it's open and ask them to speak to the driver. Insist on the booked address; refuse any “quick stop”.",
      },
      {
        name: "Fake tourist information offices",
        how: "Near New Delhi railway station and Connaught Place, offices labelled “Government Tourist Office” or “India Tourism” sell overpriced tours and train tickets and tell you the real booking office is closed or moved.",
        hack: "A",
        move: "The only official body is “Incredible India” / the Ministry of Tourism, and it doesn't sell tours. Book trains on IRCTC or its app.",
      },
      {
        name: "Gem / carpet “export business”",
        how: "A friendly contact in Jaipur or Agra offers a deal: buy gems or carpets, courier them home, and a “partner” abroad will resell them at a huge profit. The stones are near-worthless and the partner doesn't exist.",
        hack: "C",
        move: "There is no such opportunity. Never buy goods to “resell” on someone else's promise, and never let a shop courier a purchase for you.",
      },
      {
        name: "Auto-rickshaw “meter broken” and commission stops",
        how: "Drivers refuse the meter, quote a flat fare, or offer a cheap all-day rate then spend it driving you to shops that pay them per head.",
        hack: "H",
        move: "Use Uber or Ola. If you take an auto, agree the fare first and say “no shops” — a driver who detours anyway isn't taking you.",
      },
      {
        name: "Taj Mahal and monument “guides” and photo fees",
        how: "Unlicensed guides attach at the gate, “helpers” offer to take your photo from the “best spot” then demand payment, and sellers follow you with escalating prices.",
        hack: "H",
        move: "Book tickets online (asi.payumoney / official). Hire only ASI-licensed guides (they carry a photo ID card). Keep hold of your own phone.",
      },
      {
        name: "“Holi / temple blessing” then donation demand",
        how: "A priest or attendant ties a thread, offers a blessing or a bindi “for free”, then demands a large “donation” and names a figure.",
        hack: "C",
        move: "Decline the thread or blessing if you don't want to donate. If you've accepted, a small note is enough; ignore the named figure.",
      },
    ],
    faqs: [
      {
        q: "Is the 'your hotel is closed' scam common in India?",
        a: "Yes, especially on arrivals from Delhi airport and New Delhi railway station. A driver claims your hotel has shut or is unsafe and takes you to a commission-paying alternative. Phone your hotel to confirm and refuse any diversions.",
      },
      {
        q: "How do I book train tickets in India without being scammed?",
        a: "Use the official IRCTC website or app, or the counters inside the station. “Tourist offices” near the station that offer to book trains for you are not official and add large markups.",
      },
    ],
  },

  portugal: {
    intro:
      "Lisbon is a low-crime city where the main annoyances are tram-28 pickpockets, fake-drug sellers, and the couvert you didn't order arriving at dinner. Porto is quieter still.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Tram 28 and Santa Justa pickpockets",
        how: "Lisbon's tourist tram 28 and the queues at popular viewpoints are worked by pickpocket teams, one crowding, one lifting, especially as the tram fills and at stops.",
        hack: "C",
        move: "Keep bags zipped and in front, phone in a front pocket. Be most alert exactly when the tram is packed and when boarding.",
      },
      {
        name: "“Hashish? Cocaine?” street sellers",
        how: "Men on Rua Augusta and around Bair­ro Alto offer drugs loudly; what they sell is fake (herbs, crushed aspirin). It's a rip-off, and buying draws police attention.",
        hack: "K",
        move: "A firm “no” and keep walking. The product is fake and the interaction goes nowhere good.",
      },
      {
        name: "Restaurant couvert",
        how: "Bread, olives, cheese or sardine pâté arrive unasked at the start of a meal and appear on the bill. This is legal in Portugal if it's on the menu — but tourist spots lean on it.",
        hack: "C",
        move: "You can decline it (“não, obrigado”) and send it back untouched. Check the menu for the couvert price so it's not a surprise.",
      },
      {
        name: "Airport taxi long route",
        how: "From Lisbon airport, some drivers take a long route or add unofficial “luggage” and “night” surcharges beyond the small legal ones.",
        hack: "A",
        move: "Use the metro (red line) or Bolt/Uber, or take a taxi from the official rank and watch the route on your map. Legit surcharges are a couple of euros.",
      },
      {
        name: "Holiday-let listing fraud",
        how: "A cheap central apartment asks for a deposit or full payment by transfer or gift card before you can see it or get a key code.",
        hack: "K",
        move: "Book through a platform that holds the money until check-in. No transfer, no crypto, no gift cards for accommodation.",
      },
    ],
    faqs: [
      {
        q: "Do I have to pay for the bread and olives in a Portuguese restaurant?",
        a: "Only if you eat them. The couvert is legal when listed on the menu, but you can decline it and return it untouched without charge. Check the menu price so it isn't a surprise on the bill.",
      },
      {
        q: "Is Lisbon safe for tourists?",
        a: "Very, in terms of violent crime. The realistic risks are pickpocketing on tram 28 and at viewpoints, and fake-drug hustlers downtown — both avoidable with basic bag awareness and a firm no.",
      },
    ],
  },

  "united-kingdom": {
    intro:
      "London's tourist-area scams are mostly street games and moped phone-snatching, plus a long-running fake black-cab problem. The rigged card machine and the “charity” muggers on Oxford Street round it out.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Three-card monte / “find the lady”",
        how: "On Westminster Bridge, near the London Eye and along Oxford Street, a fast card or cup game runs with planted winners. You can't win, and the crowd around it includes pickpockets.",
        hack: "H",
        move: "Don't play and don't stop to watch. The entire setup — dealer, lookouts, “winners”, spectators — is one team.",
      },
      {
        name: "Moped and bike phone snatching",
        how: "Riders mount the pavement and grab phones from people using them near the kerb, especially around Camden, Shoreditch, Kensington and along the South Bank.",
        hack: "K",
        move: "Don't stand near the road holding your phone. Step back against a building to check the map, and keep it in a zipped pocket while walking.",
      },
      {
        name: "Fake and unbooked minicabs",
        how: "Cars outside stations, clubs and airports offer “taxi?” — they're uninsured, meterless and overcharge, and some are unsafe. Only black cabs pick up on the street legally.",
        hack: "A",
        move: "Use a black cab (hailed or ranked), or a pre-booked licensed minicab through an app. Never get in a car that approached you.",
      },
      {
        name: "Oxford Street “charity” collectors",
        how: "Aggressive collectors with tabards and clipboards or buckets pressure tourists for cash “donations” or card sign-ups; some are outright fake, others keep most of what they collect.",
        hack: "C",
        move: "Genuine charities don't chase or guilt you. Keep walking; give to a registered charity directly if you want to.",
      },
      {
        name: "Contactless card machine held too close",
        how: "A seller or fake collector holds a card reader against your bag or pocket to trigger a contactless payment, or overcharges then rushes you past the amount on screen.",
        hack: "K",
        move: "Always look at the figure on the screen before tapping. Keep cards in an RFID sleeve or away from the outside of your bag.",
      },
      {
        name: "Ticket resale fraud",
        how: "“Spare ticket” sellers outside West End theatres, football grounds and concerts sell fakes, duplicates or nothing at all after taking cash.",
        hack: "H",
        move: "Buy from the official box office or the venue's named resale partner. A ticket bought on the pavement is a gamble.",
      },
    ],
    faqs: [
      {
        q: "Are black cabs in London safe?",
        a: "Yes — licensed black cabs are the one type of vehicle allowed to pick you up off the street. Any other car offering a ride, especially at stations or airports, is unbooked and should be refused. Pre-book minicabs through an app.",
      },
      {
        q: "How common is phone snatching in London?",
        a: "Common enough that it's a recognised problem in central and east London. Thieves on mopeds or bikes grab phones from people standing near the road. Check your map with your back to a wall and pocket the phone before walking.",
      },
    ],
  },

  "united-states": {
    intro:
      "For visitors, the US risks are costumed characters demanding money in tourist squares, unlicensed “rides” at airports, aggressive timeshare and “free cruise” pitches, and toll and resort-fee surprises on the bill.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Times Square / Hollywood costumed characters",
        how: "People dressed as superheroes, Elmo or the Statue of Liberty pose with tourists (especially kids), then demand $20–40 per person and can get intimidating when refused.",
        hack: "H",
        move: "Agree a price out loud before any photo, or don't engage. If they've posed, hand over a couple of dollars total and move on.",
      },
      {
        name: "Unlicensed airport “rides”",
        how: "At JFK, LAX, Miami and Vegas, men in the arrivals hall offer a “taxi” or “town car” and charge two to four times the metered or app fare, sometimes with add-ons at the destination.",
        hack: "A",
        move: "Ignore anyone offering a ride indoors. Use the official taxi line or an app pickup from the marked rideshare zone.",
      },
      {
        name: "“You've won a free cruise / vacation”",
        how: "A booth, phone call or scratch-card says you've won a Bahamas cruise or resort stay; claiming it means a long timeshare presentation, booking fees, and a package worth far less than promised.",
        hack: "C",
        move: "You didn't enter, so you didn't win. Walk away from the booth; hang up on the call.",
      },
      {
        name: "CD / mixtape hand-off",
        how: "Someone puts a CD in your hand, asks your name, writes it on the case “as a gift”, then demands $10–20 and follows you, working in pairs near Times Square and Venice Beach.",
        hack: "C",
        move: "Keep your hands down and don't take it. If it's in your hand, set it down and keep walking — a “gift” with a price isn't a gift.",
      },
      {
        name: "Resort fees and hidden car-rental charges",
        how: "Hotels advertise a nightly rate then add a mandatory “resort fee” of $30–50 at check-in; rental counters push prepaid fuel, tolls transponders and insurance you may already have.",
        hack: "A",
        move: "Check the total with taxes and fees before booking. At the car counter, decline extras and say you'll use your own insurance and pay tolls directly.",
      },
      {
        name: "Grandparent / IRS / arrest-warrant phone scams",
        how: "Callers claim to be a grandchild in jail, the IRS, or police with a warrant, and demand payment by gift card, wire or crypto to avoid arrest. Numbers are spoofed to look official.",
        hack: "A",
        move: "No real agency takes gift cards. Hang up, and call the person or agency back on a number you look up yourself.",
      },
    ],
    faqs: [
      {
        q: "Do I have to pay the costumed characters in Times Square?",
        a: "No. They rely on people feeling obligated after a photo, especially with children. Agree a price before any photo or simply decline. If one has already posed, a couple of dollars ends it.",
      },
      {
        q: "What is a resort fee?",
        a: "A mandatory daily charge (often $30–50) that many US hotels add on top of the advertised room rate, supposedly for wifi, gym and pool. It's disclosed in the fine print — always check the all-in total before booking.",
      },
    ],
  },

  "united-arab-emirates": {
    intro:
      "Dubai and Abu Dhabi are low-crime, but the money traps are real: taxis dodging the meter, gold-souk fakes, rental-car fines that surface weeks later, and hard-sell holiday clubs in the malls.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi meter refusal and airport queue-jumping",
        how: "Some drivers quote a flat fare instead of the meter, particularly from the airport, Dubai Mall and the Marina, or “helpers” steer you to a waiting car outside the official rank at a premium.",
        hack: "A",
        move: "Only take taxis from the official rank and insist on the meter (“meter, please”). Careem and Uber fix the price if you'd rather not negotiate.",
      },
      {
        name: "Gold and watch “souk” fakes",
        how: "In the Deira gold souk and around it, sellers offer “special price” gold that's underweight or low-carat, and “genuine” branded watches and bags that are counterfeit.",
        hack: "C",
        move: "Buy gold only from shops that weigh it in front of you and give a stamped receipt with the carat and the day's gold rate. If the price seems generous, it's the scam.",
      },
      {
        name: "Rental-car fines weeks later",
        how: "Salik toll charges, speeding fines and parking tickets are billed to the rental company and passed to your card, often with an admin fee, long after you've left the country.",
        hack: "K",
        move: "Photograph the odometer and fuel at pickup and drop-off, keep the contract, and check your statement for a month afterward. Query any charge without a matching fine reference.",
      },
      {
        name: "Mall “holiday club” and prize scratchcards",
        how: "Kiosks in malls hand out scratchcards that always “win” a holiday or gadget; claiming it means a 90-minute timeshare-style presentation and pressure to sign a membership that day.",
        hack: "H",
        move: "Don't take the scratchcard. If you're in the room, no genuine offer expires the moment you leave to think about it.",
      },
      {
        name: "Creek abra and desert-safari touts",
        how: "Unlicensed operators near Dubai Creek or outside hotels sell “private” abra crossings or desert safaris at inflated prices, sometimes with no insurance or a much shorter trip than described.",
        hack: "C",
        move: "Use the marked public abra stations (a crossing is 1 dirham) and book safaris through your hotel or a licensed operator with reviews.",
      },
    ],
    faqs: [
      {
        q: "Are taxis in Dubai safe and metered?",
        a: "Official RTA taxis are safe and metered. The issue is occasional drivers quoting a flat fare instead — insist on the meter, or use Careem or Uber. Only take taxis from official ranks, not cars that approach you.",
      },
      {
        q: "Will I get fined after returning a rental car in the UAE?",
        a: "Possibly. Salik tolls and traffic fines are billed to the rental firm and charged to your card later, sometimes with an admin fee. Keep the contract and photos, and check your statement for a few weeks after the trip.",
      },
    ],
  },

  japan: {
    intro:
      "Japan is one of the safest countries for visitors, and street scams are rare. The exception is the nightlife touts in Tokyo's Kabukicho and Roppongi, where inflated bills and, occasionally, spiked drinks are a genuine risk.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Kabukicho / Roppongi bar touts",
        how: "African or Japanese touts on the street invite you to a “bar” or “club” with cheap drinks and company. Inside, drinks are billed at extreme rates, cover and “seating” charges appear, and staff pressure or block you until you pay — cards are sometimes run for thousands.",
        hack: "K",
        move: "Never follow a street tout into a bar in Kabukicho or Roppongi. Choose your own venue with visible prices. If trapped, insist on paying only for what you ordered and, if needed, call 110 (police).",
      },
      {
        name: "Drink spiking in tout bars",
        how: "In the same nightlife areas, some establishments spike drinks so patrons run up or authorise large payments they don't remember, or wake up with money and cards gone.",
        hack: "K",
        move: "Only drink somewhere you chose and can see the bar. Watch your drink being made and never leave it unattended.",
      },
      {
        name: "“Monk” selling bracelets or blessings",
        how: "People dressed as Buddhist monks near tourist spots in Tokyo and Kyoto offer a bracelet or a “blessing” card and then press for a donation of several thousand yen.",
        hack: "C",
        move: "Real monks don't solicit on the street. Decline the item; if you've taken it, hand it back and walk.",
      },
      {
        name: "Taxi long routes from stations",
        how: "A small number of taxi drivers take a longer route from major stations or airports when they spot a tourist who doesn't know the city.",
        hack: "C",
        move: "Show the driver the destination on a map and glance at your own route. Trains and the fixed-fare airport limousine buses avoid it entirely.",
      },
    ],
    faqs: [
      {
        q: "Is Japan safe for tourists?",
        a: "Extremely. Petty crime and street scams are rare. The one real trap is the nightlife touts in Tokyo's Kabukicho and Roppongi — never follow one into a bar. Everywhere else, normal caution is more than enough.",
      },
      {
        q: "What are the touts in Kabukicho?",
        a: "Men on the street inviting you to bars or clubs with cheap-drink promises. The venues then charge extreme prices, add invented fees, and pressure or trap you into paying. Spiked drinks and forced card payments have both been reported. Pick your own bar with prices on display.",
      },
    ],
  },

  brazil: {
    intro:
      "In Rio and São Paulo the day-to-day risk for visitors is street robbery and distraction theft, not elaborate cons. Card cloning, fake police and “express kidnapping” from unbooked taxis are the ones to plan around.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Beach and street distraction theft",
        how: "On Copacabana and Ipanema, a group crowds you, a “vendor” blocks your view, or someone points out a stain on your clothes while a partner takes your phone or bag.",
        hack: "C",
        move: "Take almost nothing to the beach — a little cash, a cheap phone. If people crowd you anywhere, put a hand on your bag and move to open space.",
      },
      {
        name: "Express kidnapping from unbooked taxis",
        how: "A street-hailed or fake taxi drives you to a series of ATMs and forces withdrawals up to the daily limit over several hours, sometimes over two days to reset the limit.",
        hack: "K",
        move: "Only use apps (Uber, 99) or radio taxis booked by your hotel. Never flag a taxi on the street, especially at night or from the airport.",
      },
      {
        name: "Card cloning and the “declined” re-swipe",
        how: "A shop, bar or restaurant runs your card out of sight, swipes it twice claiming the first failed, or a skimmed ATM copies it for later use.",
        hack: "K",
        move: "Keep the card in view and insist it's tapped or inserted in front of you. Use ATMs inside bank branches in daylight, and check your statement daily.",
      },
      {
        name: "Fake police document check",
        how: "Men claiming to be police stop you, ask for your passport and wallet to “check for counterfeit notes or drugs”, and remove cash or cards during the search.",
        hack: "A",
        move: "Real officers won't handle your cash in the street. Offer to walk to a station, keep your wallet in your pocket, and don't hand over the original passport (carry a copy).",
      },
      {
        name: "Nightlife bill inflation in Lapa",
        how: "In Rio's Lapa, a “consumption card” system means every drink is marked on a card; lost or altered cards, and “minimum spend” claims at the door, produce a huge bill on the way out.",
        hack: "K",
        move: "Guard the consumption card like cash, check each drink is marked correctly, and photograph it. Ask about any minimum spend before entering.",
      },
    ],
    faqs: [
      {
        q: "How do I avoid express kidnapping in Brazil?",
        a: "Never hail a taxi on the street. Use Uber or 99, or a radio taxi your hotel books. Most express kidnappings start with an unbooked or fake taxi, particularly at night and from airports.",
      },
      {
        q: "Is it safe to use my card in Brazil?",
        a: "Yes, if you keep it in sight — insist on tap or chip-and-PIN in front of you, never let it be taken away, and use ATMs inside bank branches. Card cloning and double-swiping are the main risks. Check your statement every day.",
      },
    ],
  },

  colombia: {
    intro:
      "Cartagena, Medellín and Bogotá are far safer for visitors than a decade ago, but two things need planning around: unbooked taxis (robbery and “paseo millonario”) and drink or contact drugging, including scopolamine.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Paseo millonario (unbooked-taxi robbery)",
        how: "A street-hailed taxi picks up accomplices and drives you between ATMs forcing withdrawals, sometimes holding you overnight to reset the daily limit.",
        hack: "K",
        move: "Only use apps (Uber, DiDi, Cabify) or a taxi your hotel calls. Never flag one down, and share your trip with someone.",
      },
      {
        name: "Scopolamine (“devil's breath”) drugging",
        how: "A drink, a handed cigarette, a “sample” of perfume, or even a business card blown toward your face is used to dose you; victims become compliant and later can't remember handing over cash, cards and phones. Often via a friendly new acquaintance, sometimes on dating apps.",
        hack: "C",
        move: "Don't accept drinks, food, gum, cigarettes or anything to smell from someone you've just met. Meet dating-app matches in daylight in a public place and tell someone where you are.",
      },
      {
        name: "Fake police “drug or currency check”",
        how: "Men in plain clothes flash a badge, claim to be anti-narcotics police, and search your wallet and bag for “fake dollars”, palming cash and cards.",
        hack: "A",
        move: "Real police won't inspect your money in the street. Say you'll go to the station, keep your wallet, and call 123 to verify.",
      },
      {
        name: "Emerald and coffee “investment”",
        how: "In Bogotá, a friendly contact offers cheap emeralds to resell abroad, or a “direct from the farm” coffee deal requiring upfront payment. The goods are near-worthless or never arrive.",
        hack: "C",
        move: "There is no resale opportunity. Never buy goods to flip on someone's promise, and never prepay a stranger.",
      },
      {
        name: "Currency short-change and torn notes",
        how: "Vendors and drivers give change short, pass torn or old notes that shops won't accept, or exploit confusion between 20,000 and 50,000 peso notes.",
        hack: "C",
        move: "Count change before moving off, refuse damaged notes, and pay with smaller denominations where you can.",
      },
    ],
    faqs: [
      {
        q: "What is scopolamine and how do tourists get dosed?",
        a: "A drug that makes victims compliant and wipes their memory of the event. In Colombia it's slipped into drinks or food, handed on a cigarette, or offered as something to smell. It often comes via a friendly new acquaintance or a dating-app match. Refuse anything consumable from someone you've just met.",
      },
      {
        q: "Are taxis safe in Colombia?",
        a: "Use apps (Uber, DiDi, Cabify) or have your hotel call one. Street-hailed taxis carry a real risk of the 'paseo millonario' — being driven between ATMs and forced to withdraw cash. Booked rides remove almost all of it.",
      },
    ],
  },

  peru: {
    intro:
      "Lima and Cusco run on tourism, and the scams follow: fake taxis from the airport, “brake check” strangle-robberies in traffic, inflated Inca Trail operators, and the usual card and change tricks.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Fake airport taxis",
        how: "Drivers inside Lima's arrivals hall offer rides at three to five times the fair price, and a few take detours to quiet areas for robbery.",
        hack: "A",
        move: "Book an official airport taxi at the counters past customs (Green Taxi, Taxi Directo) or an app pickup. Don't take a car from someone who approached you.",
      },
      {
        name: "“Brake check” / choke robbery in traffic",
        how: "In slow Lima traffic, someone reaches through an open window, or an accomplice “taps” your taxi from behind so you stop, then robs you.",
        hack: "K",
        move: "Ride with windows up and doors locked, bag on the floor not the seat, phone away. Choose app rides over street taxis.",
      },
      {
        name: "Inca Trail and Machu Picchu operator scams",
        how: "Cheap “Inca Trail” tours sold on Cusco streets may have no permit (the trail is strictly limited), substitute a different route, or collect deposits and vanish.",
        hack: "H",
        move: "Book months ahead with a licensed operator listed by the Peruvian authorities. A same-week Inca Trail offer on the street is not real.",
      },
      {
        name: "Currency: fake notes and the “no change” switch",
        how: "You're given a counterfeit sol or dollar note in change, or a vendor claims no change and keeps a large note, or swaps your good note for a torn one.",
        hack: "C",
        move: "Check notes for the watermark and feel, carry small denominations, and count change before walking away.",
      },
      {
        name: "Cusco “free” street gifts and blessings",
        how: "Women in traditional dress pose for photos or put a baby llama in your arms, then demand payment; “healers” offer a blessing and then a price.",
        hack: "H",
        move: "Agree a small price before any photo, or decline. Don't let anyone hand you an animal or an item first.",
      },
    ],
    faqs: [
      {
        q: "How do I get from Lima airport safely?",
        a: "Book an official taxi at the licensed counters inside the terminal (past customs), or arrange an app pickup or a hotel transfer. Do not take a ride from anyone who approaches you in the arrivals hall.",
      },
      {
        q: "Can I book the Inca Trail last minute?",
        a: "No. Permits are capped and typically sell out months ahead, and only licensed operators can run it. Anyone selling an Inca Trail trek for next week on a Cusco street is offering a different route or a scam.",
      },
    ],
  },

  "south-africa": {
    intro:
      "Cape Town and Johannesburg require real situational awareness. For visitors the recurring scams are ATM card-swapping, fake “police”, and the “your tyre is flat” distraction robbery — alongside smash-and-grab at traffic lights.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "ATM “helper” card swap",
        how: "As you use an ATM, a friendly stranger says the machine is faulty or offers to help, distracts you, and swaps your card for a similar one — draining the account with the PIN they watched you enter.",
        hack: "C",
        move: "Refuse all help at an ATM. If the machine keeps your card, don't leave — call your bank from the spot and cancel the card.",
      },
      {
        name: "“Your tyre is flat / you're leaking oil”",
        how: "In a car park or at a light, someone points at your car; when you get out to look, an accomplice takes bags from the vehicle. Sometimes the tyre was deflated moments earlier.",
        hack: "H",
        move: "Drive to a busy petrol station before inspecting anything. Keep doors locked and bags out of sight in the footwell.",
      },
      {
        name: "Fake police roadblock or “document check”",
        how: "People in partial uniform stop tourists, demand to see a passport and wallet, allege a fine, and take cash — or an accomplice robs the car during the “check”.",
        hack: "A",
        move: "Real roadblocks are marked and staffed by several officers. Keep windows up, ask for ID through the glass, and drive to the nearest police station if unsure.",
      },
      {
        name: "Smash-and-grab at traffic lights",
        how: "At certain intersections in Joburg and Cape Town, a window is broken and a bag or phone grabbed while you wait at a red light, especially after dark.",
        hack: "K",
        move: "Keep valuables in the boot or footwell, leave a car's length gap to the vehicle ahead so you can pull away, and avoid known hotspot routes at night.",
      },
      {
        name: "Table Mountain / tourist-site “guides” and parking",
        how: "Unofficial “car guards” or “guides” demand payment for parking you'd have got free, or attach themselves on a trail and ask for a fee.",
        hack: "C",
        move: "Tip official (bibbed, registered) car guards a few rand if you wish; ignore anyone else. Decline unrequested trail company.",
      },
    ],
    faqs: [
      {
        q: "Are ATMs safe to use in South Africa?",
        a: "Use ATMs inside a bank or a busy shopping centre during the day, and refuse any offer of help — the card-swap scam depends on distracting you at the machine. If your card is retained, phone the bank immediately without leaving.",
      },
      {
        q: "What should I do if someone says my tyre is flat?",
        a: "Don't stop and get out where you are. Drive to a busy, well-lit petrol station and check there. The 'flat tyre' and 'oil leak' tip-offs are a standard distraction for taking bags from the car.",
      },
    ],
  },

  czechia: {
    intro:
      "Prague's Old Town has a cluster of tourist scams: terrible-rate currency booths, taxi drivers who forget the tariff, restaurants that pad the bill, and the strip-club “drink” trap near Wenceslas Square.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Currency-exchange booths with hidden rates",
        how: "Booths near the Old Town Square and Charles Bridge advertise a great rate in huge numbers that turns out to be the “sell” rate or applies only above a large amount, with a fee that leaves you 20–30% down.",
        hack: "C",
        move: "Use an ATM from a major bank, or an exchange that shows the exact amount you'll receive before you commit. Czech law lets you cancel an exchange within a few hours — keep the receipt.",
      },
      {
        name: "Taxi overcharging",
        how: "Drivers waiting outside stations, the airport and tourist sights use a rigged meter or a flat “tourist” price several times the real fare.",
        hack: "H",
        move: "Use Bolt or Uber, or ask a restaurant to call a reputable firm. The airport-to-centre fare is roughly 600–800 CZK; anything near 1,500 is a rip-off.",
      },
      {
        name: "Restaurant bill padding",
        how: "Old Town restaurants add unrequested bread and “couvert”, charge for tap water as if bottled, apply a “tourist menu” price, or add a large tip line already filled in.",
        hack: "C",
        move: "Check the menu prices, refuse anything you didn't order, and review the bill line by line before paying. A service charge, if any, must be shown.",
      },
      {
        name: "Strip-club / “nice bar” drink trap",
        how: "Men near Wenceslas Square and Old Town hand out flyers or invite you to a bar or club; drinks for you and the “hostess” are billed at absurd rates and security blocks the door until you pay.",
        hack: "K",
        move: "Bin the flyer, decline the invitation. If you're inside, pay only for your own drinks, photograph the menu, and leave toward a main street.",
      },
      {
        name: "Charles Bridge shell game and “police”",
        how: "A three-cup game runs with planted winners and pickpockets in the crowd; separately, fake “police” ask tourists for ID and check wallets for “counterfeit notes”.",
        hack: "H",
        move: "Never watch or play the game. For an ID check, ask for a uniformed officer and offer to walk to a station; keep your wallet pocketed.",
      },
    ],
    faqs: [
      {
        q: "Where should I change money in Prague?",
        a: "At a bank ATM, or an exchange office that shows the exact koruna amount you'll receive before you agree. Avoid the booths near the Old Town Square and Charles Bridge — their headline rates are misleading. By law you can reverse an exchange within a few hours if you keep the receipt.",
      },
      {
        q: "How much is a taxi from Prague airport to the centre?",
        a: "Roughly 600–800 CZK in a reputable taxi, or less with Bolt or Uber. Drivers quoting 1,200–1,500+ are overcharging. Book an app or ask your hotel to arrange a car.",
      },
    ],
  },

  netherlands: {
    intro:
      "Amsterdam's scams are low-stakes: fake drugs sold on the street, bike-rental damage claims, and pickpockets in the crowds around the centre and on trams. Violent crime against tourists is rare.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Fake “cocaine” and pills on the street",
        how: "Dealers around the Red Light District and Leidseplein sell white powder or pills that are fake (or dangerous research chemicals). It's a rip-off, and buying is an offence.",
        hack: "K",
        move: "Ignore street offers entirely. The product is not what's claimed.",
      },
      {
        name: "Bike-rental damage and lock scams",
        how: "A rental shop charges a heavy fee for “damage” or a “stolen” bike on return, or provides a weak lock so the bike is easily taken and you're billed.",
        hack: "K",
        move: "Photograph the bike and both locks before riding. Always use both locks through the frame to a fixed object, and keep the rental agreement.",
      },
      {
        name: "Pickpockets on trams and in Dam Square crowds",
        how: "Teams work tram 2 and 5, Centraal Station, and dense crowds around Dam Square and the flower market, one bumping, one lifting.",
        hack: "C",
        move: "Bag zipped and in front, phone in a front pocket. Be most alert boarding trams and in any sudden press of people.",
      },
      {
        name: "“Friendly” photo helper",
        how: "Someone offers to take your photo in front of a canal or the I-amsterdam sign area and walks off with the phone, or a partner lifts your bag while you pose.",
        hack: "C",
        move: "Ask another obvious tourist, or use a short tripod. Keep your bag on your body while posing.",
      },
      {
        name: "Restaurant and “coffeeshop” overcharging",
        how: "A few tourist-strip venues run a “tourist” menu, add service that isn't standard in the Netherlands, or sell low-grade product at premium prices.",
        hack: "C",
        move: "Check prices before ordering; tipping is modest here and service is usually included. Reputable coffeeshops display a menu with weights and prices.",
      },
    ],
    faqs: [
      {
        q: "Is Amsterdam safe for tourists?",
        a: "Yes. Violent crime against visitors is uncommon. The realistic risks are pickpocketing in the busy central area and on trams, fake drugs sold on the street, and bike-rental disputes — all low-stakes and avoidable.",
      },
      {
        q: "How do I avoid a bike-rental dispute in Amsterdam?",
        a: "Photograph the bike and its locks before you ride off, use both supplied locks through the frame to something fixed every time you park, and keep the rental agreement. Damage and 'theft' fees are the main rental complaint.",
      },
    ],
  },

  argentina: {
    intro:
      "In Buenos Aires the classic scams are the mustard (or ketchup) distraction, counterfeit notes in change or from unofficial money changers, and taxis that take long routes or switch your note.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "The mustard / bird-mess distraction",
        how: "A substance is squirted or dropped on your back or shoulder; a helpful passer-by appears with tissues to clean you up, and while you're distracted your bag, phone or wallet is taken.",
        hack: "C",
        move: "If something lands on you, don't stop and don't let anyone “help”. Hold your bag, walk to a shop or café, and clean up there.",
      },
      {
        name: "Counterfeit pesos in change and from “arbolitos”",
        how: "Street money changers (“arbolitos”) offering the blue-dollar rate, and some shops and taxis, pass fake 1,000 and 2,000 peso notes in change.",
        hack: "C",
        move: "Change money at a bank or an established casa de cambio. Learn the security features of the big notes, and check change under a light before moving off.",
      },
      {
        name: "Taxi note-switch and long routes",
        how: "You pay with a 2,000 peso note; the driver palms it and shows a 200, claiming you underpaid. Or the meter is on the wrong tariff, or the route loops.",
        hack: "H",
        move: "State the note's value out loud as you hand it over. Use the Cabify or Uber app, or radio taxis, and watch your route on a map.",
      },
      {
        name: "“Flat tyre” at a stop light",
        how: "Someone points at your car or taxi tyre; when the driver or you step out, an accomplice takes bags from inside.",
        hack: "H",
        move: "Don't stop where you are. Continue to a petrol station and check there, doors locked.",
      },
      {
        name: "Fake police document check",
        how: "Plain-clothes “officers” ask for your passport and wallet to check for fake dollars or drugs, removing cash during the search.",
        hack: "A",
        move: "Real police don't inspect your cash in the street. Offer to go to a station, keep your wallet, and carry a passport copy rather than the original.",
      },
    ],
    faqs: [
      {
        q: "Should I use street money changers in Buenos Aires?",
        a: "They offer a better rate, but counterfeit notes are a real risk. If you do use one, only via a trusted recommendation, count and check every note, and never in a quiet street. Banks and established casas de cambio are safer.",
      },
      {
        q: "What is the mustard scam?",
        a: "Someone covertly squirts a sauce or fake bird-mess onto you, then a 'kind stranger' offers to help clean it while an accomplice steals your bag. If anything lands on you in a tourist area, keep moving and don't accept help.",
      },
    ],
  },

  croatia: {
    intro:
      "Croatia is a safe, low-crime destination. The friction points are taxi overcharging in Split and Dubrovnik, restaurants near the old towns padding the bill, and boat-tour touts overselling day trips.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi overcharging in Split and Dubrovnik",
        how: "Drivers outside the old-town gates, ferry ports and airports skip the meter and quote flat tourist fares two to three times higher than an app ride.",
        hack: "H",
        move: "Use Uber or Bolt (both work well in the tourist cities), or agree the fare in writing before getting in.",
      },
      {
        name: "Restaurant bill padding near the old towns",
        how: "Konoba and restaurants just inside the walls bring unrequested bread, olive oil or fish plates, charge 'cover' or 'music', or quote fish per kilo without weighing it in front of you.",
        hack: "C",
        move: "Ask the price of the fish and any couvert before ordering; refuse and return anything you didn't ask for; check the bill line by line.",
      },
      {
        name: "Boat-tour and 'Blue Cave' touts",
        how: "Sellers on the Split and Hvar waterfronts push day trips at inflated prices, oversell boats so you're crammed on, or the 'skip the queue' at the Blue Cave turns out to be the same wait.",
        hack: "H",
        move: "Book with an established operator with reviews, confirm the group size and what's included, and be sceptical of 'last two spots' pressure.",
      },
      {
        name: "Apartment / 'sobe' deposit fraud",
        how: "A cheap central apartment or room asks for a deposit or full payment by bank transfer before arrival; the place doesn't exist or isn't the host's.",
        hack: "K",
        move: "Book through a platform that holds the payment until check-in. No transfer or crypto for an unseen room.",
      },
      {
        name: "Parking and ZTL fines",
        how: "Confusing zones in old towns mean fines for parking or driving where you shouldn't; rental companies pass these on later with an admin fee.",
        hack: "K",
        move: "Park in a marked public car park outside the walls and walk in. Photograph any signs you're unsure about.",
      },
    ],
    faqs: [
      {
        q: "Are taxis expensive in Dubrovnik?",
        a: "Metered taxis are reasonable; the problem is drivers near the old town and the port quoting high flat fares instead. Uber and Bolt both operate in Dubrovnik and Split and are the simplest fix.",
      },
      {
        q: "Do Croatian restaurants add hidden charges?",
        a: "Tourist-strip places sometimes add couvert, 'music' or unrequested starters, and price fish per kilo. Ask about any cover charge and the fish price before ordering, and send back anything you didn't request.",
      },
    ],
  },

  "south-korea": {
    intro:
      "South Korea is very safe and largely scam-free for tourists. The rare issues are bar 'juicy' scams in Itaewon and Hongdae, taxi refusals or long routes late at night, and counterfeit goods in Myeongdong.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "'Juicy bar' / hostess bar trap",
        how: "A tout near Itaewon or Hongdae invites you to a bar; women join your table, expensive drinks are ordered for them, and a bill of several hundred dollars arrives with staff blocking the exit.",
        hack: "K",
        move: "Never follow a street invitation into a bar. If trapped, pay only for what you ordered, photograph the menu, and head for a busy street or call 112.",
      },
      {
        name: "Taxi refusal and late-night long routes",
        how: "Some drivers refuse short fares, wave you off, or take longer routes for tourists at night when demand is high.",
        hack: "C",
        move: "Use the Kakao T app to book and fix the route. It's dominant in Korea and removes the negotiation.",
      },
      {
        name: "Counterfeit cosmetics and goods in Myeongdong",
        how: "Street stalls and some shops sell fake branded skincare, perfume and accessories as genuine at 'discount' prices.",
        hack: "C",
        move: "Buy branded cosmetics from the brand's own store, Olive Young, or a department store. A big discount on a sealed 'genuine' product is the tell.",
      },
      {
        name: "Fortune-teller / 'free' temple blessing upsell",
        how: "Near palaces and temples, someone offers a 'free' reading or blessing, then names a large fee for the 'full' version or a lucky charm.",
        hack: "C",
        move: "Decline politely and keep walking. There's no obligation and no 'bad luck' for saying no.",
      },
    ],
    faqs: [
      {
        q: "Is Seoul safe at night for tourists?",
        a: "Yes, very. Violent crime against visitors is rare and the metro and streets are busy late. The main thing to avoid is following a tout into a bar in Itaewon or Hongdae, where inflated 'hostess' bills are the known trap.",
      },
      {
        q: "How should I get taxis in South Korea?",
        a: "Use the Kakao T app. It's the standard here, fixes the fare and route, and sidesteps the occasional driver who refuses a short trip or takes a long way round at night.",
      },
    ],
  },

  cambodia: {
    intro:
      "In Siem Reap and Phnom Penh the recurring issues are tuk-tuk and taxi price disputes, motorbike-rental damage claims, torn-note refusals, and aggressive begging organised around tourists.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Tuk-tuk 'agreed' price changes at the end",
        how: "A driver agrees a low fare, then at the destination insists it was per person, in dollars not riel, or only for part of the trip, sometimes with a friend backing him up.",
        hack: "H",
        move: "Use the Grab or PassApp apps (both work in Cambodia) so the price is fixed. If you agree cash, write the total, the currency and the route on your phone and show the driver.",
      },
      {
        name: "Motorbike rental damage and passport hold",
        how: "The shop keeps your passport, then finds 'new' damage on return or claims the bike was stolen, holding the document until you pay. Note: driving a motorbike as a tourist is also often technically not permitted.",
        hack: "K",
        move: "Leave a cash deposit, not the passport. Photograph and film the bike before riding. Consider hiring a driver instead.",
      },
      {
        name: "Torn or old US notes refused",
        how: "Cambodia uses US dollars alongside riel, but shops and drivers refuse any note with a small tear or heavy wear — while happily giving you those same notes in change.",
        hack: "C",
        move: "Refuse damaged notes in change on the spot. Ask your bank for crisp, newer bills before the trip.",
      },
      {
        name: "Angkor ticket and 'closed temple' guides",
        how: "Unofficial 'guides' at Angkor attach themselves and demand a fee, or someone claims a temple or the ticket office is closed and steers you to a tour or shop.",
        hack: "A",
        move: "Buy the Angkor pass only at the official ticket centre. Licensed guides carry a Ministry of Tourism ID; the men who approach you at the gates do not.",
      },
      {
        name: "Child-begging and 'buy milk for the baby'",
        how: "Children or mothers ask you to buy formula or rice from a specific nearby shop; the goods are returned to the shop afterward and the cash split. It funds organised begging, often keeping kids out of school.",
        hack: "C",
        move: "Don't buy goods on request. If you want to help, give to an established local charity instead.",
      },
    ],
    faqs: [
      {
        q: "How do I avoid tuk-tuk overcharging in Cambodia?",
        a: "Use the Grab or PassApp apps, which fix the fare. For a cash deal, write the total price, currency (riel or dollars) and route on your phone and confirm it's the total before you set off.",
      },
      {
        q: "Should I buy milk for a begging child in Siem Reap?",
        a: "No. The 'buy formula from this shop' request is a known scam — the goods go back to the shop and the money is shared, and it sustains organised child begging. Support a registered local charity instead.",
      },
    ],
  },

  philippines: {
    intro:
      "In Manila and Cebu the risks that need planning around are the 'ativan gang' (drink drugging), taxi meter refusal, the 'planted bullet' airport shakedown (largely stamped out but worth knowing), and money-changer short-counts.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Ativan / drink-drugging gangs",
        how: "A friendly stranger or 'fellow traveller', sometimes a group posing as a family, befriends you and offers food, a drink or sweets laced with a sedative; you wake up robbed. Common around Manila, Ermita and on buses.",
        hack: "C",
        move: "Don't accept food, drinks or sweets from someone you've just met, however warm they seem. Keep your drink in sight.",
      },
      {
        name: "Taxi meter refusal and 'no change'",
        how: "Airport and mall taxis refuse the meter, quote flat tourist fares, or claim to have no change for a large note.",
        hack: "H",
        move: "Use Grab. It's dominant in the Philippines and fixes the fare. At the airport, use the official yellow metered-taxi line, not a car that approaches you.",
      },
      {
        name: "Money-changer short-count",
        how: "A changer offering a rate above the market distracts you during the count, folds notes back, or uses a rigged calculator.",
        hack: "C",
        move: "Use a mall-based licensed changer or a bank, count the full amount yourself before handing over your currency, and don't let them re-touch the stack.",
      },
      {
        name: "'Planted' item at airport security (laglag-bala)",
        how: "The historic scam had staff slip a bullet into luggage then demand a bribe. Enforcement has largely ended it, but keep bags closed and locked and film any 'discovery'.",
        hack: "A",
        move: "Lock checked and hand luggage, don't let anyone else pack or handle your bags, and if something is 'found', ask for a supervisor and to see CCTV rather than paying anything.",
      },
      {
        name: "Beach and dive-shop overcharging",
        how: "In Boracay, El Nido and Cebu, touts sell island-hopping tours and dive trips at inflated prices, with 'environmental fees' and gear charges added at the boat.",
        hack: "C",
        move: "Book with a shop that has a physical premises and reviews, get the all-in price in writing including fees, and keep the receipt.",
      },
    ],
    faqs: [
      {
        q: "What is the 'ativan gang' in the Philippines?",
        a: "Criminals who befriend tourists — often posing as a friendly family or fellow traveller — and offer food or drink spiked with a sedative, then rob them while unconscious. The defence is simple: never accept anything to eat or drink from someone you've just met.",
      },
      {
        q: "Is Grab safe to use in Manila?",
        a: "Yes, and it's the recommended way to get around. It fixes the fare and route and removes the meter-refusal and 'no change' problems common with street and airport taxis.",
      },
    ],
  },

  "sri-lanka": {
    intro:
      "In Colombo, Kandy and the south, the recurring scams are tuk-tuk meter refusal and long routes, gem-shop commission tours, 'the temple is closed' redirects, and inflated 'guide' fees at sites.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Tuk-tuk meter refusal and detours",
        how: "Drivers wave away the meter for a flat tourist price, or agree a fare then detour to a gem shop, spice garden or 'brother's shop' that pays commission.",
        hack: "H",
        move: "Use the PickMe app (Sri Lanka's Grab) so the fare is fixed. If you take a street tuk-tuk, insist on the meter and say 'no shops'.",
      },
      {
        name: "Gem-shop commission tours",
        how: "A friendly local or driver offers to show you a 'government gem museum' or a workshop where 'certified' stones are sold cheap for resale abroad. The stones are low quality and the resale story is fiction.",
        hack: "C",
        move: "Skip it. There is no gem resale opportunity, and 'government' gem shops are private. Only buy from a licensed dealer if you genuinely want a stone for yourself.",
      },
      {
        name: "'The temple is closed / there's a ceremony'",
        how: "Near the Temple of the Tooth in Kandy or Colombo temples, someone says it's shut for a ritual until later and offers to take you elsewhere — to a shop or a paid 'viewpoint'.",
        hack: "H",
        move: "Check the opening hours yourself and walk to the entrance. The redirect is the scam.",
      },
      {
        name: "Unofficial 'guides' at sites",
        how: "At Sigiriya, Dambulla and Galle Fort, men attach themselves as guides without being asked and demand a large fee at the end, or 'helpers' offer photos then charge.",
        hack: "C",
        move: "Say clearly you don't want a guide. If you do want one, use a licensed guide arranged through your hotel. Keep hold of your phone.",
      },
      {
        name: "Train and bus 'ticket office is closed'",
        how: "Someone near Colombo Fort or Kandy station says the counter is shut or the train is full and routes you to a travel agent charging a big markup for the scenic hill-country train.",
        hack: "A",
        move: "Buy at the station counter, or reserve online in advance for the Kandy–Ella route. Ignore anyone offering to 'help' with tickets outside.",
      },
    ],
    faqs: [
      {
        q: "How do I avoid tuk-tuk scams in Sri Lanka?",
        a: "Use the PickMe app, which fixes the fare like Grab. For a street tuk-tuk, insist on the meter and tell the driver 'no shops' — the detour to a gem or spice shop for commission is the most common trick.",
      },
      {
        q: "Are the gem shops in Sri Lanka a scam?",
        a: "The 'buy gems cheap to resell abroad' pitch is. So are 'government gem museums', which are private shops. Sri Lanka does have a genuine gem trade, but only buy from a licensed dealer, for yourself, at a fair price.",
      },
    ],
  },

  malaysia: {
    intro:
      "Kuala Lumpur and Penang are generally easy for visitors. The main issues are taxi meter refusal, ATM skimming, bag-snatching by motorbike, and 'card declined' double charges.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi meter refusal",
        how: "Street and some airport taxis, especially around KL's tourist areas and Bukit Bintang, refuse the meter and quote inflated flat fares.",
        hack: "H",
        move: "Use Grab, which is dominant in Malaysia and fixes the fare. At KLIA, use the official coupon-taxi counter where you prepay a fixed price.",
      },
      {
        name: "Motorbike bag-snatching",
        how: "Riders snatch handbags and phones from pedestrians near the kerb, sometimes dragging the victim. Common in parts of KL, Penang and Johor Bahru.",
        hack: "K",
        move: "Carry bags on the side away from the road, strap across the body, and don't walk near the kerb holding a phone.",
      },
      {
        name: "ATM skimming and card retention",
        how: "Standalone ATMs in tourist zones are skimmed, or a device holds your card while a bystander watches the PIN.",
        hack: "C",
        move: "Use ATMs inside bank branches during opening hours, cover the keypad, and if a card is retained, call the bank without leaving the machine.",
      },
      {
        name: "'Your card was declined' double swipe",
        how: "A shop or restaurant says the first payment failed and runs the card again; both go through, or the amount is changed after you approve.",
        hack: "K",
        move: "Watch the terminal and the amount, keep every receipt, and check your statement. Dispute any duplicate immediately.",
      },
      {
        name: "'Genuine fake' watches and electronics in Petaling Street",
        how: "Sellers in KL's Chinatown and Penang markets push counterfeits as originals at 'special' prices, or swap the inspected item for a worse one at the bag.",
        hack: "C",
        move: "Assume branded goods in the market are fake and price accordingly. Watch the item go into the bag, and don't pay a 'genuine' price.",
      },
    ],
    faqs: [
      {
        q: "Is Grab the best way to get around Kuala Lumpur?",
        a: "Yes. It's widely used, fixes the fare, and avoids the meter-refusal problem with street taxis. From the airport, the official prepaid coupon-taxi counter is the equivalent safe option.",
      },
      {
        q: "How common is bag-snatching in Malaysia?",
        a: "Motorbike bag-snatching is a known risk in parts of KL, Penang and Johor Bahru. Carry bags on the side away from traffic, worn across the body, and keep your phone pocketed when walking near the road.",
      },
    ],
  },

  germany: {
    intro:
      "Germany is low-crime and largely scam-free. The realistic risks for visitors are pickpockets at major stations and Christmas markets, ticket-inspection confusion on public transport, and the odd overcharge at Oktoberfest.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Pickpockets at Hauptbahnhof and Christmas markets",
        how: "Teams work the main stations (Berlin, Cologne, Frankfurt), the S-Bahn, and dense Christmas-market crowds — one distracts, one lifts.",
        hack: "C",
        move: "Bag zipped and in front, phone in a front pocket, wallet not in a back pocket. Most alert on crowded platforms and in market crushes.",
      },
      {
        name: "Fake ticket inspectors",
        how: "On the U-Bahn/S-Bahn, someone in plain clothes claims to be a ticket inspector, says your ticket is invalid, and demands an on-the-spot cash 'fine'.",
        hack: "A",
        move: "Real inspectors show a photo ID card and issue a written penalty payable later or at an office. Ask for the ID, and never hand over cash on the train.",
      },
      {
        name: "'Petition' clipboard teams",
        how: "Groups (often near Brandenburg Gate, Cologne Cathedral, Marienplatz) ask you to sign a petition for a deaf or disabled charity; a partner opens your bag, or they demand a cash donation.",
        hack: "C",
        move: "Don't stop or take the clipboard. Legitimate charities don't collect cash this way at tourist sites.",
      },
      {
        name: "Oktoberfest and tourist-bar overcharging",
        how: "Outside the official Oktoberfest tents, and in some tourist bars, drinks are poured short, 'reserved table' fees appear, or the bill is padded.",
        hack: "C",
        move: "Stick to the official festival tents and priced menus. Check your change and the bill.",
      },
    ],
    faqs: [
      {
        q: "Are there scams to worry about in Germany?",
        a: "Very few. Germany is low-crime. The main things are pickpockets at big stations and Christmas markets, and occasional fake ticket 'inspectors' on the U-Bahn demanding cash — real ones carry ID and issue written fines.",
      },
      {
        q: "How do I know if a ticket inspector is real in Germany?",
        a: "Genuine inspectors carry a photo identity card (ask to see it) and issue a written 'erhöhtes Beförderungsentgelt' — a penalty you pay later or at an office. They never take cash on the spot. Anyone demanding cash on the train is not legitimate.",
      },
    ],
  },

  poland: {
    intro:
      "Kraków and Warsaw are safe and inexpensive. The main issues are taxi overcharging from stations and the airport, currency-exchange 'kantor' spreads near the tourist strip, and restaurant bill padding in the old town.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi overcharging from stations and airport",
        how: "Cars waiting outside Kraków and Warsaw stations and airports charge two to four times the metered rate, or run a rigged 'night' tariff.",
        hack: "H",
        move: "Use Bolt, Uber or FREE NOW, or an official airport taxi from the marked rank with posted prices. Ignore drivers who approach you inside.",
      },
      {
        name: "Currency exchange 'kantor' spreads",
        how: "Exchange offices right on the Kraków main square and Warsaw's tourist streets advertise a headline rate that is the 'sell' side, or apply it only above a large amount, leaving you well down.",
        hack: "C",
        move: "Use a bank ATM, or a kantor a street or two back from the square that shows the exact złoty you'll receive before you commit.",
      },
      {
        name: "Restaurant bill padding in the old town",
        how: "Places on and around Kraków's Rynek bring unrequested bread or appetisers, add a 'cover', or a waiter fills in a tip line.",
        hack: "C",
        move: "Check the menu, refuse anything unordered, and review the bill. Tipping ~10% is normal but is your choice, not a pre-filled line.",
      },
      {
        name: "'Gentlemen's club' flyer trap",
        how: "Men hand out flyers near Kraków's square and Warsaw's centre inviting you to a club with 'free entry'; inside, drinks and 'company' produce a huge bill with intimidation at the door.",
        hack: "K",
        move: "Bin the flyer. If you're inside, pay for your own drinks only, photograph the menu, and leave toward a busy street.",
      },
    ],
    faqs: [
      {
        q: "Where should I exchange money in Kraków?",
        a: "At a bank ATM or a kantor away from the main square that displays the exact amount you'll receive. The exchange offices directly on the Rynek advertise misleading headline rates.",
      },
      {
        q: "Are taxis in Poland a problem?",
        a: "Only the ones waiting outside stations and airports for tourists. App rides (Bolt, Uber, FREE NOW) are cheap and fix the fare, and are the easy way to avoid the overcharge.",
      },
    ],
  },

  "costa-rica": {
    intro:
      "Costa Rica is welcoming but has a real property-crime problem for tourists: slashed tyres at the airport, smash-and-grab from parked rental cars, and 'helpful stranger' distraction thefts. Violent crime against visitors is uncommon.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Slashed tyre at the airport",
        how: "Near San José (SJO) airport, someone punctures a rental-car tyre or points out a 'flat'; when you stop to change it a short way down the road, an accomplice takes bags from the car.",
        hack: "H",
        move: "If you get a flat just after leaving the airport, drive on the rim to a busy petrol station or back to the rental office. Don't stop on a quiet stretch.",
      },
      {
        name: "Smash-and-grab from rental cars",
        how: "Rental cars are targeted at trailheads, beaches, waterfalls and viewpoints — windows broken and bags taken in seconds while you're away, or even at a red light.",
        hack: "K",
        move: "Never leave anything visible in the car, ever. Take valuables with you or don't bring them. Use guarded parking where it exists.",
      },
      {
        name: "'Helpful' distraction at ATMs and gas stations",
        how: "A stranger offers help at an ATM or points at your tyre or a 'spill' on you at a gas station while a partner takes something from the car or your bag.",
        hack: "C",
        move: "Decline all help at ATMs and pumps. Keep the car locked while fuelling and pay attention to anyone approaching.",
      },
      {
        name: "Unofficial taxis ('piratas')",
        how: "Unlicensed taxis, especially at the airport and bus terminals, overcharge and occasionally rob. Official taxis are red with a yellow triangle (orange at the airport).",
        hack: "A",
        move: "Use Uber (works in the San José area) or an official red taxi with a working meter ('la maría'). At SJO, use the official orange airport taxis or a pre-booked transfer.",
      },
      {
        name: "'Environmental fee' and parking add-ons at beaches",
        how: "At some beaches and waterfalls, informal 'attendants' demand a parking or entry fee that isn't official, or 'watch your car' for a fee then do nothing.",
        hack: "A",
        move: "Pay official, signed entry fees only. A small tip to a genuine guarded lot is fine; ignore anyone freelancing.",
      },
    ],
    faqs: [
      {
        q: "What should I do if my rental car gets a flat tyre near San José airport?",
        a: "Keep driving — on the rim if you have to — to a busy petrol station or back to the rental office, and change it there. The 'flat tyre just after the airport' is a classic setup for taking bags from the car while you're distracted on a quiet roadside.",
      },
      {
        q: "Is car break-in really that common in Costa Rica?",
        a: "Yes. Rental cars at trailheads, beaches and waterfalls are a prime target, and it can happen in minutes. The rule is absolute: never leave anything visible or valuable in the car, anywhere.",
      },
    ],
  },

  "dominican-republic": {
    intro:
      "Most visitors stay in resorts, where the issues are timeshare pressure, excursion overcharging and currency games. Outside the resorts, unlicensed taxis and 'motoconcho' overcharging are the main things to manage.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Timeshare / 'membership' hard sell",
        how: "Resort 'welcome' or 'guest services' staff offer a free breakfast, tour or spa credit in exchange for a 90-minute presentation that turns into high-pressure sales for a vacation club, with a same-day-only discount.",
        hack: "H",
        move: "Decline the 'free' offer at check-in. Nothing genuine expires the moment you leave the room to think.",
      },
      {
        name: "Excursion and taxi overcharging",
        how: "Excursions booked through beach touts or the resort lobby cost far more than the same trip booked directly with the operator; taxis quote flat tourist fares with no meter.",
        hack: "C",
        move: "Book excursions with an established operator online and compare prices. Agree taxi fares before getting in, or use a resort-arranged car with a set rate.",
      },
      {
        name: "Currency confusion (pesos vs dollars)",
        how: "Vendors quote in dollars at a poor rate, give change in pesos counting on you not knowing the value, or 'round up' heavily.",
        hack: "C",
        move: "Know the peso rate, agree the currency before paying, and count change before you walk away.",
      },
      {
        name: "'Motoconcho' and unlicensed taxi overcharge",
        how: "Motorbike taxis and unmarked cars in Santo Domingo and Punta Cana overcharge tourists heavily and occasionally are unsafe.",
        hack: "A",
        move: "Use Uber where it operates (Santo Domingo, Santiago), or a marked, resort-recommended taxi. Avoid motoconchos with luggage or at night.",
      },
      {
        name: "Beach vendor 'gift' then payment demand",
        how: "A vendor puts a bracelet, shell necklace or hair braid on you or a companion 'as a gift', then demands payment and makes a scene.",
        hack: "C",
        move: "Don't let anyone put anything on you. A firm 'no, gracias' without stopping is enough.",
      },
    ],
    faqs: [
      {
        q: "Should I do the timeshare presentation for the free perks in the Dominican Republic?",
        a: "Only if you're comfortable saying no to a long, high-pressure pitch and walking out. The 'free' breakfast or tour is bait for a vacation-club sale with a fake same-day discount. Most people find it not worth the time.",
      },
      {
        q: "Are taxis safe in Punta Cana and Santo Domingo?",
        a: "Use Uber in Santo Domingo, or marked taxis your resort recommends with an agreed fare. Avoid unmarked cars and motoconchos, especially with luggage or after dark, where overcharging and occasional robbery are the risks.",
      },
    ],
  },

  kenya: {
    intro:
      "Nairobi and the coast require awareness. For visitors the recurring scams are fake safari operators taking deposits, taxi overcharging, ATM card-swapping, and 'I know you from the hotel' approaches.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Fake or 'briefcase' safari operators",
        how: "A cheap safari sold on a Nairobi street, by a 'friend' or a slick pop-up office takes a deposit or full payment, then the vehicle is a wreck, the itinerary changes, or the operator vanishes.",
        hack: "C",
        move: "Book only with an operator licensed by the Kenya Association of Tour Operators (KATO), pay by card or a traceable method, and never hand cash to someone who approached you.",
      },
      {
        name: "'I know you from the hotel / restaurant'",
        how: "A friendly man says he works at your hotel or served you last night, walks with you, then guides you to a shop, a 'community project' donation, or simply demands a fee for his time.",
        hack: "C",
        move: "You'd recognise hotel staff. Politely disengage and don't follow anyone. If pressed, step into a shop or hotel lobby.",
      },
      {
        name: "Taxi overcharging and 'no meter'",
        how: "Street and airport taxis quote flat tourist fares several times the real price, or take long routes.",
        hack: "H",
        move: "Use Uber, Bolt or Little (all operate in Nairobi and Mombasa) so the fare is fixed. From the airport, use a pre-booked transfer or the official taxi desk.",
      },
      {
        name: "ATM card-swap and skimming",
        how: "A 'helpful' stranger at an ATM distracts you and swaps your card, or standalone machines are skimmed; the account is drained with the observed PIN.",
        hack: "C",
        move: "Use ATMs inside bank branches or malls during the day, refuse all help, and cover the keypad. Cancel immediately if a card is retained.",
      },
      {
        name: "Curio and 'Maasai market' price games",
        how: "Stalls quote wildly inflated opening prices for carvings and fabrics and use guilt and 'friend price' pressure; some swap the inspected piece for a lesser one.",
        hack: "C",
        move: "Expect to pay a fraction of the first price, be willing to walk away, and watch your item go into the bag.",
      },
    ],
    faqs: [
      {
        q: "How do I avoid safari scams in Kenya?",
        a: "Book only through a KATO-licensed operator, verify the licence, and pay by card or another traceable method. Never buy a safari from someone who approaches you on the street or pay a large cash deposit to an unverified 'office'.",
      },
      {
        q: "Is it safe to take taxis in Nairobi?",
        a: "Use the apps — Uber, Bolt or Little all work in Nairobi and Mombasa and fix the fare. Street and airport taxis commonly overcharge tourists; for the airport, pre-book a transfer or use the official desk.",
      },
    ],
  },

  austria: {
    intro:
      "Austria is very safe. In Vienna and Salzburg the only real issues are pickpockets in tourist crowds and on public transport, aggressive 'Mozart concert' ticket touts, and occasional taxi overcharging from the airport.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Pickpockets on the U-Bahn and at St Stephen's",
        how: "Teams work Vienna's U-Bahn (especially U1/U3), the area around Stephansplatz, and Salzburg's old town, using the usual bump-and-lift.",
        hack: "C",
        move: "Bag zipped and in front, phone pocketed. Be most alert boarding trains and in the crush around the cathedral.",
      },
      {
        name: "Costumed 'Mozart' concert touts",
        how: "People in period wigs and coats near the Opera and Stephansplatz sell concert tickets at a steep markup, or for a lower-quality show than described.",
        hack: "A",
        move: "Buy from the venue's official box office or website. The costumed sellers add commission and the venue may not be the one you expect.",
      },
      {
        name: "Airport taxi overcharge",
        how: "Drivers at Vienna airport quote €50–70 flat when the fair fare to the centre is around €40, or the CAT train / S-Bahn is far cheaper.",
        hack: "H",
        move: "Agree a price before getting in, use a booked airport taxi at a fixed rate, or take the S-Bahn (S7) which is inexpensive and direct.",
      },
      {
        name: "'Free' rose or bracelet",
        how: "Someone hands you a rose or ties a bracelet 'as a gift' near tourist spots, then demands payment.",
        hack: "H",
        move: "Hands in pockets, don't accept it, keep walking. If it's on your wrist, you still owe nothing.",
      },
    ],
    faqs: [
      {
        q: "Are the people selling Mozart concert tickets in Vienna legitimate?",
        a: "They sell real tickets, but at a markup, and sometimes for a different or lesser venue than you expect. Buy directly from the concert hall's official box office or website instead.",
      },
      {
        q: "How much should a taxi from Vienna airport cost?",
        a: "Around €40 to the city centre in a booked fixed-rate taxi. Drivers quoting €50–70 are overcharging. The S7 S-Bahn is a cheap, direct alternative; the CAT is faster but pricier.",
      },
    ],
  },
};

export function getPublishedCountrySlugs(): string[] {
  return Object.entries(COUNTRY_GUIDES)
    .filter(([, guide]) => guide.status === "published")
    .map(([slug]) => slug);
}
