/**
 * German (de) country scam guides — the localized content layer for
 * /de/countries/[country]. Mirrors lib/country-guides.ts's shape and voice
 * rules (culturally adapted, not machine-translated where a detail needs
 * German-specific framing — e.g. currency, official terms). Consumer
 * address is "du", matching every other German consumer surface in this
 * app (Challenge decks, session play, results).
 *
 * Only countries with a finished German translation appear here — the
 * /de/countries index and [country] route only generate pages for these
 * keys, so a country missing here simply isn't part of the German funnel
 * yet rather than rendering a stub. See data/scenarios-de/README.md for
 * the same "focused funnel, not a full site translation" precedent.
 */
import type { CountryGuide, HackKey } from "@/lib/country-guides";

export const HACK_LABEL_DE: Record<HackKey, string> = {
  H: "Hetze",
  A: "Autorität",
  C: "Vertrautheit",
  K: "Notbremse",
};

export const HACK_DEF_DE: Record<HackKey, string> = {
  H: "Zeitdruck. Eine Frist, ein Countdown oder ein „jetzt sofort“, das keine Zeit zum Prüfen lässt.",
  A: "Amtston. Ein Ausweis, ein Titel, eine Uniform oder eine offiziell klingende Bitte, die du nicht zu hinterfragen wagst.",
  C: "Vertrautheit. Ein freundlicher Einheimischer, eine Routine oder eine Emotion, die die Bitte sicherer wirken lässt, als sie ist.",
  K: "Der Punkt ohne Rückweg. Der Moment, in dem du gedrängt wirst zu zahlen, zu klicken, ein Dokument herzugeben oder jemandem zu folgen — bevor du prüfen kannst.",
};

/** German display name for every country with a finished guide translation. */
export const COUNTRY_NAME_DE: Record<string, string> = {
  thailand: "Thailand",
  spain: "Spanien",
  italy: "Italien",
  france: "Frankreich",
  mexico: "Mexiko",
  turkey: "Türkei",
  egypt: "Ägypten",
  greece: "Griechenland",
  vietnam: "Vietnam",
  indonesia: "Indonesien",
  morocco: "Marokko",
  india: "Indien",
  portugal: "Portugal",
  "united-kingdom": "Vereinigtes Königreich",
  "united-states": "USA",
  "united-arab-emirates": "Vereinigte Arabische Emirate",
  japan: "Japan",
  brazil: "Brasilien",
  colombia: "Kolumbien",
  peru: "Peru",
  "south-africa": "Südafrika",
  czechia: "Tschechien",
  netherlands: "Niederlande",
  argentina: "Argentinien",
  croatia: "Kroatien",
  "south-korea": "Südkorea",
  cambodia: "Kambodscha",
  philippines: "Philippinen",
  "sri-lanka": "Sri Lanka",
  malaysia: "Malaysia",
  germany: "Deutschland",
  poland: "Polen",
  "costa-rica": "Costa Rica",
  "dominican-republic": "Dominikanische Republik",
  kenya: "Kenia",
  austria: "Österreich",
};

export const CONTINENT_DE: Record<string, string> = {
  Africa: "Afrika",
  Asia: "Asien",
  Europe: "Europa",
  "North America": "Nordamerika",
  "South America": "Südamerika",
  Oceania: "Ozeanien",
};

export const COUNTRY_GUIDES_DE: Record<string, CountryGuide> = {
  thailand: {
    intro:
      "Die meisten Betrugsmaschen in Thailand sind freundlich, nicht aggressiv. Sie beginnen mit einem hilfsbereiten Einheimischen an einem Tempel, einem Tuk-Tuk-Fahrer mit einer tollen Idee oder einem Verleih, der es mit dem Papierkram locker nimmt. Das Geld ist erst später weg, still und leise.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "„Der Grand Palace ist geschlossen“ — Schmuckladen-Tour",
        how: "Ein gut gekleideter Fremder in Tempelnähe erzählt dir, der Tempel sei wegen einer Zeremonie bis nachmittags geschlossen, und organisiert dann eine billige Tuk-Tuk-„Tour“, die bei einem Schmuck- oder Schneiderladen hält, wo Druck zum Kauf aufgebaut wird.",
        hack: "C",
        move: "Prüf die Öffnungszeiten selbst auf der offiziellen Seite. Staatliche Tempel schließen nicht für private Zeremonien. Geh einfach zum Tor und schau nach.",
      },
      {
        name: "Jetski- und Motorrad-„Schadenersatz“",
        how: "Du mietest ein Jetski oder Roller, hinterlegst deinen Pass als Kaution, und bei der Rückgabe zeigt der Vermieter auf vorhandene Kratzer und verlangt hunderte Dollar — und behält deinen Pass, bis du zahlst.",
        hack: "K",
        move: "Gib nie deinen Pass her — biete eine Bar-Kaution oder eine Kopie an. Film das Fahrzeug vor der Fahrt von allen Seiten, mit dem Vermieter im Bild.",
      },
      {
        name: "Manipuliertes Taxameter / „Taxameter kaputt“",
        how: "Taxis am Flughafen und in Touristengebieten weigern sich, das Taxameter zu nutzen, und nennen einen Festpreis, der zwei- bis dreimal so hoch ist wie der reale — oder lassen ein Taxameter ungewöhnlich schnell hochlaufen.",
        hack: "H",
        move: "Nutze Grab oder den offiziellen Taxischalter am Flughafen. Wenn ein Fahrer das Taxameter nicht startet, steig aus, bevor die Türen zu sind.",
      },
      {
        name: "Bar-Rechnung und „Ping-Pong-Show“-Aufschlag",
        how: "Ein Anwerber führt dich zu einer Show mit „kein Eintritt“; drinnen werden Getränke zum Zehnfachen abgerechnet, und beim Rausgehen tauchen eine hohe Rechnung plus „Strafen“ auf, während Personal die Tür blockiert.",
        hack: "K",
        move: "Lehn Straßenanwerber grundsätzlich ab. Bist du schon drin und die Rechnung stimmt nicht, zahl nur, was du bestellt hast, fotografier die Karte und geh in Richtung einer belebten Straße.",
      },
      {
        name: "Falsche Touristenpolizei und „Bußgeld“-Forderungen",
        how: "Jemand in einem vage offiziellen Hemd stoppt dich wegen „falschem Überqueren“, „Vapen“ oder Müll und verlangt ein Bußgeld bar vor Ort, manchmal mit gefälschtem Ausweis.",
        hack: "A",
        move: "Echte Bußgelder werden auf der Wache bezahlt, nicht bar auf der Straße. Schlag vor, gemeinsam zur nächsten Polizeiwache zu gehen — ein Betrüger lässt dann locker.",
      },
      {
        name: "SIM-Karten- und Geldwechsel-„Hilfe“ am Flughafen",
        how: "Eine „Hilfe“ am Schalter oder Geldautomaten bietet Unterstützung an, vertauscht beim Zählen Scheine oder verkauft eine überteuerte SIM-Karte mit viel weniger Datenvolumen als versprochen.",
        hack: "C",
        move: "Zähl Bargeld selbst, abseits vom Schalter. Kauf SIM-Karten an den offiziellen Anbieter-Schaltern (AIS, TrueMove, dtac) und prüf das Paket auf dem Handy, bevor du gehst.",
      },
    ],
    faqs: [
      {
        q: "Was ist der häufigste Betrug in Thailand?",
        a: "Die „Der Tempel ist geschlossen“-Schmuckladen-Tour ist der Klassiker. Ein freundlicher, gut sprechender Einheimischer erzählt dir, eine große Sehenswürdigkeit sei geschlossen, und lotst dich per Tuk-Tuk zu Läden, die ihm Provision zahlen.",
      },
      {
        q: "Sind Taxis in Thailand sicher?",
        a: "Taxis mit Taxameter sind meist in Ordnung, wenn es tatsächlich genutzt wird. Das Problem sind Fahrer, die das Taxameter für einen Festpreis ablehnen. Grab nimmt das Verhandeln komplett raus und ist weit verbreitet.",
      },
      {
        q: "Soll ich meinen Pass hinterlegen, um in Thailand einen Roller zu mieten?",
        a: "Nein. Pass als Kaution ist genau die Masche hinter Schadenersatz-Betrug — der Vermieter hält dein Dokument als Geisel gegen eine erfundene Forderung. Biete Bargeld oder eine Kopie an und film das Fahrzeug vorher.",
      },
    ],
  },

  spain: {
    intro:
      "Bei Betrugsmaschen in Spanien geht es um deine Hände und deine Aufmerksamkeit, nicht um Konfrontation. Barcelona und Madrid haben einige der geübtesten Taschendieb-Teams Europas, und die Straßenspiele sind darauf ausgelegt, den Fokus einer Menschenmenge für drei Sekunden abzulenken.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Ablenkungs-Taschendiebstahl auf Las Ramblas und in der Metro",
        how: "Eine Person fragt nach dem Weg, verschüttet etwas auf dir oder zeigt dir eine Karte, während eine zweite dein Handy oder Portemonnaie zieht. Häufig auf Barcelonas Las Ramblas, rund um die Sagrada Família und auf Metrolinie 3.",
        hack: "C",
        move: "Wenn dir jemand zu nah kommt oder dich berührt, tritt zurück und leg die Hand auf die Tasche. Trag sie in Menschenmengen und auf Rolltreppen vorne am Körper.",
      },
      {
        name: "Der „gefundene“ Goldring",
        how: "Jemand hebt vor dir einen Ring auf, fragt, ob er dir gehört, und drängt ihn dir dann auf — mit der Bitte um Geld „für den Fund“ oder zum Kauf. Der Ring ist wertlos.",
        hack: "C",
        move: "Nimm ihn nicht an und bleib nicht stehen. Jede Reaktion ist schon der Aufhänger, den sie wollen.",
      },
      {
        name: "Rosmarinzweig / Flamenco-Blume",
        how: "Eine Frau drückt dir „zum Glück“ oder als „Geschenk“ einen Rosmarinzweig in die Hand, liest deine Handfläche und verlangt dann aggressiv Geld, ohne deine Hand loszulassen. Häufig vor den Kathedralen in Sevilla und Granada.",
        hack: "H",
        move: "Halt die Hände in den Taschen in der Nähe von Kathedraleneingängen. Hast du schon etwas angenommen, lass es fallen und geh weiter — du schuldest nichts.",
      },
      {
        name: "Falsche Polizei-„Drogenkontrolle“",
        how: "Männer in Zivil zeigen einen Ausweis, geben sich als Polizei aus, die angeblich nach Falschgeld oder Drogen sucht, und bitten, dein Portemonnaie oder deinen Pass zu prüfen — dabei verschwinden bei der „Kontrolle“ Bargeld oder Karten.",
        hack: "A",
        move: "Echte spanische Zivilpolizei prüft dein Bargeld nicht auf der Straße. Sag, du gehst zur nächsten Wache, und behalt dein Portemonnaie in der Tasche.",
      },
      {
        name: "Vertauschte Speisekarte im Restaurant",
        how: "Restaurants in Touristenlagen bringen dir, sobald du sitzt, eine andere, teurere Karte, berechnen ein „Gedeck“ oder „Brot“, das du nicht bestellt hast, oder verlangen „Terrassen“-Preise, die außen nicht ausgeschrieben waren.",
        hack: "C",
        move: "Fotografier die ausgehängte Karte, bevor du dich setzt. Lehn ab und schick zurück, was du nicht bestellt hast, und prüf die Rechnung Position für Position.",
      },
      {
        name: "Kautionsbetrug bei Ferienwohnungen",
        how: "Ein Inserat (oft von einem echten kopiert, leicht unterpreisig) verlangt eine Kaution oder Vollzahlung per Überweisung vor der Besichtigung. Die Wohnung existiert nicht oder gehört nicht der Person, die sie vermietet.",
        hack: "K",
        move: "Zahl nie per Überweisung für eine ungesehene Wohnung. Buch über eine Plattform, die das Geld bis zum Check-in hält, und mach eine Rückwärtssuche der Fotos.",
      },
    ],
    faqs: [
      {
        q: "Ist Barcelona sicher für Touristen?",
        a: "Gewaltverbrechen gegen Touristen sind selten; Taschendiebstahl nicht. Las Ramblas, die Metro, der Strand und die Gegend um die Sagrada Família sind die Hotspots. Halt Taschen geschlossen und trag sie vorne am Körper.",
      },
      {
        q: "Gibt es falsche Polizei in Spanien?",
        a: "Ja, vor allem in Barcelona und Madrid. Das Erkennungszeichen: Sie wollen dein Portemonnaie, Bargeld oder deine Karten sehen oder anfassen. Echte Beamte tun das nicht. Schlag stattdessen vor, zur Wache zu gehen.",
      },
    ],
  },

  italy: {
    intro:
      "Rom, Florenz und Venedig leben vom Touristenaufkommen, und darüber liegt eine Schicht kleiner Betrugsmaschen: Dinge zum Festpreis, die als Gefälligkeit verkauft werden, offiziell wirkende Helfer an Ticketautomaten und Taxis, die den Flughafen-Festpreis plötzlich vergessen haben.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "„Warteschlange überspringen“-Ticketverkäufer",
        how: "Vor dem Kolosseum, den Vatikanischen Museen und den Uffizien verkaufen Leute mit Ausweis am Band „Fast-Track“-Tickets mit hohem Aufschlag — oder Touren, die dich trotzdem in der normalen Schlange absetzen.",
        hack: "H",
        move: "Kauf auf der offiziellen Seite (coopculture.it, museivaticani.va), bevor du reist. Das echte Überspringen der Schlange ist das gebuchte Zeitfenster-Ticket, nicht eine Person auf der Straße.",
      },
      {
        name: "Flughafen-Taxi-Überteuerung",
        how: "Fahrer an Rom Fiumicino und in Mailand nennen 80–100 € oder lassen ein „Touristen-Taxameter“ laufen und ignorieren den Festpreis ins Zentrum (Rom: 50 € innerhalb der Aurelianischen Mauer).",
        hack: "A",
        move: "Nimm nur weiße Taxis vom offiziellen Stand. Bestätige „Festpreis, fünfzig Euro“, bevor die Türen zu sind, oder nimm den Zug (Leonardo Express).",
      },
      {
        name: "Freundschaftsarmband / Körner für die Vögel",
        how: "Ein Mann bindet dir ein Armband ums Handgelenk oder drückt dir Körner oder eine Rose in die Hand, nahe der Spanischen Treppe oder dem Markusplatz, und verlangt dann mehrere Euro, während er dir den Weg versperrt.",
        hack: "C",
        move: "Hände in den Taschen, nicht langsamer werden, keinen Blickkontakt. Ist es schon am Handgelenk, schneid es später ab — du schuldest nichts.",
      },
      {
        name: "Gladiator-Foto-Gebühr",
        how: "Kostümierte „Zenturionen“ nahe dem Kolosseum posieren mit dir oder deinen Kindern und verlangen dann 10–20 € pro Person, manchmal umringen sie dich dabei.",
        hack: "H",
        move: "Vereinbare den Preis laut, bevor ein Foto gemacht wird, oder sag einfach Nein. Ist schon posiert worden, gib insgesamt ein paar Euro und geh weiter.",
      },
      {
        name: "„Helfer“ am Fahrkartenautomaten",
        how: "An Termini und anderen Bahnhöfen „hilft“ dir jemand am Automaten und verlangt dann Trinkgeld — oder lenkt dich zum falschen (teureren) Ticket, während ein Partner deine Tasche im Blick hat.",
        hack: "C",
        move: "Nutze die Trenitalia- oder Italo-App. Nähert sich jemand dem Automaten, halt inne und warte, bis die Person weg ist.",
      },
      {
        name: "Restaurant-Gedeck und „Fisch nach Gewicht“",
        how: "Nahe großen Sehenswürdigkeiten tauchen ein nicht angekündigtes coperto und Service auf, oder frischer Fisch wird „pro 100 g“ zu einem Satz berechnet, der ein Hauptgericht auf 60 €+ treibt.",
        hack: "C",
        move: "Frag vor der Bestellung nach dem Preis des Fischs und lass dir den Preis pro Portion nennen. Ein coperto ist legal, muss aber auf der Karte stehen — prüf das.",
      },
    ],
    faqs: [
      {
        q: "Wie viel sollte ein Taxi vom Flughafen Rom kosten?",
        a: "Es gibt einen Festpreis von 50 € von Fiumicino zu jedem Ziel innerhalb der Aurelianischen Mauer, Gepäck inklusive. Jedes höhere Angebot eines offiziellen weißen Taxis ist Überteuerung; inoffizielle Fahrer solltest du ganz meiden.",
      },
      {
        q: "Sind die Kolosseum-Ticketverkäufer auf der Straße seriös?",
        a: "Meist nicht. Offizielle Tickets gibt es online und an der eigenen Kasse der Sehenswürdigkeit. Straßenverkäufer schlagen auf, und manche „Touren“ lassen dich trotzdem in der normalen Schlange stehen.",
      },
    ],
  },

  france: {
    intro:
      "Pariser Betrugsmaschen konzentrieren sich stark auf eine Handvoll Sehenswürdigkeiten — Sacré-Cœur, Eiffelturm, Louvre, Pont Neuf — und auf die Metrolinie zum Flughafen. Abseits davon ist die Stadt meist einfach eine Stadt.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Freundschaftsarmband-Männer am Sacré-Cœur",
        how: "Auf den Stufen unterhalb der Basilika greifen Männer nach deinem Handgelenk oder Finger, um ein Armband zu flechten, verlangen dann 10–20 € und lassen deine Hand nicht los, bis du zahlst — oft im Team.",
        hack: "K",
        move: "Hände in den Taschen halten und die Standseilbahn oder Seitentreppen statt der Haupttreppe nehmen. Wirst du gegriffen, zieh die Hand entschlossen weg und geh weiter in Richtung Menschenmenge.",
      },
      {
        name: "Der „Goldring“",
        how: "Jemand bückt sich, „findet“ einen Goldring nahe deinen Füßen, fragt, ob er dir gehört, und bietet ihn dann billig an oder verlangt eine Belohnung. Es ist Messing.",
        hack: "C",
        move: "„Non“ sagen und weitergehen. Jede Reaktion ist schon der Aufhänger, den sie wollen.",
      },
      {
        name: "Petition / „Taubstummen“-Klemmbrett",
        how: "Junge Frauen mit Klemmbrett bitten dich, eine Petition für eine Behinderten-Organisation zu unterschreiben; während du liest, öffnet ein Partner deine Tasche, oder es wird nach der Unterschrift eine bar zu zahlende „Spende“ verlangt.",
        hack: "C",
        move: "Nicht stehen bleiben, das Klemmbrett nicht annehmen. Seriöse Organisationen sammeln an Touristenorten kein Bargeld per Straßenpetition.",
      },
      {
        name: "Hütchenspiel / Karten-Trick",
        how: "Nahe dem Pont Neuf und unter dem Eiffelturm läuft ein schnelles Becher- oder Kartenspiel mit eingeschleusten „Gewinnern“ in der Menge. Du kannst nicht gewinnen, und in der Menge stehen auch Taschendiebe.",
        hack: "H",
        move: "Nie mitspielen, nie stehen bleiben, um zuzuschauen — das Publikum ist genauso Ziel wie der Spieler.",
      },
      {
        name: "Falsches Taxi am Charles de Gaulle",
        how: "Männer sprechen dich in der Ankunftshalle mit „Taxi?“ an und verlangen 90–150 € pauschal für eine Fahrt, die im offiziellen Taxi einen Festpreis von 56 € (rechtes Ufer) oder 65 € (linkes Ufer) hat.",
        hack: "A",
        move: "Ignorier jeden, der innerhalb des Terminals eine Fahrt anbietet. Geh zum markierten Taxistand; der Festpreis ins Zentrum von Paris steht am Fenster.",
      },
      {
        name: "Taschendiebe auf Metrolinie 1 / RER B",
        how: "Teams arbeiten an den sich schließenden Türen auf der Flughafenlinie und rund um Louvre-Rivoli — einer blockiert, einer zieht. Locker gehaltene Handys nahe der Tür sind das Hauptziel.",
        hack: "C",
        move: "Steh mit der Tasche vorm Körper von den Türen entfernt. Halt dein Handy nicht locker nahe einer offenen Tür am Bahnsteig.",
      },
    ],
    faqs: [
      {
        q: "Wie hoch ist der Taxi-Festpreis vom CDG nach Paris?",
        a: "Offizielle Pariser Taxis berechnen pauschal 56 € zum rechten Ufer und 65 € zum linken Ufer, Gepäck inklusive. Wer mehr verlangt oder dich schon im Terminal anspricht, ist kein offizielles Taxi.",
      },
      {
        q: "Wo passieren die meisten Betrugsfälle in Paris?",
        a: "Auf den Stufen des Sacré-Cœur, auf den Rasenflächen am Eiffelturm, rund um den Louvre, am Pont Neuf und auf der RER B / Metrolinie 1. Anderswo in der Stadt kommen sie kaum vor.",
      },
    ],
  },

  mexico: {
    intro:
      "Für Reisende ist das Alltagsrisiko in Mexikos Touristengebieten finanziell, nicht gewaltsam: Kartenbetrug am Automaten, überteuerte Taxis, Timeshare-Druck und angebliche Mietwagenschäden. Die beste Gewohnheit: Fahrdienst-Apps und Bankautomaten nutzen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Geldautomaten-Skimming und „hilfsbereiter“ Kartentausch",
        how: "Freistehende Geldautomaten in Touristenzonen (nicht in Banken) sind mit Skimmern präpariert, oder ein Fremder „hilft“ am Automaten und tauscht deine Karte. Geklonte Karten werden später leergeräumt.",
        hack: "C",
        move: "Nutz Geldautomaten nur innerhalb einer Bankfiliale während der Öffnungszeiten. Deck das Tastenfeld ab, und bricht jemand in deiner Nähe herum, brich ab und geh.",
      },
      {
        name: "Taxi mit „kaputtem Taxameter“ und Umwegen",
        how: "Straßentaxis, besonders vom Flughafen und aus Touristenvierteln, lehnen das Taxameter ab, nennen überhöhte Festpreise oder fahren Umwege. In seltenen Fällen eskaliert das zu einer „Express-Entführung“ mit erzwungenen Geldabhebungen.",
        hack: "K",
        move: "Nutz Uber, DiDi oder den vorausbezahlten Taxischalter am Flughafen, wo du drinnen vorab einen Festpreis zahlst. Wink keine Taxis auf der Straße heran.",
      },
      {
        name: "Timeshare- / „Ferienclub“-Druck",
        how: "An Resort-Flughäfen und in Lobbys bieten „Willkommens“-Mitarbeitende kostenlose Touren, Frühstück oder Transport an und halten dich dann 90 Minuten in einer harten Verkaufsveranstaltung für ein Timeshare mit „nur heute“-Rabatt fest.",
        hack: "H",
        move: "Lehn das „kostenlose“ Angebot am Flughafen ab. Kein echtes Angebot verschwindet, nur weil du den Raum verlässt, um nachzudenken oder Bewertungen zu prüfen.",
      },
      {
        name: "Mietwagenschaden- und Versicherungstricks",
        how: "Am Schalter wird eine teure „Pflicht“-Versicherung zusätzlich zum Gebuchten aufgedrängt, oder bei Rückgabe werden vorhandene Kratzer behauptet und deine Karte ohne Zustimmung belastet.",
        hack: "A",
        move: "Film und fotografier das Auto komplett vor der Abfahrt, mit Zeitstempel. Lass dir jede Schadensforderung schriftlich geben und widersprich der Belastung nötigenfalls bei deinem Kartenanbieter.",
      },
      {
        name: "Polizei-„Bußgeld“ (mordida)",
        how: "Ein Beamter hält dich wegen eines vagen oder erfundenen Vergehens an und schlägt vor, ein Bar-„Bußgeld“ direkt vor Ort zu zahlen, um die Wache oder den Führerschein-Entzug zu vermeiden.",
        hack: "A",
        move: "Bleib ruhig und höflich, verlang einen schriftlichen Bußgeldbescheid („infracción“) und biete an, auf der Wache zu zahlen. Notier Namen und Streifennummer des Beamten.",
      },
      {
        name: "Wechselgeld- und Währungstricks",
        how: "Verkäufer und manche Taxifahrer rechnen in Dollar zu einem schlechten Kurs ab, oder geben Wechselgeld zurück in der Hoffnung, dass du die Scheine nicht kennst. 20- und 500-Peso-Scheine sehen ähnlich aus.",
        hack: "C",
        move: "Vereinbare den Preis in Pesos, zähl das Wechselgeld, bevor du weitergehst, und lern die Scheinfarben gleich am ersten Tag.",
      },
    ],
    faqs: [
      {
        q: "Ist es sicher, in Mexiko Taxis zu nutzen?",
        a: "In Touristengebieten nutz Uber, DiDi oder den vorausbezahlten Schalter am Flughafen, statt auf der Straße zu winken. Das häufige Problem ist Überteuerung; das seltene, aber ernste sind erzwungene Geldabhebungen, was App-Buchungen weitgehend ausschließen.",
      },
      {
        q: "Wie vermeide ich Kartenbetrug in Mexiko?",
        a: "Heb Bargeld nur an Geldautomaten ab, die sich physisch in einer Bankfiliale befinden, während der Geschäftszeiten. Meide freistehende Automaten in Läden, Hotels und auf der Straße — die werden am häufigsten manipuliert.",
      },
    ],
  },

  turkey: {
    intro:
      "Istanbuls Stadtteil Sultanahmet konzentriert die meisten Touristen-Betrugsmaschen: übertrieben freundliche „Guides“, die dich zu einem Laden lotsen, Restaurants ohne Preise und der klassische Schuhputz-Trick. Es geht um Überredung, nicht um Zwang.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Die fallengelassene Schuhputzbürste",
        how: "Ein Schuhputzer vor dir lässt eine Bürste fallen; du hebst sie auf und gibst sie zurück; er besteht darauf, dir „aus Dankbarkeit“ die Schuhe zu putzen, und verlangt dann eine hohe Gebühr.",
        hack: "C",
        move: "Lass ihn seine eigene Bürste aufheben. Fängt er trotzdem an deinen Schuhen an, geh weiter — du hast weder Preis noch Leistung vereinbart.",
      },
      {
        name: "„Lass mich dir meinen Laden zeigen“",
        how: "Ein charmanter Einheimischer kommt ins Gespräch, läuft mit dir mit und führt dich dann zum Teppich-, Schmuck- oder Lederladen eines Verwandten, wo Tee erscheint und Weggehen ohne Kauf sehr unangenehm wird.",
        hack: "C",
        move: "Genieß das Gespräch, aber folg niemandem in einen Laden. „Vielleicht später, danke“ sagen und die Richtung wechseln.",
      },
      {
        name: "Restaurants ohne Preise",
        how: "In Sultanahmet fehlen auf Karten Preise, oder ein Kellner empfiehlt Gerichte und Mezze ohne Preisangabe; die Rechnung ist zwei- bis dreimal so hoch wie normal, mit aufgeschlagenem „Service“ und „Gedeck“.",
        hack: "K",
        move: "Setz dich nur dort hin, wo jede Position einen gedruckten Preis hat. Frag laut nach dem Preis von allem, was der Kellner vorschlägt, bevor es serviert wird.",
      },
      {
        name: "Geldschein-Trick und Umwege im Taxi",
        how: "Du zahlst mit einem 200-Lira-Schein; der Fahrer lässt ihn verschwinden und zeigt einen 20er, du hättest zu wenig gezahlt. Oder das Taxameter läuft tagsüber auf schnellem „Nacht“-Tarif, oder die Route macht Umwege.",
        hack: "H",
        move: "Sag den Wert des Scheins laut, während du ihn übergibst, und fotografier ihn vorher, wenn möglich. Nutz BiTaksi oder Uber und prüf die Route auf deiner eigenen Karte.",
      },
      {
        name: "Die „Raki-Bar“ / Hostessen-Rechnung",
        how: "Männer in der Nähe von Taksim oder der Istiklal-Straße laden dich auf einen Drink ein; drinnen gesellen sich Frauen dazu, Getränke werden bestellt, und am Ende steht eine Rechnung über mehrere hundert Euro, während Türsteher blockieren.",
        hack: "K",
        move: "Folg nie einer Straßeneinladung in eine Bar. Sitzt du schon fest, zahl nur deine eigenen Getränke, fotografier die Karte und geh in Richtung der belebten Istiklal-Straße.",
      },
      {
        name: "Falsche Ticketverkäufer an Sehenswürdigkeiten",
        how: "Vor der Hagia Sophia, der Basilika-Zisterne und dem Topkapı-Palast bieten Verkäufer „ohne Schlange“-Tickets oder Touren mit Aufschlag an, manche ungültig.",
        hack: "H",
        move: "Kauf den Museum Pass oder Zeitfenster-Tickets auf der offiziellen Seite muze.gov.tr. Die echte Überholspur ist dein vorgebuchtes Zeitfenster.",
      },
    ],
    faqs: [
      {
        q: "Sind Restaurants in Istanbul ein Betrugsrisiko?",
        a: "Nur die in Sultanahmet ohne gedruckte Preise, oder wo der Kellner ungefragt Mezze bringt. Überall mit klar bepreister Karte ist es unproblematisch. Bestätige immer den Preis eines empfohlenen Gerichts, bevor es kommt.",
      },
      {
        q: "Wie sollte ich ein Taxi in Istanbul bezahlen?",
        a: "Nutz die BiTaksi- oder Uber-App, damit Preis und Route feststehen. Zahlst du bar, sag den Wert des Scheins laut, während du ihn übergibst, um den Geldschein-Trick zu vermeiden.",
      },
    ],
  },

  egypt: {
    intro:
      "Rund um die Pyramiden, Luxor und die Nilkreuzfahrten hängt an fast jeder Interaktion ein Trinkgeld (baksheesh), und ein paar davon sind reiner Betrug: „kostenlose“ Geschenke, Kamelritte, die zum Absteigen mehr kosten als zum Aufsteigen, und „Ihr Hotel hat geschlossen“-Umleitungen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "„Runter kostet mehr“ — Kamel- und Pferderitte",
        how: "In Gizeh vereinbarst du einen Preis für einen Kamel- oder Pferderitt; bist du erst oben und weit vom Eingang weg, hält der Führer an und verlangt eine viel höhere Summe, um dich zurückzubringen oder beim Absteigen zu helfen.",
        hack: "K",
        move: "Vereinbare den vollen Hin-und-zurück-Preis schriftlich auf deinem Handy, zahl die Hälfte am Anfang und die Hälfte am Tor zurück, und steig erst auf, wenn das klar ist. Noch besser: über dein Hotel buchen.",
      },
      {
        name: "Das „kostenlose Geschenk“",
        how: "Ein Verkäufer drückt dir einen Skarabäus, ein Armband oder ein „Geschenk für deine Frau“ in die Hand oder Tasche, weigert sich, es zurückzunehmen, und verlangt dann hinterherlaufend Bezahlung.",
        hack: "C",
        move: "Halt die Hände geschlossen und sag „nein, danke“, ohne etwas anzunehmen. Ist es schon in der Tasche, leg es auf den Stand zurück und geh.",
      },
      {
        name: "„Ihr Hotel hat geschlossen / ist umgezogen“",
        how: "Ein Taxifahrer oder „hilfsbereiter“ Mann behauptet, dein Hotel sei geschlossen, ausgebucht oder schlecht bewertet, und bringt dich zu einem, das ihm Provision zahlt.",
        hack: "A",
        move: "Ruf dein Hotel direkt an, um das zu bestätigen. Bestehe auf der gebuchten Adresse; ein Fahrer, der nicht dorthin fahren will, ist der Betrug.",
      },
      {
        name: "Papyrus- und Parfüm-„Museums“-Touren",
        how: "Eine Tour oder ein Fahrer plant einen Stopp bei einem „staatlichen Papyrus-Institut“ oder „Parfüm-Museum“ ein — tatsächlich ein Laden mit hartem Verkaufsdruck und überhöhten Preisen für Bananenblatt-„Papyrus“ und verdünnte Öle.",
        hack: "A",
        move: "Sag deinem Guide von vornherein: keine Einkaufsstopps. Hält das Auto trotzdem an, bleib drin sitzen.",
      },
      {
        name: "Baksheesh-Falle an Sehenswürdigkeiten",
        how: "Ein „Wächter“ winkt dich an einer Absperrung vorbei, zeigt dir eine Schnitzerei oder bietet an, ein Foto von dir in einem Grab zu machen, und verlangt dann Trinkgeld und blockiert den Ausgang; manche versuchen auch, an deine Kamera zu kommen.",
        hack: "A",
        move: "Lehn jede ungefragte „Hilfe“ von uniformierten Personen innerhalb einer Anlage ab. Halt dein Handy fest. Ein kleiner Schein beendet die meisten dieser Situationen, wenn du feststeckst.",
      },
      {
        name: "Felucca- und Nilboot-Überteuerung",
        how: "Ein Felucca-Kapitän nennt einen Preis pro Stunde und behauptet dann, es sei pro Person vereinbart gewesen, oder verlängert die Fahrt und berechnet die Extrazeit.",
        hack: "C",
        move: "Schreib Gesamtpreis, Dauer und Personenzahl auf dein Handy und zeig es dem Kapitän vor dem Einsteigen.",
      },
    ],
    faqs: [
      {
        q: "Wie viel Trinkgeld gebe ich in Ägypten?",
        a: "Kleine Trinkgelder (5–20 EGP) sind normal für echten Service — Toilettenpersonal, Hilfe mit Gepäck, eine echte Erklärung. Nicht normal ist, nach ungefragter „Hilfe“ blockiert oder verfolgt zu werden; das ist Betrug, und ein kleiner Schein beendet es meist.",
      },
      {
        q: "Ist der Kamelritt an den Pyramiden Betrug?",
        a: "Nicht grundsätzlich, aber die „Runter kostet mehr“-Variante ist verbreitet. Vereinbare den vollen Hin-und-zurück-Preis, bevor du aufsteigst, zahl die Hälfte vorab und die Hälfte am Tor, oder buch den Ritt über dein Hotel.",
      },
    ],
  },

  greece: {
    intro:
      "Griechenland hat für Reisende wenig Kriminalität, aber Athen hat eine hartnäckige Bar-Masche rund um Syntagma und die Plaka, und Taxis vom Flughafen und den Häfen testen, ob du den Festpreis kennst.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Die Athener Bar- / „freundlicher Einheimischer“-Masche",
        how: "Ein oder zwei freundliche Männer (die oft behaupten, selbst Touristen zu sein) kommen nahe Syntagma oder Monastiraki mit dir ins Gespräch und schlagen eine Bar vor. Frauen setzen sich an deinen Tisch, teure Drinks werden für sie bestellt, und am Ende steht eine Rechnung über hunderte Euro mit Einschüchterung zum Zahlen.",
        hack: "C",
        move: "Lass eine neue Bekanntschaft nicht das Lokal aussuchen. Sitzt du schon drin, weiger dich, für nicht Bestelltes zu zahlen, fotografier die Rechnung und geh Richtung belebter Straße oder zu einem Polizisten.",
      },
      {
        name: "Überteuerung bei Flughafen- und Hafentaxis",
        how: "Fahrer ignorieren den Festpreis von 40 € tagsüber vom Athener Flughafen ins Zentrum (55 € nachts), oder verlangen in Piräus einen Touristen-Pauschalpreis ohne Taxameter.",
        hack: "A",
        move: "Bestätige „Festpreis, vierzig Euro“, bevor du vom Flughafen einsteigst, oder nutz die Metro. In der Stadt besteh auf dem Taxameter („taximetro“).",
      },
      {
        name: "„Fisch nach Kilo“ und Gedeckgebühren im Restaurant",
        how: "Tavernen am Wasser nennen einen Preis pro Kilo für frischen Fisch, ohne ihn vor dir zu wiegen, oder berechnen Brot, Wasser und „Service“ extra, was eine einfache Mahlzeit aufbläht.",
        hack: "C",
        move: "Lass den Fisch vor dem Kochen wiegen und bepreisen. Prüf, ob Brot und Gedeck auf der Karte ausgewiesen sind.",
      },
      {
        name: "Fährticket-Anwerber",
        how: "Nahe Häfen und auf beliebten Inseln verkaufen Leute „letzte Tickets“ für ausgebuchte Fähren mit Aufschlag, oder Tickets für die falsche Abfahrt.",
        hack: "H",
        move: "Kauf am offiziellen Schalter der Fährgesellschaft oder auf einer bekannten Seite (ferryhopper, offizielle Linien). „Ausgebucht“-Druck auf der Straße ist das Erkennungszeichen.",
      },
      {
        name: "„Kostenlose“ Shots und Fotos",
        how: "In Touristen-Nachtleben-Vierteln (Mykonos, Ios, Athen) drückt dir Personal einen „Willkommens“-Shot in die Hand, oder ein Promoter macht ein Foto — danach taucht eine Position auf der Rechnung auf.",
        hack: "C",
        move: "Frag „ist das kostenlos?“, bevor du etwas annimmst, und prüf die Rechnung gegen das, was du tatsächlich bestellt hast.",
      },
    ],
    faqs: [
      {
        q: "Was ist die Bar-Masche in Athen?",
        a: "Freundliche Fremde nahe Syntagma oder Monastiraki laden dich in eine Bar ein, wo sich Frauen an deinen Tisch setzen, teure Drinks bestellt werden und du unter Druck gesetzt wirst, eine sehr hohe Rechnung zu zahlen. Die einfachste Verteidigung: geh nie in eine Bar, die eine gerade erst kennengelernte Person aussucht.",
      },
      {
        q: "Wie viel kostet ein Taxi vom Athener Flughafen ins Zentrum?",
        a: "Es gibt einen Festpreis von 40 € tagsüber und 55 € nachts ins Zentrum. Vereinbare diesen Betrag, bevor du einsteigst, oder nimm die Metro, die direkt vom Flughafen fährt.",
      },
    ],
  },

  vietnam: {
    intro:
      "Vietnams Betrugsmaschen sind klein und häufig: manipulierte Taxameter, angebliche Schäden bei Motorrad-Verleihern und Rechnungen, die zwischen Bestellung und Bezahlung wachsen. Fahrdienst-Apps und ein Blick auf die Scheine räumen die meisten davon aus.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Manipulierte Taxameter und falsche Firmen",
        how: "Taxis an Flughäfen und in Touristengebieten lassen das Taxameter zwei- bis fünfmal zu schnell laufen, oder nutzen Namen und Farben, die den seriösen Firmen (Vinasun, Mai Linh) fast gleichen.",
        hack: "H",
        move: "Nutz Grab oder Xanh SM (die App legt den Preis fest). Musst du ein Straßentaxi nehmen, nur Vinasun oder Mai Linh, und behalte das Taxameter im Vergleich zu deiner Karte im Blick.",
      },
      {
        name: "Motorrad-Verleih-Schaden und Pass-Einbehalt",
        how: "Du mietest einen Roller, hinterlegst deinen Pass als Kaution, und bei Rückgabe findet der Laden „neue“ Schäden oder behauptet, das Motorrad sei von deinem Parkplatz gestohlen worden — und behält den Pass, bis du zahlst.",
        hack: "K",
        move: "Gib nie deinen Pass her — zahl eine Barkaution. Film das Motorrad vor der Fahrt im Detail und nutz dein eigenes Schloss.",
      },
      {
        name: "Scheinverwechslung (20.000 vs. 500.000 Dong)",
        how: "Mehrere vietnamesische Scheine ähneln sich farblich. Fahrer und Verkäufer geben zu wenig Wechselgeld oder behaupten, du hättest mit einem 20k-Schein statt 500k gezahlt.",
        hack: "C",
        move: "Trenn große Scheine in einer eigenen Tasche. Zähl beim Bezahlen langsam und sag den Betrag; zähl das Wechselgeld, bevor du weitergehst.",
      },
      {
        name: "„Übe mein Englisch“-Café-Rechnung",
        how: "Ein freundlicher Student in Hanoi oder Ho-Chi-Minh-Stadt will Englisch üben, schlägt ein Café oder eine Bar vor, und am Ende zahlst du eine überteuerte Rechnung — manchmal mit „Hostessen“-Gebühren.",
        hack: "C",
        move: "Unterhalte dich an einem öffentlichen Ort, nicht an einem, den die Person aussucht. Gehst du irgendwohin, wähl selbst den Ort und sieh vorher die Preise.",
      },
      {
        name: "Cyclo (xích lô)-Preis nach der Fahrt",
        how: "Ein Cyclo-Fahrer vereinbart einen niedrigen Preis und besteht am Ende darauf, er gelte pro Person, in Dollar oder für nur einen Bruchteil der tatsächlich gefahrenen Strecke.",
        hack: "H",
        move: "Schreib Preis, Währung und Route auf dein Handy und zeig es dem Fahrer vor der Fahrt. Vereinbare, dass es der Gesamtpreis ist.",
      },
      {
        name: "Schuhputz- und Kokosnussverkäufer-Griff",
        how: "Ein Schuhputzer beginnt ungefragt, deine Sandale zu „reparieren“, oder ein Straßenverkäufer legt dir sein Tragejoch und Hut für ein Foto auf die Schulter und verlangt dann Bezahlung.",
        hack: "C",
        move: "Zieh den Fuß zurück; lass dir nichts auflegen. Keine Vereinbarung, keine Zahlung — geh weiter.",
      },
    ],
    faqs: [
      {
        q: "Sind Taxis in Vietnam sicher?",
        a: "Die seriösen Firmen (Vinasun, Mai Linh) sind in Ordnung, aber viele Taxis lassen das Taxameter schnell laufen oder ahmen diese Marken nach. Grab und Xanh SM legen den Preis in der App fest und sind der einfachste Weg, das Problem zu umgehen.",
      },
      {
        q: "Soll ich meinen Pass hinterlegen, um in Vietnam ein Motorrad zu mieten?",
        a: "Nein. Ein einbehaltener Pass ist der Hebel für eine erfundene Schadens- oder „gestohlenes Motorrad“-Forderung bei Rückgabe. Biete eine Barkaution an, film das Motorrad vor der Fahrt und nutz ein Schloss.",
      },
    ],
  },

  indonesia: {
    intro:
      "Auf Bali sind die wiederkehrenden Probleme Taschenspielertricks bei Geldwechslern, Schadensforderungen bei Rollerverleihern und Probleme an Geldautomaten. Anderswo ist das Muster ähnlich. Autorisierte Wechselstuben und App-gebuchte Fahrten lösen das meiste davon.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Geldwechsler-Unterschlagung beim Zählen",
        how: "Ein Wechsler mit einem auffällig guten Kurs lenkt dich mitten im Zählen ab, faltet Scheine zurück oder nutzt einen manipulierten Taschenrechner, sodass du mit deutlich weniger als vereinbart weggehst.",
        hack: "C",
        move: "Nutz nur Wechsler mit „PT“-Kennzeichnung / Lizenz, zähl den vollen Betrag selbst, bevor du deine Dollar übergibst, und lass sie den gezählten Stapel nicht erneut anfassen.",
      },
      {
        name: "Rollerverleih-Schaden und Pass-Einbehalt",
        how: "Der Verleih behält deinen Pass ein und zeigt bei der Rückgabe auf Kratzer (oft schon vorhanden), verlangt eine hohe „Reparatur“-Gebühr, oder behauptet, das Motorrad sei gestohlen worden.",
        hack: "K",
        move: "Hinterleg eine Barkaution, nicht den Pass. Fotografier und film jedes Teil vor der Fahrt, mit dem Besitzer dabei.",
      },
      {
        name: "Geldautomaten-Skimming und „Karte eingezogen“",
        how: "Automaten in Kuta, Seminyak und Canggu sind manipuliert, oder ein Gerät behält deine Karte ein, während eine „hilfsbereite“ Person deine PIN-Eingabe beobachtet und die Karte holt, nachdem du gegangen bist.",
        hack: "C",
        move: "Nutz Geldautomaten an einer Bankfiliale, bei Tageslicht. Wird eine Karte eingezogen, ruf sofort deine Bank an und bleib am Automaten.",
      },
      {
        name: "Taxi-Kartell gegen Grab/Gojek",
        how: "In manchen Gegenden blockieren oder bedrängen lokale Taxigruppen App-Fahrer und verlangen von Touristen ein Vielfaches des App-Preises, ohne Taxameter.",
        hack: "A",
        move: "Buch Grab oder Gojek und triff den Fahrer bei Spannungen ein kurzes Stück vom Taxistand entfernt. Kenn den App-Preis, um ein Bar-Angebot einschätzen zu können.",
      },
      {
        name: "„Ihre Karte wurde abgelehnt“ — Doppelbelastung",
        how: "Ein Laden oder Restaurant sagt, die erste Kartenzahlung sei fehlgeschlagen, und zieht sie erneut ein; beide gehen durch, oder eine Trinkgeld-Zeile wird nach deiner Unterschrift geändert.",
        hack: "K",
        move: "Beobachte das Terminal, heb jeden Beleg auf und prüf deinen Kontoauszug täglich. Widersprich Doppelbuchungen sofort.",
      },
      {
        name: "Bootsüberteuerung zu den Gili-Inseln",
        how: "Anwerber verkaufen „Schnellboot“-Tickets zu überhöhten Preisen, überbuchen Abfahrten, oder „Versicherung“ und „Hafensteuer“ tauchen erst am Anleger als Zuschlag auf.",
        hack: "H",
        move: "Buch bei einem etablierten Anbieter online, bestätige, dass der Gesamtpreis Steuern enthält, und behalt die Buchungsbestätigung auf dem Handy.",
      },
    ],
    faqs: [
      {
        q: "Wie vermeide ich Betrug bei Geldwechslern auf Bali?",
        a: "Nutz nur autorisierte Wechsler (sie zeigen „PT“ und eine Lizenz), meide Angebote mit einem Kurs weit über dem Markt, zähl dein Geld vollständig, bevor du deine Währung übergibst, und lass die Kassenkraft den gezählten Stapel nicht erneut anfassen.",
      },
      {
        q: "Ist es sicher, auf Bali einen Roller zu mieten?",
        a: "Ja, wenn du eine Barkaution statt deines Passes hinterlegst und den Zustand des Motorrads vor der Fahrt filmst. Pass als Kaution ist genau das, was die überhöhte Schadensforderung bei Rückgabe ermöglicht.",
      },
    ],
  },

  morocco: {
    intro:
      "In Marrakesch und Fès drehen sich die Medina-Betrugsmaschen um Orientierung: inoffizielle „Guides“, die sich an dich hängen, „hier ist gesperrt“-Umleitungen zu Läden, und Gerbereien, die du nicht besuchen wolltest. Bestimmte Höflichkeit löst das meiste.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Inoffizielle „Guides“ in der Medina",
        how: "Ein junger Mann bietet Wegbeschreibungen an oder „übt nur Englisch“, läuft mit dir durch die Souks und verlangt dann am Ziel eine hohe, manchmal aggressiv eingeforderte Gebühr.",
        hack: "C",
        move: "Lehn klar ab und lass dich von niemandem irgendwohin begleiten. Hängt sich trotzdem jemand an, bleib stehen, sag „kein Guide, danke“ und geh in einen Laden, bis die Person weg ist.",
      },
      {
        name: "„Diese Straße ist gesperrt / der Platz ist da lang“",
        how: "Jemand behauptet, der Weg sei blockiert, es gebe ein Fest, oder die Gerberei sei nur jetzt geöffnet, und lenkt dich zum Laden eines Verwandten oder zu einem Aussichtspunkt, der dann Trinkgeld verlangt.",
        hack: "H",
        move: "Nutz die Karte auf deinem Handy und vertrau ihr. Straßen in der Medina sind selten gesperrt; die Umleitung ist der Betrug.",
      },
      {
        name: "Henna-Griff",
        how: "Frauen auf dem Jemaa el-Fnaa nehmen deine Hand und beginnen mit Henna, bevor du zustimmst, und verlangen dann einen hohen Preis für ein Design, das du nicht wolltest (und das Henna kann schwarzes „PPD“ sein, das Verätzungen verursachen kann).",
        hack: "K",
        move: "Halt die Hände außer Reichweite und bleib nicht stehen. Hat es schon begonnen, zieh die Hand weg — du bist zu keiner Zahlung für eine ungefragte Leistung verpflichtet.",
      },
      {
        name: "Taxi „ohne Taxameter“ und Sammeltaxi-Überteuerung",
        how: "Petit Taxis lehnen das Taxameter („compteur“) ab und nennen einen Touristen-Pauschalpreis; Grand Taxis berechnen dir auch leere Sitzplätze.",
        hack: "A",
        move: "Besteh auf dem Taxameter oder vereinbare den Preis vorher. Kenn den ungefähren örtlichen Preis (kurze Stadtfahrten kosten wenige Dirham).",
      },
      {
        name: "Foto-Gebühr auf dem Platz",
        how: "Schlangenbeschwörer, Affenführer und Wasserverkäufer auf dem Jemaa el-Fnaa posieren oder setzen dir ein Tier auf, und verlangen dann 100–200 Dirham pro Person für Fotos.",
        hack: "H",
        move: "Vereinbare den Preis laut vor jedem Foto, oder lass dich gar nicht erst darauf ein. Ist dir schon ein Tier aufgesetzt worden, gib einen kleinen Schein und tritt zurück.",
      },
      {
        name: "Teppich- und Argan-Öl-Hartverkauf",
        how: "Minztee und Gastfreundschaft gehen einer langen, druckvollen Verkaufsrunde voraus, in der Weggehen ohne Kauf als Beleidigung dargestellt wird, und Preise beim Fünf- bis Zehnfachen des fairen Werts starten.",
        hack: "C",
        move: "Du kannst Tee annehmen und trotzdem Nein sagen. Leg deine Obergrenze fest, bevor du reingehst, und sei bereit, mitten im Verkaufsgespräch zu gehen.",
      },
    ],
    faqs: [
      {
        q: "Brauch ich einen Guide für die Medina von Marrakesch?",
        a: "Zum Bummeln nicht — die Karte auf deinem Handy funktioniert. Willst du einen Guide, buch einen lizenzierten über dein Riad oder eine registrierte Agentur. Die Männer, die dich auf der Straße ansprechen, sind nicht lizenziert und verlangen am Ende eine hohe Gebühr.",
      },
      {
        q: "Ist das Henna auf dem Jemaa el-Fnaa sicher?",
        a: "Vereinbare es vorher an einem Stand und bitte um natürliches (braunes) Henna, nicht schwarzes. Schwarzes „Henna“ enthält oft den Farbstoff PPD, der chemische Verätzungen und bleibende Narben verursachen kann. Lass niemanden ungefragt an deiner Hand anfangen.",
      },
    ],
  },

  india: {
    intro:
      "In Delhi, Agra und Jaipur zielen die Betrugsmaschen auf Ankommende: „Ihr Hotel hat geschlossen“-Taxiumleitungen, falsche Touristenbüros nahe dem Bahnhof und die Edelstein-Export-„Geschäftsmöglichkeit“. Vorgebuchter Transport nimmt das meiste Risiko raus.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "„Ihr Hotel hat geschlossen / ist abgebrannt“",
        how: "Ein Vorausbezahlt-Taxi- oder Auto-Fahrer vom Delhi-Flughafen oder Bahnhof behauptet, dein Hotel sei geschlossen, ausgebucht oder in einem „Unruhegebiet“, und bringt dich zu einem, das ihm Provision zahlt — oft nach einem Stopp bei einem „Reisebüro“.",
        hack: "A",
        move: "Ruf dein Hotel an, um zu bestätigen, dass es geöffnet ist, und lass es mit dem Fahrer sprechen. Bestehe auf der gebuchten Adresse; lehn jeden „kurzen Stopp“ ab.",
      },
      {
        name: "Falsche Touristeninformationsbüros",
        how: "Nahe dem Bahnhof New Delhi und dem Connaught Place verkaufen Büros mit Aufschrift „Government Tourist Office“ oder „India Tourism“ überteuerte Touren und Zugtickets und behaupten, das echte Büro sei geschlossen oder umgezogen.",
        hack: "A",
        move: "Die einzige offizielle Stelle ist „Incredible India“ / das Tourismusministerium, und die verkauft keine Touren. Buch Züge über IRCTC oder dessen App.",
      },
      {
        name: "Edelstein- / Teppich-„Exportgeschäft“",
        how: "Ein freundlicher Kontakt in Jaipur oder Agra bietet ein Geschäft an: Edelsteine oder Teppiche kaufen, nach Hause verschicken lassen, ein „Partner“ im Ausland verkauft sie angeblich mit riesigem Gewinn weiter. Die Steine sind fast wertlos, der Partner existiert nicht.",
        hack: "C",
        move: "Diese Gelegenheit gibt es nicht. Kauf nie Waren zum „Weiterverkauf“ auf das Versprechen eines Fremden hin, und lass nie einen Laden einen Kauf für dich verschicken.",
      },
      {
        name: "Auto-Rikscha „Taxameter kaputt“ und Provisionsstopps",
        how: "Fahrer lehnen das Taxameter ab, nennen einen Pauschalpreis, oder bieten einen billigen Tagessatz an und verbringen ihn damit, dich zu Läden zu fahren, die pro Kopf Provision zahlen.",
        hack: "H",
        move: "Nutz Uber oder Ola. Nimmst du eine Rikscha, vereinbare den Preis vorher und sag „keine Läden“ — ein Fahrer, der trotzdem Umwege macht, bringt dich nicht ans Ziel.",
      },
      {
        name: "Taj Mahal und Denkmal-„Guides“ und Fotogebühren",
        how: "Unlizenzierte Guides hängen sich am Tor an, „Helfer“ bieten an, dein Foto vom „besten Punkt“ zu machen, und verlangen dann Bezahlung, und Verkäufer folgen dir mit steigenden Preisen.",
        hack: "H",
        move: "Buch Tickets online (asi.payumoney / offiziell). Engagier nur ASI-lizenzierte Guides (sie tragen einen Foto-Ausweis). Behalt dein eigenes Handy in der Hand.",
      },
      {
        name: "„Holi- / Tempelsegen“, dann Spendenforderung",
        how: "Ein Priester oder Betreuer bindet einen Faden, bietet einen Segen oder einen Bindi „umsonst“ an, und verlangt dann eine hohe „Spende“ mit genannter Summe.",
        hack: "C",
        move: "Lehn den Faden oder Segen ab, wenn du nicht spenden willst. Hast du schon zugestimmt, reicht ein kleiner Schein; ignorier die genannte Summe.",
      },
    ],
    faqs: [
      {
        q: "Ist die „Ihr Hotel hat geschlossen“-Masche in Indien verbreitet?",
        a: "Ja, besonders bei der Ankunft vom Delhi-Flughafen und dem Bahnhof New Delhi. Ein Fahrer behauptet, dein Hotel sei geschlossen oder unsicher, und bringt dich zu einer Alternative, die Provision zahlt. Ruf dein Hotel zur Bestätigung an und lehn jede Umleitung ab.",
      },
      {
        q: "Wie buche ich Zugtickets in Indien, ohne betrogen zu werden?",
        a: "Nutz die offizielle IRCTC-Website oder -App, oder die Schalter im Bahnhof selbst. „Touristenbüros“ nahe dem Bahnhof, die anbieten, Züge für dich zu buchen, sind nicht offiziell und schlagen kräftig auf.",
      },
    ],
  },

  portugal: {
    intro:
      "Lissabon ist eine Stadt mit wenig Kriminalität, wo die größten Ärgernisse Taschendiebe in der Tram 28, falsche Drogenverkäufer und das ungefragte couvert beim Abendessen sind. Porto ist noch ruhiger.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taschendiebe in Tram 28 und an der Santa Justa",
        how: "Lissabons Touristen-Tram 28 und die Schlangen an beliebten Aussichtspunkten werden von Taschendieb-Teams bearbeitet — einer drängt, einer zieht —, besonders wenn die Tram voll wird und an Haltestellen.",
        hack: "C",
        move: "Halt Taschen zu und vorne am Körper, Handy in der Vordertasche. Sei besonders wachsam, wenn die Tram voll ist und beim Einsteigen.",
      },
      {
        name: "„Haschisch? Kokain?“ — Straßenverkäufer",
        how: "Männer auf der Rua Augusta und rund ums Bairro Alto bieten laut Drogen an; was sie verkaufen, ist gefälscht (Kräuter, zermahlenes Aspirin). Es ist Abzocke, und der Kauf zieht Polizeiaufmerksamkeit an.",
        hack: "K",
        move: "Ein bestimmtes „nein“ und weitergehen. Das Produkt ist gefälscht, und die Interaktion führt zu nichts Gutem.",
      },
      {
        name: "Restaurant-couvert",
        how: "Brot, Oliven, Käse oder Sardinenpastete kommen ungefragt zu Beginn des Essens und tauchen auf der Rechnung auf. Das ist in Portugal legal, wenn es auf der Karte steht — aber Touristenlokale nutzen das gern aus.",
        hack: "C",
        move: "Du kannst es ablehnen („não, obrigado“) und unberührt zurückgeben. Prüf den couvert-Preis auf der Karte, damit es keine Überraschung auf der Rechnung ist.",
      },
      {
        name: "Flughafen-Taxi mit Umweg",
        how: "Vom Flughafen Lissabon nehmen manche Fahrer einen Umweg oder berechnen inoffizielle „Gepäck“- und „Nacht“-Zuschläge über die kleinen legalen hinaus.",
        hack: "A",
        move: "Nutz die Metro (rote Linie) oder Bolt/Uber, oder nimm ein Taxi vom offiziellen Stand und verfolg die Route auf deiner Karte. Legale Zuschläge sind wenige Euro.",
      },
      {
        name: "Ferienwohnungs-Inseratsbetrug",
        how: "Eine billige zentrale Wohnung verlangt eine Kaution oder Vollzahlung per Überweisung oder Geschenkkarte, bevor du sie sehen oder einen Zugangscode bekommen kannst.",
        hack: "K",
        move: "Buch über eine Plattform, die das Geld bis zum Check-in hält. Keine Überweisung, kein Krypto, keine Geschenkkarten für Unterkünfte.",
      },
    ],
    faqs: [
      {
        q: "Muss ich für Brot und Oliven in einem portugiesischen Restaurant bezahlen?",
        a: "Nur wenn du sie isst. Das couvert ist legal, wenn es auf der Karte steht, aber du kannst es ablehnen und unberührt zurückgeben, ohne dass es berechnet wird. Prüf den Kartenpreis, damit es keine Überraschung auf der Rechnung ist.",
      },
      {
        q: "Ist Lissabon sicher für Touristen?",
        a: "Sehr, was Gewaltverbrechen angeht. Die realistischen Risiken sind Taschendiebstahl in Tram 28 und an Aussichtspunkten sowie falsche Drogenverkäufer in der Innenstadt — beides vermeidbar mit einfacher Taschenkontrolle und einem bestimmten Nein.",
      },
    ],
  },

  "united-kingdom": {
    intro:
      "Londons Touristen-Betrugsmaschen sind vor allem Straßenspiele und Handy-Diebstahl per Moped, dazu ein altbekanntes Problem mit falschen Black Cabs. Der zu nah gehaltene Kartenleser und die „Spenden“-Sammler auf der Oxford Street runden es ab.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Hütchenspiel / „find the lady“",
        how: "Auf der Westminster Bridge, nahe dem London Eye und entlang der Oxford Street läuft ein schnelles Karten- oder Becherspiel mit eingeschleusten Gewinnern. Du kannst nicht gewinnen, und in der Menge stehen auch Taschendiebe.",
        hack: "H",
        move: "Nicht mitspielen und nicht stehen bleiben, um zuzuschauen. Der ganze Aufbau — Dealer, Aufpasser, „Gewinner“, Zuschauer — ist ein Team.",
      },
      {
        name: "Handy-Diebstahl per Moped oder Fahrrad",
        how: "Fahrer fahren auf den Gehweg und greifen sich Handys von Leuten, die sie nahe der Bordsteinkante nutzen, besonders um Camden, Shoreditch, Kensington und entlang der South Bank.",
        hack: "K",
        move: "Steh nicht mit dem Handy in der Hand nahe der Straße. Tritt an eine Hauswand zurück, um die Karte zu checken, und steck es beim Gehen in eine geschlossene Tasche.",
      },
      {
        name: "Falsche und nicht gebuchte Minicabs",
        how: "Autos vor Bahnhöfen, Clubs und Flughäfen bieten „Taxi?“ an — sie sind unversichert, ohne Taxameter, überteuert, und manche sind unsicher. Nur Black Cabs dürfen legal auf der Straße Fahrgäste aufnehmen.",
        hack: "A",
        move: "Nutz ein Black Cab (winken oder am Stand) oder ein vorgebuchtes lizenziertes Minicab über eine App. Steig nie in ein Auto, das dich angesprochen hat.",
      },
      {
        name: "„Spenden“-Sammler auf der Oxford Street",
        how: "Aggressive Sammler mit Warnwesten und Klemmbrettern oder Sammelbüchsen drängen Touristen zu Bar-„Spenden“ oder Karten-Abos; manche sind reine Fälschungen, andere behalten den Großteil des Gesammelten.",
        hack: "C",
        move: "Echte Wohltätigkeitsorganisationen bedrängen dich nicht und machen kein schlechtes Gewissen. Geh weiter; spend direkt an eine registrierte Organisation, wenn du willst.",
      },
      {
        name: "Zu nah gehaltenes Kontaktlos-Terminal",
        how: "Ein Verkäufer oder falscher Sammler hält ein Kartenlesegerät gegen deine Tasche, um eine kontaktlose Zahlung auszulösen, oder berechnet zu viel und drängt dich am Betrag auf dem Display vorbei.",
        hack: "K",
        move: "Sieh dir immer den Betrag auf dem Display an, bevor du tippst. Bewahr Karten in einer RFID-Hülle oder nicht außen an der Tasche auf.",
      },
      {
        name: "Ticket-Weiterverkaufsbetrug",
        how: "„Übrig“-Ticketverkäufer vor West-End-Theatern, Fußballstadien und Konzerten verkaufen Fälschungen, Duplikate oder gar nichts, nachdem sie das Bargeld genommen haben.",
        hack: "H",
        move: "Kauf an der offiziellen Kasse oder beim benannten Wiederverkaufspartner der Location. Ein auf dem Gehweg gekauftes Ticket ist ein Glücksspiel.",
      },
    ],
    faqs: [
      {
        q: "Sind Black Cabs in London sicher?",
        a: "Ja — lizenzierte Black Cabs sind die einzigen Fahrzeuge, die dich von der Straße aufnehmen dürfen. Jedes andere Auto, das eine Fahrt anbietet, besonders an Bahnhöfen oder Flughäfen, ist nicht gebucht und sollte abgelehnt werden. Buch Minicabs vorab über eine App.",
      },
      {
        q: "Wie verbreitet ist Handy-Diebstahl in London?",
        a: "Verbreitet genug, um ein bekanntes Problem in Zentral- und Ost-London zu sein. Diebe auf Mopeds oder Fahrrädern greifen sich Handys von Leuten, die nahe der Straße stehen. Prüf deine Karte mit dem Rücken zur Wand und steck das Handy vor dem Losgehen ein.",
      },
    ],
  },

  "united-states": {
    intro:
      "Für Reisende sind die Risiken in den USA kostümierte Figuren, die auf Touristenplätzen Geld verlangen, unlizenzierte „Fahrten“ an Flughäfen, aggressive Timeshare- und „Gratis-Kreuzfahrt“-Angebote sowie Maut- und Resort-Gebühren-Überraschungen auf der Rechnung.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Kostümierte Figuren am Times Square / in Hollywood",
        how: "Als Superhelden, Elmo oder die Freiheitsstatue verkleidete Personen posieren mit Touristen (besonders Kindern) und verlangen dann 20–40 $ pro Person, werden bei Ablehnung teils einschüchternd.",
        hack: "H",
        move: "Vereinbare den Preis laut vor jedem Foto, oder lass dich gar nicht darauf ein. Ist schon posiert worden, gib insgesamt ein paar Dollar und geh weiter.",
      },
      {
        name: "Unlizenzierte Flughafen-„Fahrten“",
        how: "An JFK, LAX, Miami und Las Vegas bieten Männer in der Ankunftshalle ein „Taxi“ oder einen „Town Car“ an und berechnen zwei- bis viermal den Taxameter- oder App-Preis, manchmal mit Zuschlägen am Ziel.",
        hack: "A",
        move: "Ignorier jeden, der drinnen eine Fahrt anbietet. Nutz die offizielle Taxi-Schlange oder eine App-Abholung von der markierten Rideshare-Zone.",
      },
      {
        name: "„Sie haben eine Gratis-Kreuzfahrt gewonnen“",
        how: "Ein Stand, Anruf oder Rubbellos behauptet, du hättest eine Bahamas-Kreuzfahrt oder einen Resort-Aufenthalt gewonnen; die Einlösung bedeutet eine lange Timeshare-Präsentation, Buchungsgebühren und ein Paket, das weit weniger wert ist als versprochen.",
        hack: "C",
        move: "Du hast nicht teilgenommen, also hast du nicht gewonnen. Geh vom Stand weg; leg beim Anruf auf.",
      },
      {
        name: "CD- / Mixtape-Übergabe",
        how: "Jemand drückt dir eine CD in die Hand, fragt nach deinem Namen, schreibt ihn „als Geschenk“ auf die Hülle und verlangt dann 10–20 $, folgt dir dabei — oft im Team nahe Times Square und Venice Beach.",
        hack: "C",
        move: "Halt die Hände unten und nimm sie nicht an. Ist sie schon in deiner Hand, leg sie ab und geh weiter — ein „Geschenk“ mit Preis ist kein Geschenk.",
      },
      {
        name: "Resort-Gebühren und versteckte Mietwagenkosten",
        how: "Hotels bewerben einen Nachtpreis und berechnen beim Check-in eine verpflichtende „Resort-Gebühr“ von 30–50 $; Mietwagenschalter drängen vorausbezahltes Benzin, Maut-Transponder und Versicherungen auf, die du eventuell schon hast.",
        hack: "A",
        move: "Prüf den Gesamtpreis mit Steuern und Gebühren vor der Buchung. Am Mietwagenschalter lehn Extras ab und sag, du nutzt deine eigene Versicherung und zahlst Maut direkt.",
      },
      {
        name: "Enkel- / Finanzamt- / Haftbefehl-Telefonbetrug",
        how: "Anrufer geben sich als Enkelkind im Gefängnis, als Finanzbehörde oder als Polizei mit Haftbefehl aus und verlangen Zahlung per Geschenkkarte, Überweisung oder Krypto, um eine Festnahme zu vermeiden. Nummern werden gefälscht, um offiziell zu wirken.",
        hack: "A",
        move: "Keine echte Behörde nimmt Geschenkkarten. Leg auf und ruf die Person oder Behörde unter einer selbst recherchierten Nummer zurück an.",
      },
    ],
    faqs: [
      {
        q: "Muss ich die kostümierten Figuren am Times Square bezahlen?",
        a: "Nein. Sie setzen darauf, dass sich Leute nach einem Foto verpflichtet fühlen, besonders mit Kindern. Vereinbare einen Preis vor jedem Foto oder lehn einfach ab. Ist schon posiert worden, beenden es ein paar Dollar.",
      },
      {
        q: "Was ist eine Resort-Gebühr?",
        a: "Eine verpflichtende Tagesgebühr (oft 30–50 $), die viele US-Hotels zusätzlich zum beworbenen Zimmerpreis berechnen, angeblich für WLAN, Fitnessraum und Pool. Sie steht im Kleingedruckten — prüf immer den Gesamtpreis vor der Buchung.",
      },
    ],
  },

  "united-arab-emirates": {
    intro:
      "Dubai und Abu Dhabi haben wenig Kriminalität, aber die Geldfallen sind real: Taxis, die das Taxameter umgehen, Fälschungen im Gold-Souk, Mietwagen-Bußgelder, die Wochen später auftauchen, und Hartverkauf-Feriencubs in Einkaufszentren.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxameter-Verweigerung und Warteschlangen-Vordrängeln am Flughafen",
        how: "Manche Fahrer nennen einen Pauschalpreis statt des Taxameters, besonders vom Flughafen, der Dubai Mall und der Marina, oder „Helfer“ lotsen dich zu einem wartenden Auto außerhalb des offiziellen Standes zum Aufpreis.",
        hack: "A",
        move: "Nimm nur Taxis vom offiziellen Stand und besteh auf dem Taxameter („meter, please“). Careem und Uber legen den Preis fest, falls du nicht verhandeln willst.",
      },
      {
        name: "Gold- und Uhren-„Souk“-Fälschungen",
        how: "Im Deira-Gold-Souk und drumherum bieten Verkäufer Gold zum „Sonderpreis“ an, das untergewichtig oder niedrigkarätig ist, und „echte“ Markenuhren und -taschen, die gefälscht sind.",
        hack: "C",
        move: "Kauf Gold nur in Läden, die es vor dir wiegen und eine gestempelte Quittung mit Karat und Tagesgoldpreis geben. Wirkt der Preis zu großzügig, ist es der Betrug.",
      },
      {
        name: "Mietwagen-Bußgelder Wochen später",
        how: "Salik-Mautgebühren, Geschwindigkeitsstrafen und Parktickets werden der Mietwagenfirma in Rechnung gestellt und an deine Karte weitergegeben, oft mit Bearbeitungsgebühr, lange nachdem du das Land verlassen hast.",
        hack: "K",
        move: "Fotografier Kilometerstand und Tankfüllung bei Abholung und Rückgabe, heb den Vertrag auf und prüf deinen Kontoauszug noch einen Monat danach. Widersprich jeder Belastung ohne passende Bußgeld-Referenz.",
      },
      {
        name: "„Ferienclub“ im Einkaufszentrum und Gewinn-Rubbellose",
        how: "Kioske in Einkaufszentren verteilen Rubbellose, die immer einen Urlaub oder ein Gadget „gewinnen“; die Einlösung bedeutet eine 90-minütige Timeshare-artige Präsentation und Druck, noch am selben Tag eine Mitgliedschaft zu unterschreiben.",
        hack: "H",
        move: "Nimm das Rubbellos nicht an. Bist du schon im Raum: Kein echtes Angebot läuft ab, nur weil du rausgehst, um nachzudenken.",
      },
      {
        name: "Creek-Abra- und Wüstensafari-Anwerber",
        how: "Unlizenzierte Anbieter nahe dem Dubai Creek oder vor Hotels verkaufen „private“ Abra-Überfahrten oder Wüstensafaris zu überhöhten Preisen, manchmal ohne Versicherung oder mit viel kürzerer Fahrt als beschrieben.",
        hack: "C",
        move: "Nutz die markierten öffentlichen Abra-Stationen (eine Überfahrt kostet 1 Dirham) und buch Safaris über dein Hotel oder einen lizenzierten Anbieter mit Bewertungen.",
      },
    ],
    faqs: [
      {
        q: "Sind Taxis in Dubai sicher und mit Taxameter?",
        a: "Offizielle RTA-Taxis sind sicher und haben ein Taxameter. Das Problem sind gelegentliche Fahrer, die stattdessen einen Pauschalpreis nennen — besteh auf dem Taxameter, oder nutz Careem oder Uber. Nimm Taxis nur von offiziellen Ständen, nicht von Autos, die dich ansprechen.",
      },
      {
        q: "Bekomme ich nach der Rückgabe eines Mietwagens in den VAE ein Bußgeld?",
        a: "Möglich. Salik-Maut und Verkehrsstrafen werden der Mietwagenfirma in Rechnung gestellt und später an deine Karte weitergegeben, manchmal mit Bearbeitungsgebühr. Heb Vertrag und Fotos auf und prüf deinen Kontoauszug noch einige Wochen nach der Reise.",
      },
    ],
  },

  japan: {
    intro:
      "Japan ist eines der sichersten Länder für Reisende, und Straßenbetrug ist selten. Die Ausnahme sind die Nachtleben-Anwerber in Tokios Kabukicho und Roppongi, wo überhöhte Rechnungen und gelegentlich präparierte Drinks ein echtes Risiko sind.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Bar-Anwerber in Kabukicho / Roppongi",
        how: "Anwerber auf der Straße laden dich in eine „Bar“ oder einen „Club“ mit günstigen Drinks und Gesellschaft ein. Drinnen werden Getränke zu extremen Preisen abgerechnet, „Eintritt“ und „Sitzplatz“-Gebühren tauchen auf, und Personal drängt oder blockiert dich, bis du zahlst — Karten werden manchmal über tausende Euro belastet.",
        hack: "K",
        move: "Folg nie einem Straßenanwerber in eine Bar in Kabukicho oder Roppongi. Wähl dein eigenes Lokal mit sichtbaren Preisen. Steckst du fest, besteh darauf, nur das Bestellte zu zahlen, und ruf notfalls 110 (Polizei) an.",
      },
      {
        name: "Präparierte Drinks in Anwerber-Bars",
        how: "In denselben Nachtleben-Vierteln präparieren manche Lokale Getränke, sodass Gäste hohe Zahlungen autorisieren, an die sie sich nicht erinnern, oder ohne Geld und Karten aufwachen.",
        hack: "K",
        move: "Trink nur dort, wo du selbst hingegangen bist und die Bar einsehen kannst. Beobachte, wie dein Getränk zubereitet wird, und lass es nie unbeaufsichtigt.",
      },
      {
        name: "„Mönch“ verkauft Armbänder oder Segen",
        how: "Als buddhistische Mönche gekleidete Personen nahe Touristenorten in Tokio und Kyoto bieten ein Armband oder eine „Segens“-Karte an und drängen dann auf eine Spende von mehreren tausend Yen.",
        hack: "C",
        move: "Echte Mönche betteln nicht auf der Straße. Lehn das Objekt ab; hast du es schon angenommen, gib es zurück und geh.",
      },
      {
        name: "Taxi-Umwege ab Bahnhöfen",
        how: "Eine kleine Zahl von Taxifahrern nimmt einen längeren Weg ab großen Bahnhöfen oder Flughäfen, wenn sie erkennen, dass du die Stadt nicht kennst.",
        hack: "C",
        move: "Zeig dem Fahrer das Ziel auf einer Karte und behalt deine eigene Route im Blick. Züge und die Flughafenbusse mit Festpreis umgehen das Problem komplett.",
      },
    ],
    faqs: [
      {
        q: "Ist Japan sicher für Touristen?",
        a: "Äußerst sicher. Kleinkriminalität und Straßenbetrug sind selten. Die einzige echte Falle sind die Nachtleben-Anwerber in Tokios Kabukicho und Roppongi — folg nie einem in eine Bar. Überall sonst reicht normale Vorsicht völlig aus.",
      },
      {
        q: "Was sind die Anwerber in Kabukicho?",
        a: "Männer auf der Straße, die dich mit dem Versprechen günstiger Drinks in Bars oder Clubs einladen. Die Lokale berechnen dann extreme Preise, erfinden Gebühren und drängen oder sperren dich zum Bezahlen ein. Präparierte Drinks und erzwungene Kartenzahlungen wurden beide gemeldet. Wähl deine eigene Bar mit ausgeschriebenen Preisen.",
      },
    ],
  },

  brazil: {
    intro:
      "In Rio und São Paulo ist das Alltagsrisiko für Reisende Straßenraub und Ablenkungsdiebstahl, nicht ausgeklügelte Betrugsmaschen. Kartenklonen, falsche Polizei und „Express-Entführungen“ aus nicht gebuchten Taxis sind die Dinge, auf die man sich einstellen sollte.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Ablenkungsdiebstahl am Strand und auf der Straße",
        how: "An Copacabana und Ipanema drängt dich eine Gruppe, ein „Verkäufer“ verstellt dir die Sicht, oder jemand zeigt auf einen Fleck auf deiner Kleidung, während ein Partner Handy oder Tasche nimmt.",
        hack: "C",
        move: "Nimm fast nichts mit an den Strand — ein bisschen Bargeld, ein billiges Handy. Drängen dich irgendwo Leute, leg die Hand auf die Tasche und geh in offenen Raum.",
      },
      {
        name: "Express-Entführung aus nicht gebuchten Taxis",
        how: "Ein auf der Straße gewinktes oder falsches Taxi fährt dich zu einer Reihe von Geldautomaten und erzwingt über mehrere Stunden Abhebungen bis zum Tageslimit, manchmal über zwei Tage, um das Limit zurückzusetzen.",
        hack: "K",
        move: "Nutz nur Apps (Uber, 99) oder von deinem Hotel gerufene Funktaxis. Wink nie ein Taxi auf der Straße, besonders nachts oder vom Flughafen.",
      },
      {
        name: "Kartenklonen und der „abgelehnt“-Doppel-Swipe",
        how: "Ein Laden, eine Bar oder ein Restaurant zieht deine Karte außer Sicht, zieht sie zweimal mit der Behauptung, die erste sei fehlgeschlagen, oder ein manipulierter Geldautomat kopiert sie zur späteren Nutzung.",
        hack: "K",
        move: "Behalt die Karte im Blick und besteh darauf, sie vor dir kontaktlos oder mit Chip zu nutzen. Nutz Geldautomaten in Bankfilialen bei Tageslicht und prüf deinen Kontoauszug täglich.",
      },
      {
        name: "Falsche Polizei-Dokumentenkontrolle",
        how: "Männer, die sich als Polizei ausgeben, halten dich an, verlangen Pass und Portemonnaie zur „Prüfung auf Falschgeld oder Drogen“ und lassen bei der Durchsuchung Bargeld oder Karten verschwinden.",
        hack: "A",
        move: "Echte Beamte fassen dein Bargeld nicht auf der Straße an. Biete an, zur Wache zu gehen, behalt dein Portemonnaie in der Tasche, und gib nicht den Originalpass her (trag eine Kopie bei dir).",
      },
      {
        name: "Rechnungsaufblähung im Nachtleben von Lapa",
        how: "In Rios Lapa-Viertel wird jedes Getränk auf einer „Verbrauchskarte“ vermerkt; verlorene oder veränderte Karten und „Mindestverzehr“-Behauptungen an der Tür erzeugen beim Rausgehen eine riesige Rechnung.",
        hack: "K",
        move: "Bewache die Verbrauchskarte wie Bargeld, prüf, dass jedes Getränk korrekt vermerkt ist, und fotografier sie. Frag vor dem Reingehen nach einem eventuellen Mindestverzehr.",
      },
    ],
    faqs: [
      {
        q: "Wie vermeide ich Express-Entführung in Brasilien?",
        a: "Wink nie ein Taxi auf der Straße. Nutz Uber oder 99, oder ein von deinem Hotel gebuchtes Funktaxi. Die meisten Express-Entführungen beginnen mit einem nicht gebuchten oder falschen Taxi, besonders nachts und ab Flughäfen.",
      },
      {
        q: "Ist es sicher, meine Karte in Brasilien zu nutzen?",
        a: "Ja, wenn du sie im Blick behältst — besteh auf kontaktlos oder Chip-und-PIN vor dir, lass sie nie wegnehmen, und nutz Geldautomaten in Bankfilialen. Kartenklonen und doppeltes Durchziehen sind die Hauptrisiken. Prüf deinen Kontoauszug täglich.",
      },
    ],
  },

  colombia: {
    intro:
      "Cartagena, Medellín und Bogotá sind für Reisende deutlich sicherer als vor einem Jahrzehnt, aber zwei Dinge solltest du einplanen: nicht gebuchte Taxis (Raub und „paseo millonario“) sowie K.-o.-Tropfen oder Kontaktvergiftung, einschließlich Scopolamin.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Paseo millonario (Raub durch nicht gebuchtes Taxi)",
        how: "Ein auf der Straße gewinktes Taxi nimmt Komplizen auf und fährt dich zwischen Geldautomaten hin und her, erzwingt Abhebungen, hält dich manchmal über Nacht fest, um das Tageslimit zurückzusetzen.",
        hack: "K",
        move: "Nutz nur Apps (Uber, DiDi, Cabify) oder ein von deinem Hotel gerufenes Taxi. Wink nie eines heran, und teil deine Fahrt mit jemandem.",
      },
      {
        name: "Scopolamin- („Atem des Teufels“) Vergiftung",
        how: "Ein Getränk, eine gereichte Zigarette, eine Parfüm-„Probe“ oder sogar eine dir zugewehte Visitenkarte wird genutzt, um dich zu dosieren; Opfer werden willenlos und können sich später nicht erinnern, Bargeld, Karten und Handy übergeben zu haben. Oft über eine freundliche neue Bekanntschaft, manchmal über Dating-Apps.",
        hack: "C",
        move: "Nimm keine Getränke, kein Essen, keinen Kaugummi, keine Zigaretten und nichts zum Riechen von jemandem an, den du gerade erst kennengelernt hast. Triff Dating-App-Matches tagsüber an einem öffentlichen Ort und sag jemandem, wo du bist.",
      },
      {
        name: "Falsche Polizei-„Drogen- oder Geldkontrolle“",
        how: "Männer in Zivil zeigen einen Ausweis, geben sich als Anti-Drogen-Polizei aus und durchsuchen dein Portemonnaie und deine Tasche nach „Falschgeld“, wobei Bargeld und Karten verschwinden.",
        hack: "A",
        move: "Echte Polizei prüft dein Geld nicht auf der Straße. Sag, du gehst zur Wache, behalt dein Portemonnaie, und ruf zur Verifizierung 123 an.",
      },
      {
        name: "Smaragd- und Kaffee-„Investition“",
        how: "In Bogotá bietet ein freundlicher Kontakt billige Smaragde zum Weiterverkauf im Ausland an, oder ein „direkt vom Bauernhof“-Kaffeegeschäft, das Vorauszahlung verlangt. Die Ware ist fast wertlos oder kommt nie an.",
        hack: "C",
        move: "Diese Weiterverkaufsmöglichkeit gibt es nicht. Kauf nie Waren zum Weiterverkauf auf das Versprechen eines Fremden hin, und zahl nie im Voraus an eine fremde Person.",
      },
      {
        name: "Wechselgeld-Unterschlagung und zerrissene Scheine",
        how: "Verkäufer und Fahrer geben zu wenig Wechselgeld, reichen zerrissene oder alte Scheine weiter, die Läden nicht annehmen, oder nutzen die Verwechslung zwischen 20.000- und 50.000-Peso-Scheinen aus.",
        hack: "C",
        move: "Zähl das Wechselgeld, bevor du weitergehst, lehn beschädigte Scheine ab, und zahl wo möglich mit kleineren Scheinen.",
      },
    ],
    faqs: [
      {
        q: "Was ist Scopolamin, und wie werden Touristen damit dosiert?",
        a: "Ein Wirkstoff, der Opfer willenlos macht und ihre Erinnerung an das Geschehene löscht. In Kolumbien wird es in Getränke oder Essen gemischt, auf einer Zigarette gereicht oder zum Riechen angeboten. Es kommt oft über eine freundliche neue Bekanntschaft oder ein Dating-App-Match. Lehn alles Konsumierbare von jemandem ab, den du gerade erst kennengelernt hast.",
      },
      {
        q: "Sind Taxis in Kolumbien sicher?",
        a: "Nutz Apps (Uber, DiDi, Cabify) oder lass dein Hotel eines rufen. Auf der Straße gewinkte Taxis bergen ein echtes Risiko des „paseo millonario“ — zwischen Geldautomaten gefahren und zu Abhebungen gezwungen zu werden. Gebuchte Fahrten nehmen fast das gesamte Risiko raus.",
      },
    ],
  },

  peru: {
    intro:
      "Lima und Cusco leben vom Tourismus, und die Betrugsmaschen folgen: falsche Taxis vom Flughafen, „Bremscheck“-Würgeraub im Verkehr, überteuerte Inka-Trail-Anbieter und die üblichen Karten- und Wechselgeldtricks.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Falsche Flughafentaxis",
        how: "Fahrer in Limas Ankunftshalle bieten Fahrten zum Drei- bis Fünffachen des fairen Preises an, und einige machen Umwege in ruhige Gegenden für Raub.",
        hack: "A",
        move: "Buch ein offizielles Flughafentaxi an den Schaltern hinter dem Zoll (Green Taxi, Taxi Directo) oder eine App-Abholung. Steig nicht in ein Auto, das dich angesprochen hat.",
      },
      {
        name: "„Bremscheck“- / Würgeraub im Verkehr",
        how: "Im langsamen Limaer Verkehr greift jemand durchs offene Fenster, oder ein Komplize „tippt“ dein Taxi von hinten an, sodass du anhältst, und beraubt dich dann.",
        hack: "K",
        move: "Fahr mit geschlossenen Fenstern und verriegelten Türen, Tasche auf dem Boden statt auf dem Sitz, Handy weggepackt. Wähl App-Fahrten statt Straßentaxis.",
      },
      {
        name: "Inka-Trail- und Machu-Picchu-Anbieterbetrug",
        how: "Billige „Inka-Trail“-Touren, die auf Cuscos Straßen verkauft werden, haben eventuell keine Genehmigung (der Trail ist strikt limitiert), ersetzen die Route durch eine andere oder kassieren Anzahlungen und verschwinden.",
        hack: "H",
        move: "Buch Monate im Voraus bei einem von den peruanischen Behörden gelisteten lizenzierten Anbieter. Ein Inka-Trail-Angebot für dieselbe Woche auf der Straße ist nicht echt.",
      },
      {
        name: "Währung: Falschgeld und der „kein Wechselgeld“-Trick",
        how: "Du bekommst einen gefälschten Sol- oder Dollarschein als Wechselgeld, oder ein Verkäufer behauptet, kein Wechselgeld zu haben, und behält einen großen Schein, oder tauscht deinen guten Schein gegen einen zerrissenen.",
        hack: "C",
        move: "Prüf Scheine auf Wasserzeichen und Fühlbarkeit, trag kleine Scheine bei dir, und zähl das Wechselgeld, bevor du weitergehst.",
      },
      {
        name: "Cuscos „kostenlose“ Straßengeschenke und Segen",
        how: "Frauen in traditioneller Kleidung posieren für Fotos oder legen dir ein Lama-Baby in die Arme und verlangen dann Bezahlung; „Heiler“ bieten einen Segen an und nennen dann einen Preis.",
        hack: "H",
        move: "Vereinbare einen kleinen Preis vor jedem Foto, oder lehn ab. Lass dir nicht zuerst ein Tier oder einen Gegenstand in die Hand geben.",
      },
    ],
    faqs: [
      {
        q: "Wie komme ich sicher vom Flughafen Lima weg?",
        a: "Buch ein offizielles Taxi an den lizenzierten Schaltern im Terminal (hinter dem Zoll), oder organisier eine App-Abholung oder einen Hoteltransfer. Nimm keine Fahrt von jemandem an, der dich in der Ankunftshalle anspricht.",
      },
      {
        q: "Kann ich den Inka-Trail kurzfristig buchen?",
        a: "Nein. Genehmigungen sind begrenzt und meist Monate im Voraus ausverkauft, und nur lizenzierte Anbieter dürfen ihn durchführen. Wer dir einen Inka-Trail-Trek für nächste Woche auf einer Cusco-Straße verkauft, bietet eine andere Route an oder betrügt dich.",
      },
    ],
  },

  "south-africa": {
    intro:
      "Kapstadt und Johannesburg erfordern echtes Situationsbewusstsein. Für Reisende sind die wiederkehrenden Betrugsmaschen Geldautomaten-Kartentausch, falsche „Polizei“ und der „dein Reifen ist platt“-Ablenkungsraub — dazu Scheibeneinschlag-Raub an Ampeln.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Geldautomaten-„Helfer“-Kartentausch",
        how: "Während du einen Geldautomaten nutzt, sagt ein freundlicher Fremder, der Automat sei defekt, oder bietet Hilfe an, lenkt dich ab und tauscht deine Karte gegen eine ähnliche — und räumt das Konto mit der PIN leer, die er dich hat eingeben sehen.",
        hack: "C",
        move: "Lehn jede Hilfe am Geldautomaten ab. Behält der Automat deine Karte ein, geh nicht weg — ruf sofort von dort deine Bank an und lass die Karte sperren.",
      },
      {
        name: "„Dein Reifen ist platt / du verlierst Öl“",
        how: "Auf einem Parkplatz oder an einer Ampel zeigt jemand auf dein Auto; steigst du aus, um nachzusehen, nimmt ein Komplize Taschen aus dem Fahrzeug. Manchmal wurde der Reifen kurz vorher absichtlich entlüftet.",
        hack: "H",
        move: "Fahr zu einer belebten Tankstelle, bevor du irgendetwas prüfst. Halt die Türen verriegelt und Taschen außer Sicht im Fußraum.",
      },
      {
        name: "Falsche Polizei-Straßensperre oder „Dokumentenkontrolle“",
        how: "Personen in Teiluniform halten Touristen an, verlangen Pass und Portemonnaie, behaupten ein Bußgeld und nehmen Bargeld — oder ein Komplize beraubt während der „Kontrolle“ das Auto.",
        hack: "A",
        move: "Echte Straßensperren sind markiert und mit mehreren Beamten besetzt. Halt die Fenster oben, verlang den Ausweis durchs Glas, und fahr im Zweifel zur nächsten Polizeiwache.",
      },
      {
        name: "Scheibeneinschlag-Raub an Ampeln",
        how: "An bestimmten Kreuzungen in Johannesburg und Kapstadt wird eine Scheibe eingeschlagen und eine Tasche oder ein Handy gegriffen, während du bei Rot wartest, besonders nach Einbruch der Dunkelheit.",
        hack: "K",
        move: "Halt Wertsachen im Kofferraum oder Fußraum, lass eine Wagenlänge Abstand zum Vordermann, um wegfahren zu können, und meid bekannte Hotspot-Routen nachts.",
      },
      {
        name: "Tafelberg / Touristenort-„Guides“ und Parken",
        how: "Inoffizielle „Parkwächter“ oder „Guides“ verlangen Bezahlung für Parkplätze, die eigentlich kostenlos wären, oder hängen sich auf einem Wanderweg an und verlangen eine Gebühr.",
        hack: "C",
        move: "Gib offiziellen (mit Weste, registrierten) Parkwächtern gerne ein paar Rand Trinkgeld; ignorier alle anderen. Lehn ungefragte Wanderbegleitung ab.",
      },
    ],
    faqs: [
      {
        q: "Sind Geldautomaten in Südafrika sicher?",
        a: "Nutz Geldautomaten in einer Bank oder einem belebten Einkaufszentrum tagsüber, und lehn jedes Hilfsangebot ab — der Kartentausch-Betrug funktioniert nur, wenn du am Automaten abgelenkt wirst. Wird deine Karte einbehalten, ruf sofort die Bank an, ohne wegzugehen.",
      },
      {
        q: "Was soll ich tun, wenn jemand sagt, mein Reifen sei platt?",
        a: "Halt nicht an und steig dort nicht aus. Fahr zu einer belebten, gut beleuchteten Tankstelle und prüf dort nach. Die Hinweise auf „platten Reifen“ und „Ölleck“ sind eine Standard-Ablenkung, um Taschen aus dem Auto zu nehmen.",
      },
    ],
  },

  czechia: {
    intro:
      "Prags Altstadt hat eine Häufung von Touristen-Betrugsmaschen: Wechselstuben mit miesen Kursen, Taxifahrer, die den Tarif vergessen, Restaurants, die die Rechnung aufblähen, und die Strip-Club-„Drink“-Falle nahe dem Wenzelsplatz.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Wechselstuben mit versteckten Kursen",
        how: "Stuben nahe dem Altstädter Ring und der Karlsbrücke werben mit einem großartigen Kurs in riesigen Zahlen, der sich als „Verkaufs“-Kurs herausstellt oder nur ab einem hohen Betrag gilt, mit einer Gebühr, die dich 20–30 % schlechter dastehen lässt.",
        hack: "C",
        move: "Nutz einen Geldautomaten einer großen Bank, oder eine Wechselstube, die dir den exakten Betrag zeigt, den du bekommst, bevor du zustimmst. Tschechisches Recht erlaubt, einen Wechsel innerhalb weniger Stunden rückgängig zu machen — heb die Quittung auf.",
      },
      {
        name: "Taxi-Überteuerung",
        how: "Fahrer, die vor Bahnhöfen, dem Flughafen und Sehenswürdigkeiten warten, nutzen ein manipuliertes Taxameter oder einen „Touristen“-Festpreis, mehrfach so hoch wie der reale Preis.",
        hack: "H",
        move: "Nutz Bolt oder Uber, oder lass ein Restaurant eine seriöse Firma rufen. Die Strecke Flughafen–Zentrum kostet etwa 600–800 CZK; alles nahe 1.500 ist Abzocke.",
      },
      {
        name: "Aufgeblähte Restaurantrechnung",
        how: "Altstadt-Restaurants berechnen ungefragtes Brot und „couvert“, verlangen für Leitungswasser den Preis von Flaschenwasser, setzen einen „Touristenkarte“-Preis an oder tragen eine bereits ausgefüllte hohe Trinkgeldzeile ein.",
        hack: "C",
        move: "Prüf die Kartenpreise, lehn ab, was du nicht bestellt hast, und geh die Rechnung Position für Position durch, bevor du zahlst. Ein Servicezuschlag muss, falls vorhanden, ausgewiesen sein.",
      },
      {
        name: "Strip-Club- / „nette Bar“-Drink-Falle",
        how: "Männer nahe dem Wenzelsplatz und der Altstadt verteilen Flyer oder laden dich in eine Bar oder einen Club ein; Getränke für dich und die „Hostess“ werden zu absurden Preisen berechnet, und Türsteher blockieren, bis du zahlst.",
        hack: "K",
        move: "Wirf den Flyer weg, lehn die Einladung ab. Bist du schon drin, zahl nur deine eigenen Getränke, fotografier die Karte und geh in Richtung einer Hauptstraße.",
      },
      {
        name: "Hütchenspiel und falsche „Polizei“ an der Karlsbrücke",
        how: "Ein Becherspiel läuft mit eingeschleusten Gewinnern und Taschendieben in der Menge; getrennt davon verlangen falsche „Polizisten“ von Touristen den Ausweis und durchsuchen Portemonnaies nach „Falschgeld“.",
        hack: "H",
        move: "Schau nie zu und spiel nie mit. Bei einer Ausweiskontrolle verlang einen uniformierten Beamten und biete an, zur Wache zu gehen; behalt dein Portemonnaie in der Tasche.",
      },
    ],
    faqs: [
      {
        q: "Wo sollte ich in Prag Geld wechseln?",
        a: "An einem Bankautomaten oder in einer Wechselstube, die dir den exakten Kronenbetrag zeigt, bevor du zustimmst. Meid die Stuben nahe dem Altstädter Ring und der Karlsbrücke — ihre beworbenen Kurse sind irreführend. Gesetzlich kannst du einen Wechsel innerhalb weniger Stunden rückgängig machen, wenn du die Quittung aufhebst.",
      },
      {
        q: "Wie viel kostet ein Taxi vom Flughafen Prag ins Zentrum?",
        a: "Etwa 600–800 CZK bei einer seriösen Taxifirma, weniger mit Bolt oder Uber. Fahrer, die 1.200–1.500+ verlangen, überteuern. Buch über eine App oder lass dein Hotel ein Auto organisieren.",
      },
    ],
  },

  netherlands: {
    intro:
      "Amsterdams Betrugsmaschen sind harmlos: gefälschte Drogen auf der Straße, Fahrrad-Verleih-Schadensforderungen und Taschendiebe in den Menschenmengen im Zentrum und in Trams. Gewaltverbrechen gegen Touristen sind selten.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Falsches „Kokain“ und Pillen auf der Straße",
        how: "Dealer rund um das Rotlichtviertel und den Leidseplein verkaufen weißes Pulver oder Pillen, die gefälscht sind (oder gefährliche Research Chemicals). Es ist Abzocke, und der Kauf ist eine Straftat.",
        hack: "K",
        move: "Ignorier Straßenangebote komplett. Das Produkt ist nicht das, was behauptet wird.",
      },
      {
        name: "Fahrrad-Verleih-Schaden- und Schloss-Tricks",
        how: "Ein Verleih verlangt eine hohe Gebühr für „Schaden“ oder ein „gestohlenes“ Fahrrad bei Rückgabe, oder gibt ein schwaches Schloss aus, sodass das Rad leicht entwendet wird und dir die Rechnung präsentiert wird.",
        hack: "K",
        move: "Fotografier das Fahrrad und beide Schlösser vor der Fahrt. Nutz immer beide mitgelieferten Schlösser durch den Rahmen an einem festen Objekt, und heb den Mietvertrag auf.",
      },
      {
        name: "Taschendiebe in Trams und auf dem Dam",
        how: "Teams arbeiten in Tram 2 und 5, am Centraal Station und in dichten Menschenmengen rund um den Dam und den Blumenmarkt — einer drängt, einer zieht.",
        hack: "C",
        move: "Tasche zu und vorne am Körper, Handy in der Vordertasche. Sei besonders wachsam beim Einsteigen in Trams und bei plötzlichem Gedränge.",
      },
      {
        name: "„Freundlicher“ Foto-Helfer",
        how: "Jemand bietet an, ein Foto von dir vor einer Gracht oder am I-amsterdam-Schild zu machen, und geht mit dem Handy davon, oder ein Partner nimmt deine Tasche, während du posierst.",
        hack: "C",
        move: "Bitte lieber eine andere erkennbare Touristenperson, oder nutz ein kleines Stativ. Behalt deine Tasche am Körper, während du posierst.",
      },
      {
        name: "Überteuerung in Restaurants und „Coffeeshops“",
        how: "Manche Lokale in Touristenlagen führen eine „Touristen“-Karte, berechnen einen in den Niederlanden unüblichen Service, oder verkaufen minderwertige Ware zu Premiumpreisen.",
        hack: "C",
        move: "Prüf die Preise vor der Bestellung; Trinkgeld ist hier gering und Service meist inklusive. Seriöse Coffeeshops zeigen eine Karte mit Gewichten und Preisen.",
      },
    ],
    faqs: [
      {
        q: "Ist Amsterdam sicher für Touristen?",
        a: "Ja. Gewaltverbrechen gegen Reisende sind selten. Die realistischen Risiken sind Taschendiebstahl im belebten Zentrum und in Trams, gefälschte Drogen auf der Straße und Streit um Fahrrad-Verleih — alles harmlos und vermeidbar.",
      },
      {
        q: "Wie vermeide ich Streit beim Fahrrad-Verleih in Amsterdam?",
        a: "Fotografier das Fahrrad und seine Schlösser, bevor du losfährst, nutz beide mitgelieferten Schlösser jedes Mal durch den Rahmen an etwas Festem, und heb den Mietvertrag auf. Schadens- und „Diebstahl“-Gebühren sind die häufigste Beschwerde beim Verleih.",
      },
    ],
  },

  argentina: {
    intro:
      "In Buenos Aires sind die Klassiker die Senf- (oder Ketchup-) Ablenkung, Falschgeld im Wechselgeld oder von inoffiziellen Geldwechslern, und Taxis, die Umwege fahren oder deinen Schein austauschen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Die Senf- / Vogelkot-Ablenkung",
        how: "Eine Substanz wird auf deinen Rücken oder deine Schulter gespritzt oder fallen gelassen; eine hilfsbereite Person taucht mit Taschentüchern auf, um dich sauber zu machen, und während du abgelenkt bist, wird deine Tasche, dein Handy oder Portemonnaie genommen.",
        hack: "C",
        move: "Landet etwas auf dir, bleib nicht stehen und lass dir nicht „helfen“. Halt deine Tasche fest, geh in einen Laden oder ein Café und mach dich dort sauber.",
      },
      {
        name: "Falsche Pesos im Wechselgeld und von „Arbolitos“",
        how: "Straßen-Geldwechsler („Arbolitos“), die den blauen Dollarkurs anbieten, sowie manche Läden und Taxis geben gefälschte 1.000- und 2.000-Peso-Scheine als Wechselgeld.",
        hack: "C",
        move: "Wechsle Geld bei einer Bank oder einer etablierten casa de cambio. Lern die Sicherheitsmerkmale der großen Scheine, und prüf Wechselgeld unter Licht, bevor du weitergehst.",
      },
      {
        name: "Geldschein-Trick und Umwege im Taxi",
        how: "Du zahlst mit einem 2.000-Peso-Schein; der Fahrer lässt ihn verschwinden und zeigt einen 200er, du hättest zu wenig gezahlt. Oder das Taxameter läuft auf falschem Tarif, oder die Route macht Umwege.",
        hack: "H",
        move: "Sag den Wert des Scheins laut, während du ihn übergibst. Nutz die Cabify- oder Uber-App, oder Funktaxis, und verfolg deine Route auf einer Karte.",
      },
      {
        name: "„Platter Reifen“ an der Ampel",
        how: "Jemand zeigt auf einen Reifen deines Autos oder Taxis; steigen Fahrer oder du aus, nimmt ein Komplize Taschen von drinnen.",
        hack: "H",
        move: "Halt nicht dort an, wo du bist. Fahr weiter zu einer Tankstelle und prüf dort nach, Türen verriegelt.",
      },
      {
        name: "Falsche Polizei-Dokumentenkontrolle",
        how: "„Beamte“ in Zivil verlangen Pass und Portemonnaie zur Prüfung auf Falschgeld oder Drogen und lassen bei der Durchsuchung Bargeld verschwinden.",
        hack: "A",
        move: "Echte Polizei prüft dein Bargeld nicht auf der Straße. Biete an, zur Wache zu gehen, behalt dein Portemonnaie, und trag eine Passkopie statt des Originals bei dir.",
      },
    ],
    faqs: [
      {
        q: "Sollte ich Straßen-Geldwechsler in Buenos Aires nutzen?",
        a: "Sie bieten einen besseren Kurs, aber Falschgeld ist ein echtes Risiko. Nutzt du einen, dann nur auf vertrauenswürdige Empfehlung, zähl und prüf jeden Schein, und nie in einer ruhigen Straße. Banken und etablierte casas de cambio sind sicherer.",
      },
      {
        q: "Was ist die Senf-Masche?",
        a: "Jemand spritzt dir heimlich eine Soße oder falschen Vogelkot auf, dann bietet eine „hilfsbereite“ Person an, dich zu säubern, während ein Komplize deine Tasche stiehlt. Landet in einem Touristengebiet etwas auf dir, geh weiter und nimm keine Hilfe an.",
      },
    ],
  },

  croatia: {
    intro:
      "Kroatien ist ein sicheres Reiseziel mit wenig Kriminalität. Die Reibungspunkte sind Taxi-Überteuerung in Split und Dubrovnik, Restaurants nahe den Altstädten, die die Rechnung aufblähen, und Bootstour-Anwerber, die Tagesausflüge überverkaufen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi-Überteuerung in Split und Dubrovnik",
        how: "Fahrer vor den Altstadttoren, Fährhäfen und Flughäfen umgehen das Taxameter und nennen Touristen-Festpreise, zwei- bis dreimal so hoch wie eine App-Fahrt.",
        hack: "H",
        move: "Nutz Uber oder Bolt (beide funktionieren gut in den Touristenstädten), oder vereinbare den Preis schriftlich, bevor du einsteigst.",
      },
      {
        name: "Aufgeblähte Restaurantrechnung nahe den Altstädten",
        how: "Konobas und Restaurants gleich innerhalb der Mauern bringen ungefragtes Brot, Olivenöl oder Fischplatten, berechnen „Gedeck“ oder „Musik“, oder nennen einen Fischpreis pro Kilo, ohne ihn vor dir zu wiegen.",
        hack: "C",
        move: "Frag vor der Bestellung nach dem Fischpreis und einem eventuellen couvert; lehn ab und schick zurück, was du nicht wolltest; prüf die Rechnung Position für Position.",
      },
      {
        name: "Bootstour- und „Blaue Grotte“-Anwerber",
        how: "Verkäufer an den Wasserpromenaden von Split und Hvar drängen Tagesausflüge zu überhöhten Preisen auf, überbuchen Boote, sodass es eng wird, oder das „Warteschlange überspringen“ bei der Blauen Grotte ist dieselbe Wartezeit.",
        hack: "H",
        move: "Buch bei einem etablierten Anbieter mit Bewertungen, bestätige Gruppengröße und Leistungsumfang, und sei skeptisch bei „nur noch zwei Plätze“-Druck.",
      },
      {
        name: "Wohnungs- / „Sobe“-Kautionsbetrug",
        how: "Eine billige zentrale Wohnung oder ein Zimmer verlangt eine Kaution oder Vollzahlung per Überweisung vor der Anreise; der Ort existiert nicht oder gehört nicht dem Gastgeber.",
        hack: "K",
        move: "Buch über eine Plattform, die die Zahlung bis zum Check-in hält. Keine Überweisung oder Krypto für ein ungesehenes Zimmer.",
      },
      {
        name: "Park- und ZTL-Bußgelder",
        how: "Verwirrende Zonen in Altstädten führen zu Bußgeldern für Parken oder Fahren, wo es nicht erlaubt ist; Mietwagenfirmen geben diese später mit Bearbeitungsgebühr weiter.",
        hack: "K",
        move: "Park auf einem markierten öffentlichen Parkplatz außerhalb der Mauern und geh zu Fuß rein. Fotografier Schilder, bei denen du unsicher bist.",
      },
    ],
    faqs: [
      {
        q: "Sind Taxis in Dubrovnik teuer?",
        a: "Taxis mit Taxameter sind angemessen; das Problem sind Fahrer nahe der Altstadt und dem Hafen, die stattdessen hohe Festpreise nennen. Uber und Bolt sind beide in Dubrovnik und Split verfügbar und die einfachste Lösung.",
      },
      {
        q: "Berechnen kroatische Restaurants versteckte Gebühren?",
        a: "Lokale in Touristenlagen berechnen manchmal couvert, „Musik“ oder ungefragte Vorspeisen, und bepreisen Fisch pro Kilo. Frag vor der Bestellung nach einem eventuellen Gedeck und dem Fischpreis, und schick zurück, was du nicht wolltest.",
      },
    ],
  },

  "south-korea": {
    intro:
      "Südkorea ist sehr sicher und für Touristen weitgehend betrugsfrei. Die seltenen Probleme sind „Juicy“-Bar-Fallen in Itaewon und Hongdae, Taxiverweigerungen oder Umwege spätnachts, und gefälschte Ware in Myeongdong.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "„Juicy Bar“- / Hostessenbar-Falle",
        how: "Ein Anwerber nahe Itaewon oder Hongdae lädt dich in eine Bar ein; Frauen setzen sich an deinen Tisch, teure Drinks werden für sie bestellt, und eine Rechnung über mehrere hundert Dollar erscheint, während Personal den Ausgang blockiert.",
        hack: "K",
        move: "Folg nie einer Straßeneinladung in eine Bar. Steckst du fest, zahl nur das Bestellte, fotografier die Karte, und geh in Richtung einer belebten Straße oder ruf 112 an.",
      },
      {
        name: "Taxiverweigerung und Umwege spätnachts",
        how: "Manche Fahrer lehnen kurze Fahrten ab, winken dich weg, oder fahren nachts bei hoher Nachfrage Umwege mit Touristen.",
        hack: "C",
        move: "Nutz die Kakao-T-App, um zu buchen und die Route festzulegen. Sie ist in Korea dominant und nimmt das Verhandeln raus.",
      },
      {
        name: "Gefälschte Kosmetik und Ware in Myeongdong",
        how: "Straßenstände und manche Läden verkaufen gefälschte Marken-Hautpflege, Parfüm und Accessoires als echt zu „Rabatt“-Preisen.",
        hack: "C",
        move: "Kauf Markenkosmetik im eigenen Markenladen, bei Olive Young, oder im Kaufhaus. Ein großer Rabatt auf ein versiegeltes „echtes“ Produkt ist das Erkennungszeichen.",
      },
      {
        name: "Wahrsager- / „kostenloser“ Tempelsegen-Upsell",
        how: "Nahe Palästen und Tempeln bietet jemand eine „kostenlose“ Lesung oder einen Segen an und nennt dann eine hohe Gebühr für die „vollständige“ Version oder ein Glücksamulett.",
        hack: "C",
        move: "Lehn höflich ab und geh weiter. Es gibt keine Verpflichtung und kein „Pech“ fürs Neinsagen.",
      },
    ],
    faqs: [
      {
        q: "Ist Seoul nachts sicher für Touristen?",
        a: "Ja, sehr. Gewaltverbrechen gegen Reisende sind selten, und U-Bahn und Straßen sind spät noch belebt. Die Hauptsache, die man vermeiden sollte: einem Anwerber in eine Bar in Itaewon oder Hongdae folgen, wo aufgeblähte „Hostessen“-Rechnungen die bekannte Falle sind.",
      },
      {
        q: "Wie sollte ich in Südkorea Taxis nutzen?",
        a: "Nutz die Kakao-T-App. Sie ist hier Standard, legt Preis und Route fest, und umgeht den gelegentlichen Fahrer, der eine kurze Fahrt ablehnt oder nachts einen Umweg fährt.",
      },
    ],
  },

  cambodia: {
    intro:
      "In Siem Reap und Phnom Penh sind die wiederkehrenden Probleme Preisstreit bei Tuk-Tuks und Taxis, Motorrad-Verleih-Schadensforderungen, Ablehnung zerrissener Scheine und organisiertes, aggressives Betteln rund um Touristen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Tuk-Tuk „vereinbarter“ Preis ändert sich am Ende",
        how: "Ein Fahrer vereinbart einen niedrigen Preis und besteht am Ziel dann darauf, er gelte pro Person, in Dollar statt Riel, oder nur für einen Teil der Fahrt — manchmal bestätigt von einem Freund.",
        hack: "H",
        move: "Nutz die Grab- oder PassApp-App (beide funktionieren in Kambodscha), damit der Preis feststeht. Vereinbarst du bar, schreib Gesamtpreis, Währung und Route auf dein Handy und zeig es dem Fahrer.",
      },
      {
        name: "Motorrad-Verleih-Schaden und Pass-Einbehalt",
        how: "Der Laden behält deinen Pass ein und findet bei Rückgabe „neue“ Schäden oder behauptet, das Motorrad sei gestohlen worden, und hält das Dokument, bis du zahlst. Hinweis: Motorradfahren als Tourist ist technisch oft auch gar nicht erlaubt.",
        hack: "K",
        move: "Hinterleg eine Barkaution, nicht den Pass. Fotografier und film das Motorrad vor der Fahrt. Erwäg stattdessen, einen Fahrer zu engagieren.",
      },
      {
        name: "Zerrissene oder alte US-Scheine abgelehnt",
        how: "Kambodscha nutzt US-Dollar neben Riel, aber Läden und Fahrer lehnen jeden Schein mit kleinem Riss oder starker Abnutzung ab — geben dir aber genau solche Scheine bereitwillig als Wechselgeld.",
        hack: "C",
        move: "Lehn beschädigte Scheine als Wechselgeld sofort ab. Bitte deine Bank vor der Reise um knackige, neuere Scheine.",
      },
      {
        name: "Angkor-Ticket und „Tempel geschlossen“-Guides",
        how: "Inoffizielle „Guides“ bei Angkor hängen sich an und verlangen eine Gebühr, oder jemand behauptet, ein Tempel oder die Ticketstelle sei geschlossen, und lenkt dich zu einer Tour oder einem Laden.",
        hack: "A",
        move: "Kauf den Angkor-Pass nur am offiziellen Ticketzentrum. Lizenzierte Guides tragen einen Ausweis des Tourismusministeriums; die Männer, die dich an den Toren ansprechen, nicht.",
      },
      {
        name: "Kinderbetteln und „Milch fürs Baby kaufen“",
        how: "Kinder oder Mütter bitten dich, Milchpulver oder Reis aus einem bestimmten nahen Laden zu kaufen; die Ware geht danach zurück an den Laden, und das Geld wird geteilt. Es finanziert organisiertes Betteln und hält Kinder oft von der Schule fern.",
        hack: "C",
        move: "Kauf keine Ware auf Bitte hin. Willst du helfen, spend stattdessen an eine etablierte lokale Wohltätigkeitsorganisation.",
      },
    ],
    faqs: [
      {
        q: "Wie vermeide ich Tuk-Tuk-Überteuerung in Kambodscha?",
        a: "Nutz die Grab- oder PassApp-App, die den Preis festlegt. Für ein Bargeschäft schreib Gesamtpreis, Währung (Riel oder Dollar) und Route auf dein Handy und bestätige, dass es der Gesamtpreis ist, bevor ihr losfahrt.",
      },
      {
        q: "Sollte ich einem bettelnden Kind in Siem Reap Milch kaufen?",
        a: "Nein. Die Bitte „kauf Milchpulver in diesem Laden“ ist eine bekannte Masche — die Ware geht zurück an den Laden und das Geld wird geteilt, und es unterstützt organisiertes Kinderbetteln. Unterstütz stattdessen eine registrierte lokale Organisation.",
      },
    ],
  },

  philippines: {
    intro:
      "In Manila und Cebu sind die Risiken, auf die man sich einstellen sollte, die „Ativan-Bande“ (K.-o.-Tropfen), Taxameter-Verweigerung, die „untergeschobene Patrone“-Flughafen-Abzocke (weitgehend ausgemerzt, aber gut zu kennen) und Geldwechsler-Unterschlagung.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Ativan- / K.-o.-Tropfen-Banden",
        how: "Ein freundlicher Fremder oder „Mitreisender“, manchmal eine Gruppe, die als Familie auftritt, freundet sich mit dir an und bietet Essen, ein Getränk oder Süßigkeiten mit Beruhigungsmittel an; du wachst beraubt auf. Häufig um Manila, Ermita und in Bussen.",
        hack: "C",
        move: "Nimm kein Essen, keine Getränke oder Süßigkeiten von jemandem an, den du gerade erst kennengelernt hast, egal wie warmherzig die Person wirkt. Behalt dein Getränk im Blick.",
      },
      {
        name: "Taxameter-Verweigerung und „kein Wechselgeld“",
        how: "Taxis am Flughafen und bei Einkaufszentren lehnen das Taxameter ab, nennen Touristen-Festpreise, oder behaupten, kein Wechselgeld für einen großen Schein zu haben.",
        hack: "H",
        move: "Nutz Grab. Es ist auf den Philippinen dominant und legt den Preis fest. Am Flughafen nutz die offizielle gelbe Taxameter-Taxi-Schlange, kein Auto, das dich anspricht.",
      },
      {
        name: "Geldwechsler-Unterschlagung",
        how: "Ein Wechsler mit einem Kurs über dem Markt lenkt dich beim Zählen ab, faltet Scheine zurück, oder nutzt einen manipulierten Taschenrechner.",
        hack: "C",
        move: "Nutz einen lizenzierten Wechsler in einem Einkaufszentrum oder eine Bank, zähl den vollen Betrag selbst, bevor du deine Währung übergibst, und lass sie den Stapel nicht erneut anfassen.",
      },
      {
        name: "„Untergeschobenes“ Objekt bei der Flughafensicherheit (laglag-bala)",
        how: "Bei der historischen Masche steckte Personal eine Patrone ins Gepäck und verlangte dann Schmiergeld. Kontrollen haben das weitgehend beendet, aber halt Taschen geschlossen und verschlossen und film jeden „Fund“.",
        hack: "A",
        move: "Verschließ Aufgabe- und Handgepäck, lass niemand anderen dein Gepäck packen oder anfassen, und wird etwas „gefunden“, verlang einen Vorgesetzten und Videoaufnahmen zu sehen, statt zu zahlen.",
      },
      {
        name: "Überteuerung bei Strand- und Tauchshops",
        how: "In Boracay, El Nido und Cebu verkaufen Anwerber Island-Hopping-Touren und Tauchausflüge zu überhöhten Preisen, mit „Umweltgebühren“ und Ausrüstungskosten, die erst am Boot aufgeschlagen werden.",
        hack: "C",
        move: "Buch bei einem Shop mit physischen Räumlichkeiten und Bewertungen, lass dir den Gesamtpreis inklusive Gebühren schriftlich geben, und heb die Quittung auf.",
      },
    ],
    faqs: [
      {
        q: "Was ist die „Ativan-Bande“ auf den Philippinen?",
        a: "Kriminelle, die sich mit Touristen anfreunden — oft als freundliche Familie oder Mitreisende auftretend — und Essen oder Getränke mit Beruhigungsmittel anbieten, um sie dann bewusstlos auszurauben. Die Verteidigung ist einfach: nimm nie etwas zu essen oder trinken von jemandem an, den du gerade erst kennengelernt hast.",
      },
      {
        q: "Ist Grab in Manila sicher?",
        a: "Ja, und es ist der empfohlene Weg, sich fortzubewegen. Es legt Preis und Route fest und umgeht die Taxameter-Verweigerung und „kein Wechselgeld“-Probleme, die bei Straßen- und Flughafentaxis verbreitet sind.",
      },
    ],
  },

  "sri-lanka": {
    intro:
      "In Colombo, Kandy und im Süden sind die wiederkehrenden Betrugsmaschen Tuk-Tuk-Taxameter-Verweigerung und Umwege, Edelstein-Provisions-Touren, „der Tempel ist geschlossen“-Umleitungen und überhöhte „Guide“-Gebühren an Sehenswürdigkeiten.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Tuk-Tuk-Taxameter-Verweigerung und Umwege",
        how: "Fahrer winken das Taxameter für einen Touristen-Festpreis ab, oder vereinbaren einen Preis und machen dann einen Umweg zu einem Edelstein-Laden, Gewürzgarten oder „Bruders Laden“, der Provision zahlt.",
        hack: "H",
        move: "Nutz die PickMe-App (Sri Lankas Grab), damit der Preis feststeht. Nimmst du ein Straßen-Tuk-Tuk, besteh auf dem Taxameter und sag „keine Läden“.",
      },
      {
        name: "Edelstein-Laden-Provisions-Touren",
        how: "Ein freundlicher Einheimischer oder Fahrer bietet an, dir ein „staatliches Edelstein-Museum“ oder eine Werkstatt zu zeigen, wo „zertifizierte“ Steine günstig für den Weiterverkauf im Ausland verkauft werden. Die Steine sind minderwertig, und die Weiterverkaufsgeschichte ist erfunden.",
        hack: "C",
        move: "Lass es sein. Es gibt keine Edelstein-Weiterverkaufsmöglichkeit, und „staatliche“ Edelsteinläden sind privat. Kauf nur bei einem lizenzierten Händler, wenn du wirklich einen Stein für dich selbst willst.",
      },
      {
        name: "„Der Tempel ist geschlossen / es findet eine Zeremonie statt“",
        how: "Nahe dem Tempel des Heiligen Zahns in Kandy oder Colombos Tempeln sagt jemand, er sei bis später wegen eines Rituals geschlossen, und bietet an, dich woanders hinzubringen — zu einem Laden oder einem kostenpflichtigen „Aussichtspunkt“.",
        hack: "H",
        move: "Prüf die Öffnungszeiten selbst und geh zum Eingang. Die Umleitung ist der Betrug.",
      },
      {
        name: "Inoffizielle „Guides“ an Sehenswürdigkeiten",
        how: "In Sigiriya, Dambulla und Galle Fort hängen sich Männer ungefragt als Guides an und verlangen am Ende eine hohe Gebühr, oder „Helfer“ bieten Fotos an und berechnen sie dann.",
        hack: "C",
        move: "Sag klar, dass du keinen Guide willst. Willst du einen, nutz einen lizenzierten Guide über dein Hotel. Behalt dein Handy in der Hand.",
      },
      {
        name: "Zug und Bus: „Ticketschalter ist geschlossen“",
        how: "Jemand nahe dem Bahnhof Colombo Fort oder Kandy behauptet, der Schalter sei geschlossen oder der Zug voll, und lenkt dich zu einem Reisebüro mit hohem Aufschlag für die malerische Bergland-Zugstrecke.",
        hack: "A",
        move: "Kauf am Bahnhofsschalter, oder reservier online im Voraus für die Strecke Kandy–Ella. Ignorier jeden, der draußen „Hilfe“ mit Tickets anbietet.",
      },
    ],
    faqs: [
      {
        q: "Wie vermeide ich Tuk-Tuk-Betrug in Sri Lanka?",
        a: "Nutz die PickMe-App, die den Preis wie Grab festlegt. Bei einem Straßen-Tuk-Tuk besteh auf dem Taxameter und sag dem Fahrer „keine Läden“ — der Umweg zu einem Edelstein- oder Gewürzladen für Provision ist der häufigste Trick.",
      },
      {
        q: "Sind die Edelsteinläden in Sri Lanka Betrug?",
        a: "Das Angebot „günstige Edelsteine zum Weiterverkauf im Ausland kaufen“ ist es. Ebenso „staatliche Edelstein-Museen“, die private Läden sind. Sri Lanka hat einen echten Edelsteinhandel, aber kauf nur bei einem lizenzierten Händler, für dich selbst, zu einem fairen Preis.",
      },
    ],
  },

  malaysia: {
    intro:
      "Kuala Lumpur und Penang sind für Reisende meist unkompliziert. Die Hauptprobleme sind Taxameter-Verweigerung, Geldautomaten-Skimming, Taschenraub per Motorrad und „Karte abgelehnt“-Doppelbelastungen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxameter-Verweigerung",
        how: "Straßentaxis und manche Flughafentaxis, besonders rund um KLs Touristengebiete und Bukit Bintang, lehnen das Taxameter ab und nennen überhöhte Festpreise.",
        hack: "H",
        move: "Nutz Grab, das in Malaysia dominant ist und den Preis festlegt. Am KLIA nutz den offiziellen Coupon-Taxi-Schalter, wo du einen Festpreis vorauszahlst.",
      },
      {
        name: "Taschenraub per Motorrad",
        how: "Fahrer reißen Handtaschen und Handys von Fußgängern nahe der Bordsteinkante, manchmal wird das Opfer mitgeschleift. Häufig in Teilen von KL, Penang und Johor Bahru.",
        hack: "K",
        move: "Trag Taschen auf der von der Straße abgewandten Seite, quer über dem Körper, und geh nicht mit Handy in der Hand nahe der Bordsteinkante.",
      },
      {
        name: "Geldautomaten-Skimming und Karteneinbehalt",
        how: "Freistehende Geldautomaten in Touristenzonen sind manipuliert, oder ein Gerät behält deine Karte ein, während eine Person danebensteht und die PIN beobachtet.",
        hack: "C",
        move: "Nutz Geldautomaten in Bankfilialen während der Öffnungszeiten, deck das Tastenfeld ab, und wird eine Karte einbehalten, ruf die Bank an, ohne den Automaten zu verlassen.",
      },
      {
        name: "„Ihre Karte wurde abgelehnt“ — doppeltes Durchziehen",
        how: "Ein Laden oder Restaurant sagt, die erste Zahlung sei fehlgeschlagen, und zieht die Karte erneut ein; beide gehen durch, oder der Betrag wird nach deiner Zustimmung geändert.",
        hack: "K",
        move: "Beobachte Terminal und Betrag, heb jeden Beleg auf, und prüf deinen Kontoauszug. Widersprich jeder Doppelbuchung sofort.",
      },
      {
        name: "„Echt gefälschte“ Uhren und Elektronik auf der Petaling Street",
        how: "Verkäufer in KLs Chinatown und auf Penangs Märkten bieten Fälschungen als Originale zu „Sonderpreisen“ an, oder tauschen das geprüfte Stück gegen ein schlechteres aus, während es in die Tüte kommt.",
        hack: "C",
        move: "Geh davon aus, dass Markenware auf dem Markt gefälscht ist, und richte den Preis danach aus. Beobachte, wie das Stück in die Tüte kommt, und zahl keinen „echten“ Preis.",
      },
    ],
    faqs: [
      {
        q: "Ist Grab der beste Weg, sich in Kuala Lumpur fortzubewegen?",
        a: "Ja. Es ist weit verbreitet, legt den Preis fest und umgeht das Taxameter-Verweigerungsproblem bei Straßentaxis. Vom Flughafen aus ist der offizielle vorausbezahlte Coupon-Taxi-Schalter die gleichwertig sichere Option.",
      },
      {
        q: "Wie verbreitet ist Taschenraub in Malaysia?",
        a: "Taschenraub per Motorrad ist ein bekanntes Risiko in Teilen von KL, Penang und Johor Bahru. Trag Taschen auf der vom Verkehr abgewandten Seite, quer über dem Körper, und steck dein Handy weg, wenn du nahe der Straße gehst.",
      },
    ],
  },

  germany: {
    intro:
      "Deutschland hat wenig Kriminalität und ist weitgehend betrugsfrei. Die realistischen Risiken für Reisende sind Taschendiebe an großen Bahnhöfen und Weihnachtsmärkten, Verwirrung bei Fahrscheinkontrollen im ÖPNV, und die gelegentliche Überteuerung auf dem Oktoberfest.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taschendiebe am Hauptbahnhof und auf Weihnachtsmärkten",
        how: "Teams arbeiten an den großen Bahnhöfen (Berlin, Köln, Frankfurt), in der S-Bahn und in dichten Weihnachtsmarkt-Menschenmengen — einer lenkt ab, einer zieht.",
        hack: "C",
        move: "Tasche zu und vorne am Körper, Handy in der Vordertasche, Portemonnaie nicht in der Gesäßtasche. Sei besonders wachsam auf vollen Bahnsteigen und im Marktgedränge.",
      },
      {
        name: "Falsche Fahrscheinkontrolleure",
        how: "In der U-Bahn/S-Bahn behauptet jemand in Zivil, Fahrscheinkontrolleur zu sein, sagt, dein Ticket sei ungültig, und verlangt ein sofortiges Bar-„Bußgeld“.",
        hack: "A",
        move: "Echte Kontrolleure zeigen einen Dienstausweis und stellen ein schriftliches, später oder in einem Büro zahlbares Bußgeld aus. Verlang den Ausweis, und gib nie Bargeld im Zug.",
      },
      {
        name: "„Petitions“-Klemmbrett-Teams",
        how: "Gruppen (oft nahe dem Brandenburger Tor, dem Kölner Dom, dem Marienplatz) bitten dich, eine Petition für eine Gehörlosen- oder Behinderten-Organisation zu unterschreiben; ein Partner öffnet deine Tasche, oder es wird eine Bar-Spende verlangt.",
        hack: "C",
        move: "Bleib nicht stehen und nimm das Klemmbrett nicht an. Seriöse Organisationen sammeln an Touristenorten kein Bargeld auf diese Art.",
      },
      {
        name: "Überteuerung auf dem Oktoberfest und in Touristenbars",
        how: "Außerhalb der offiziellen Oktoberfest-Zelte und in manchen Touristenbars wird zu wenig eingeschenkt, „reservierter Tisch“-Gebühren tauchen auf, oder die Rechnung wird aufgebläht.",
        hack: "C",
        move: "Bleib bei den offiziellen Festzelten und bepreisten Karten. Prüf dein Wechselgeld und die Rechnung.",
      },
    ],
    faqs: [
      {
        q: "Muss ich mir in Deutschland Sorgen wegen Betrug machen?",
        a: "Sehr wenig. Deutschland hat wenig Kriminalität. Die Hauptsachen sind Taschendiebe an großen Bahnhöfen und Weihnachtsmärkten sowie gelegentliche falsche Fahrschein-„Kontrolleure“ in der U-Bahn, die Bargeld verlangen — echte tragen einen Ausweis und stellen schriftliche Bußgelder aus.",
      },
      {
        q: "Woran erkenne ich einen echten Fahrscheinkontrolleur in Deutschland?",
        a: "Echte Kontrolleure tragen einen Dienstausweis (lass ihn dir zeigen) und stellen ein schriftliches „erhöhtes Beförderungsentgelt“ aus — ein Bußgeld, das du später oder in einem Büro zahlst. Sie nehmen nie Bargeld vor Ort. Wer im Zug Bargeld verlangt, ist nicht echt.",
      },
    ],
  },

  poland: {
    intro:
      "Krakau und Warschau sind sicher und günstig. Die Hauptprobleme sind Taxi-Überteuerung von Bahnhöfen und dem Flughafen, Wechselstuben-„Kantor“-Spannen nahe der Touristenmeile, und aufgeblähte Restaurantrechnungen in der Altstadt.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taxi-Überteuerung von Bahnhöfen und Flughafen",
        how: "Autos, die vor Krakaus und Warschaus Bahnhöfen und Flughäfen warten, verlangen zwei- bis viermal den Taxameter-Preis, oder nutzen einen manipulierten „Nacht“-Tarif.",
        hack: "H",
        move: "Nutz Bolt, Uber oder FREE NOW, oder ein offizielles Flughafentaxi vom markierten Stand mit ausgeschriebenen Preisen. Ignorier Fahrer, die dich drinnen ansprechen.",
      },
      {
        name: "Wechselstuben-„Kantor“-Spannen",
        how: "Wechselstuben direkt am Krakauer Hauptmarkt und auf Warschaus Touristenstraßen werben mit einem Spitzenkurs, der die „Verkaufs“-Seite ist, oder ihn nur ab einem hohen Betrag anwenden — du stehst deutlich schlechter da.",
        hack: "C",
        move: "Nutz einen Bankautomaten, oder einen Kantor eine Straße oder zwei vom Markt entfernt, der dir den exakten Złoty-Betrag zeigt, bevor du zustimmst.",
      },
      {
        name: "Aufgeblähte Restaurantrechnung in der Altstadt",
        how: "Lokale auf und rund um Krakaus Rynek bringen ungefragtes Brot oder Vorspeisen, berechnen ein „Gedeck“, oder ein Kellner trägt eine Trinkgeldzeile ein.",
        hack: "C",
        move: "Prüf die Karte, lehn Ungefragtes ab, und geh die Rechnung durch. Rund 10 % Trinkgeld sind normal, aber deine Entscheidung, keine vorausgefüllte Zeile.",
      },
      {
        name: "„Herrenclub“-Flyer-Falle",
        how: "Männer verteilen nahe Krakaus Markt und Warschaus Zentrum Flyer, die zu einem Club mit „freiem Eintritt“ einladen; drinnen erzeugen Drinks und „Gesellschaft“ eine riesige Rechnung mit Einschüchterung an der Tür.",
        hack: "K",
        move: "Wirf den Flyer weg. Bist du schon drin, zahl nur deine eigenen Getränke, fotografier die Karte, und geh in Richtung einer belebten Straße.",
      },
    ],
    faqs: [
      {
        q: "Wo sollte ich in Krakau Geld wechseln?",
        a: "An einem Bankautomaten oder einem Kantor abseits vom Hauptmarkt, der dir den exakten Betrag zeigt, den du bekommst. Die Wechselstuben direkt am Rynek werben mit irreführenden Spitzenkursen.",
      },
      {
        q: "Sind Taxis in Polen ein Problem?",
        a: "Nur die, die vor Bahnhöfen und Flughäfen auf Touristen warten. App-Fahrten (Bolt, Uber, FREE NOW) sind günstig, legen den Preis fest und sind der einfache Weg, die Überteuerung zu vermeiden.",
      },
    ],
  },

  "costa-rica": {
    intro:
      "Costa Rica ist gastfreundlich, hat aber ein echtes Problem mit Eigentumskriminalität gegen Touristen: zerstochene Reifen am Flughafen, Scheibeneinschlag bei geparkten Mietwagen, und „hilfsbereiter Fremder“-Ablenkungsdiebstahl. Gewaltverbrechen gegen Reisende sind selten.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Zerstochener Reifen am Flughafen",
        how: "Nahe dem Flughafen San José (SJO) durchsticht jemand einen Mietwagenreifen oder zeigt auf einen „platten“; hältst du kurz danach an, um ihn zu wechseln, nimmt ein Komplize Taschen aus dem Auto.",
        hack: "H",
        move: "Bekommst du gleich nach dem Flughafen einen Platten, fahr — notfalls auf der Felge — zu einer belebten Tankstelle oder zurück zur Vermietstation. Halt nicht auf einem ruhigen Streckenabschnitt.",
      },
      {
        name: "Scheibeneinschlag bei Mietwagen",
        how: "Mietwagen werden an Wanderwegen, Stränden, Wasserfällen und Aussichtspunkten anvisiert — Scheiben werden in Sekunden eingeschlagen und Taschen genommen, während du weg bist, manchmal sogar an der Ampel.",
        hack: "K",
        move: "Lass nie irgendetwas sichtbar im Auto, niemals. Nimm Wertsachen mit oder lass sie zu Hause. Nutz bewachte Parkplätze, wo es sie gibt.",
      },
      {
        name: "„Hilfsbereite“ Ablenkung an Geldautomaten und Tankstellen",
        how: "Ein Fremder bietet Hilfe an einem Geldautomaten an oder zeigt auf deinen Reifen oder einen „Fleck“ an einer Tankstelle, während ein Partner etwas aus dem Auto oder deiner Tasche nimmt.",
        hack: "C",
        move: "Lehn jede Hilfe an Geldautomaten und Zapfsäulen ab. Halt das Auto beim Tanken verschlossen und achte auf jeden, der sich nähert.",
      },
      {
        name: "Inoffizielle Taxis („piratas“)",
        how: "Unlizenzierte Taxis, besonders am Flughafen und an Busbahnhöfen, überteuern und rauben gelegentlich aus. Offizielle Taxis sind rot mit gelbem Dreieck (orange am Flughafen).",
        hack: "A",
        move: "Nutz Uber (funktioniert im Raum San José) oder ein offizielles rotes Taxi mit funktionierendem Taxameter („la maría“). Am SJO nutz die offiziellen orangen Flughafentaxis oder einen vorgebuchten Transfer.",
      },
      {
        name: "„Umweltgebühr“ und Parkzuschläge an Stränden",
        how: "An manchen Stränden und Wasserfällen verlangen informelle „Aufseher“ eine nicht offizielle Park- oder Eintrittsgebühr, oder „bewachen dein Auto“ gegen Gebühr und tun dann nichts.",
        hack: "A",
        move: "Zahl nur offizielle, ausgeschilderte Eintrittsgebühren. Ein kleines Trinkgeld für einen echten bewachten Parkplatz ist in Ordnung; ignorier alle anderen.",
      },
    ],
    faqs: [
      {
        q: "Was soll ich tun, wenn mein Mietwagen nahe dem Flughafen San José einen Platten hat?",
        a: "Fahr weiter — notfalls auf der Felge — zu einer belebten Tankstelle oder zurück zur Vermietstation, und wechsle ihn dort. Der „platte Reifen kurz nach dem Flughafen“ ist eine klassische Falle, um Taschen aus dem Auto zu nehmen, während du an einer ruhigen Straße abgelenkt bist.",
      },
      {
        q: "Ist Einbruch in Mietwagen in Costa Rica wirklich so verbreitet?",
        a: "Ja. Mietwagen an Wanderwegen, Stränden und Wasserfällen sind ein Hauptziel, und es kann in Minuten passieren. Die Regel ist absolut: lass nie irgendetwas Sichtbares oder Wertvolles im Auto, egal wo.",
      },
    ],
  },

  "dominican-republic": {
    intro:
      "Die meisten Reisenden bleiben in Resorts, wo die Probleme Timeshare-Druck, überteuerte Ausflüge und Währungstricks sind. Außerhalb der Resorts sind unlizenzierte Taxis und „Motoconcho“-Überteuerung die Hauptsachen, auf die man achten sollte.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Timeshare- / „Mitgliedschafts“-Hartverkauf",
        how: "Resort-„Willkommens“- oder „Gästeservice“-Personal bietet ein kostenloses Frühstück, eine Tour oder Spa-Guthaben im Tausch gegen eine 90-minütige Präsentation, die zu hartem Verkaufsdruck für einen Ferienclub wird, mit „nur heute“-Rabatt.",
        hack: "H",
        move: "Lehn das „kostenlose“ Angebot beim Check-in ab. Nichts Echtes läuft ab, nur weil du den Raum verlässt, um nachzudenken.",
      },
      {
        name: "Überteuerung bei Ausflügen und Taxis",
        how: "Ausflüge, gebucht über Strand-Anwerber oder die Resort-Lobby, kosten weit mehr als dieselbe Tour direkt beim Anbieter; Taxis nennen Touristen-Festpreise ohne Taxameter.",
        hack: "C",
        move: "Buch Ausflüge online bei einem etablierten Anbieter und vergleich Preise. Vereinbare Taxipreise vor dem Einsteigen, oder nutz ein vom Resort organisiertes Auto mit Festpreis.",
      },
      {
        name: "Währungsverwirrung (Peso vs. Dollar)",
        how: "Verkäufer rechnen in Dollar zu einem schlechten Kurs ab, geben Wechselgeld in Peso in der Hoffnung, dass du den Wert nicht kennst, oder „runden“ kräftig auf.",
        hack: "C",
        move: "Kenn den Peso-Kurs, vereinbare die Währung vor der Zahlung, und zähl das Wechselgeld, bevor du weitergehst.",
      },
      {
        name: "„Motoconcho“ und Überteuerung bei unlizenzierten Taxis",
        how: "Motorrad-Taxis und unmarkierte Autos in Santo Domingo und Punta Cana überteuern Touristen erheblich und sind gelegentlich unsicher.",
        hack: "A",
        move: "Nutz Uber, wo verfügbar (Santo Domingo, Santiago), oder ein markiertes, vom Resort empfohlenes Taxi. Meid Motoconchos mit Gepäck oder nachts.",
      },
      {
        name: "Strandverkäufer-„Geschenk“, dann Zahlungsforderung",
        how: "Ein Verkäufer legt dir oder deiner Begleitung ein Armband, eine Muschelkette oder einen Haarzopf „als Geschenk“ an und verlangt dann Bezahlung mit einer Szene.",
        hack: "C",
        move: "Lass dir nichts auflegen. Ein bestimmtes „no, gracias“ ohne stehen zu bleiben reicht.",
      },
    ],
    faqs: [
      {
        q: "Sollte ich für die kostenlosen Extras die Timeshare-Präsentation in der Dominikanischen Republik machen?",
        a: "Nur, wenn du damit klarkommst, ein langes, druckvolles Verkaufsgespräch abzulehnen und rauszugehen. Das „kostenlose“ Frühstück oder die Tour ist Köder für einen Ferienclub-Verkauf mit falschem Nur-heute-Rabatt. Die meisten finden es die Zeit nicht wert.",
      },
      {
        q: "Sind Taxis in Punta Cana und Santo Domingo sicher?",
        a: "Nutz Uber in Santo Domingo, oder von deinem Resort empfohlene markierte Taxis mit vereinbartem Preis. Meid unmarkierte Autos und Motoconchos, besonders mit Gepäck oder nach Einbruch der Dunkelheit, wo Überteuerung und gelegentlicher Raub die Risiken sind.",
      },
    ],
  },

  kenya: {
    intro:
      "Nairobi und die Küste erfordern Wachsamkeit. Für Reisende sind die wiederkehrenden Betrugsmaschen falsche Safari-Anbieter, die Anzahlungen kassieren, Taxi-Überteuerung, Geldautomaten-Kartentausch, und „ich kenne dich vom Hotel“-Ansprachen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Falsche oder „Aktenkoffer“-Safari-Anbieter",
        how: "Eine billige Safari, verkauft auf einer Nairobi-Straße, von einem „Freund“ oder einem schicken Pop-up-Büro, kassiert eine Anzahlung oder Vollzahlung, dann ist das Fahrzeug ein Wrack, sich die Reiseroute ändert, oder der Anbieter verschwindet.",
        hack: "C",
        move: "Buch nur bei einem von der Kenya Association of Tour Operators (KATO) lizenzierten Anbieter, zahl per Karte oder nachvollziehbarer Methode, und gib nie Bargeld an jemanden, der dich angesprochen hat.",
      },
      {
        name: "„Ich kenne dich vom Hotel / Restaurant“",
        how: "Ein freundlicher Mann sagt, er arbeite in deinem Hotel oder habe dich gestern Abend bedient, läuft mit dir mit und lotst dich dann zu einem Laden, einer „Gemeinschaftsprojekt“-Spende, oder verlangt einfach eine Gebühr für seine Zeit.",
        hack: "C",
        move: "Hotelpersonal würdest du erkennen. Zieh dich höflich zurück und folg niemandem. Bei Druck geh in einen Laden oder eine Hotellobby.",
      },
      {
        name: "Taxi-Überteuerung und „kein Taxameter“",
        how: "Straßen- und Flughafentaxis nennen Touristen-Festpreise, mehrfach so hoch wie der reale, oder fahren Umwege.",
        hack: "H",
        move: "Nutz Uber, Bolt oder Little (alle in Nairobi und Mombasa verfügbar), damit der Preis feststeht. Vom Flughafen nutz einen vorgebuchten Transfer oder den offiziellen Taxischalter.",
      },
      {
        name: "Geldautomaten-Kartentausch und Skimming",
        how: "Ein „hilfsbereiter“ Fremder an einem Geldautomaten lenkt dich ab und tauscht deine Karte, oder freistehende Automaten sind manipuliert; das Konto wird mit der beobachteten PIN leergeräumt.",
        hack: "C",
        move: "Nutz Geldautomaten in Bankfilialen oder Einkaufszentren tagsüber, lehn jede Hilfe ab, und deck das Tastenfeld ab. Storniere sofort, wenn eine Karte einbehalten wird.",
      },
      {
        name: "Kunsthandwerk- und „Maasai-Markt“-Preistricks",
        how: "Stände nennen stark überhöhte Startpreise für Schnitzereien und Stoffe und nutzen Schuldgefühl und „Freundespreis“-Druck; manche tauschen das geprüfte Stück gegen ein schlechteres aus.",
        hack: "C",
        move: "Rechne damit, einen Bruchteil des ersten Preises zu zahlen, sei bereit zu gehen, und beobachte, wie dein Stück in die Tüte kommt.",
      },
    ],
    faqs: [
      {
        q: "Wie vermeide ich Safari-Betrug in Kenia?",
        a: "Buch nur über einen KATO-lizenzierten Anbieter, prüf die Lizenz, und zahl per Karte oder einer anderen nachvollziehbaren Methode. Kauf nie eine Safari von jemandem, der dich auf der Straße anspricht, und zahl keine hohe Bar-Anzahlung an ein ungeprüftes „Büro“.",
      },
      {
        q: "Ist es sicher, in Nairobi Taxis zu nutzen?",
        a: "Nutz die Apps — Uber, Bolt oder Little funktionieren alle in Nairobi und Mombasa und legen den Preis fest. Straßen- und Flughafentaxis überteuern Touristen häufig; für den Flughafen buch einen Transfer vor oder nutz den offiziellen Schalter.",
      },
    ],
  },

  austria: {
    intro:
      "Österreich ist sehr sicher. In Wien und Salzburg sind die einzigen echten Probleme Taschendiebe in Touristenmengen und im ÖPNV, aggressive „Mozart-Konzert“-Ticketanwerber, und gelegentliche Taxi-Überteuerung ab dem Flughafen.",
    lastReviewed: "2026-09",
    status: "published",
    scams: [
      {
        name: "Taschendiebe in der U-Bahn und am Stephansdom",
        how: "Teams arbeiten in Wiens U-Bahn (besonders U1/U3), rund um den Stephansplatz und in Salzburgs Altstadt, mit dem üblichen Anrempeln-und-Ziehen.",
        hack: "C",
        move: "Tasche zu und vorne am Körper, Handy eingesteckt. Sei besonders wachsam beim Einsteigen und im Gedränge rund um den Dom.",
      },
      {
        name: "Kostümierte „Mozart“-Konzertanwerber",
        how: "Personen in historischen Perücken und Mänteln nahe der Oper und dem Stephansplatz verkaufen Konzerttickets mit hohem Aufschlag, oder für eine schlechtere Show als beschrieben.",
        hack: "A",
        move: "Kauf an der offiziellen Kasse oder Website der Location. Die kostümierten Verkäufer schlagen Provision auf, und die Location entspricht eventuell nicht deiner Erwartung.",
      },
      {
        name: "Flughafen-Taxi-Überteuerung",
        how: "Fahrer am Flughafen Wien nennen 50–70 € pauschal, wenn der faire Preis ins Zentrum bei etwa 40 € liegt, oder der CAT-Zug / die S-Bahn deutlich günstiger ist.",
        hack: "H",
        move: "Vereinbare den Preis vor dem Einsteigen, nutz ein gebuchtes Flughafentaxi zum Festpreis, oder nimm die S-Bahn (S7), die günstig und direkt ist.",
      },
      {
        name: "„Kostenlose“ Rose oder Armband",
        how: "Jemand drückt dir nahe Touristenorten eine Rose in die Hand oder bindet ein Armband „als Geschenk“ um und verlangt dann Bezahlung.",
        hack: "H",
        move: "Hände in den Taschen, nicht annehmen, weitergehen. Ist es schon am Handgelenk, schuldest du trotzdem nichts.",
      },
    ],
    faqs: [
      {
        q: "Sind die Verkäufer von Mozart-Konzerttickets in Wien seriös?",
        a: "Sie verkaufen echte Tickets, aber mit Aufschlag, und manchmal für eine andere oder schlechtere Location als erwartet. Kauf stattdessen direkt an der offiziellen Kasse oder Website des Konzertsaals.",
      },
      {
        q: "Wie viel sollte ein Taxi vom Flughafen Wien kosten?",
        a: "Etwa 40 € ins Zentrum bei einem gebuchten Festpreis-Taxi. Fahrer, die 50–70 € verlangen, überteuern. Die S7-S-Bahn ist eine günstige, direkte Alternative; der CAT ist schneller, aber teurer.",
      },
    ],
  },
};
