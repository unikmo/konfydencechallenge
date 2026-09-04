/**
 * Country scam guides — the SEO content layer for /countries/[country].
 *
 * A country only enters the sitemap and is indexable once its guide has
 * status: "published". Draft / missing guides render a minimal noindex page.
 *
 * Each scam is tagged with the H.A.C.K. pressure pattern it uses
 * (H = Hurry, A = Authority, C = Comfort, K = Kill-Switch) and the
 * Pause · Think · Call move that defuses it — the Konfydence angle that
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
};

export function getPublishedCountrySlugs(): string[] {
  return Object.entries(COUNTRY_GUIDES)
    .filter(([, guide]) => guide.status === "published")
    .map(([slug]) => slug);
}
