# -*- coding: utf-8 -*-
# Generates the German (de) TravelSafe edition deck — Stage 4 content.
# Output: data/scenarios-de/travelsafe/. Culturally adapted (not translated)
# for German travellers: ADAC, Bundespolizei, Auswärtiges Amt, Zoll,
# Deutsche Bahn, Flughafen Frankfurt/München, Mallorca-/Ferienwohnung-Betrug.
#
# Answer-position balance (16/16/16) is built in at write time via a
# pre-shuffled per-card target-letter assignment — same method as the
# University deck.
import json
import os

OUT_DIR = os.path.join("data", "scenarios-de", "travelsafe")
os.makedirs(OUT_DIR, exist_ok=True)

TRIGGER_LABEL = {"H": "Hetze", "A": "Autorität", "C": "Vertrautheit", "K": "Notbremse"}


def card(num, hack_key, category, title, scenario, best, other_two, explanation,
         pro_tip, tags, diagnostic=False):
    letters = ["A", "B", "C"]
    target = TARGETS[num - 1]
    remaining = [l for l in letters if l != target]
    answers = {target: best}
    scores = {target: 4}
    for letter, (text, score) in zip(remaining, other_two):
        answers[letter] = text
        scores[letter] = score
    safe = [target] + [l for l, (_, s) in zip(remaining, other_two) if s >= 3]

    cid = f"travelsafe-de-tra-{num:02d}"
    all_tags = ["travelsafe", hack_key.lower()] + tags + (["diagnostic"] if diagnostic else [])
    return {
        "id": cid,
        "lang": "de",
        "title": title,
        "edition": "travelsafe",
        "cardType": "scenario",
        "scored": True,
        "category": category,
        "scenario": scenario,
        "answers": answers,
        "scores": scores,
        "safeActions": safe,
        "explanation": explanation,
        "proTip": pro_tip,
        "hackKey": hack_key,
        "hackTrigger": TRIGGER_LABEL[hack_key],
        "tags": all_tags,
        "active": True,
    }


TARGETS = ["A","A","A","C","C","C","B","B","A","C","C","B",
           "A","C","B","A","B","A","C","B","A","C","B","C",
           "B","C","A","B","A","A","B","C","B","B","A","C",
           "B","A","A","B","B","C","A","C","A","C","B","C"]
assert len(TARGETS) == 48

CARDS = []

# ---------------------------------------------------------------- H (1-12)
CARDS.append(card(1, "H", "Flughafen & Gepäck", "Dein Koffer hat noch 12 Minuten",
    "Am Frankfurter Flughafen meldet eine SMS, dein aufgegebenes Gepäck sei „falsch zugeordnet“ und werde in "
    "12 Minuten „endgültig aussortiert“, wenn du nicht über einen Link deine Buchungs- und Kartendaten bestätigst.",
    "Die SMS ignorieren und direkt am Gepäckschalter oder über die offizielle App der Airline nachfragen, ob wirklich ein Problem vorliegt.",
    [("Sofort über den Link die Daten bestätigen, um das Gepäck zu retten.", 0),
     ("Nur die Buchungsnummer eingeben, aber keine Kartendaten.", 1)],
    "Gepäckprobleme werden am Schalter oder in der Airline-App gelöst, nie über eine SMS mit "
    "Kartendatenabfrage und Minutenfrist.",
    "Ein Countdown per SMS löst nie ein echtes Gepäckproblem.",
    ["airport-baggage", "smishing"], diagnostic=True))

CARDS.append(card(2, "H", "Unterkunft", "Die letzte Ferienwohnung auf Mallorca — angeblich",
    "Auf einem Ferienwohnungsportal meldet sich eine Vermieterin für eine günstige Wohnung nahe dem Ballermann: "
    "„Letzte verfügbare Woche, aber nur wenn du in den nächsten Minuten per Vorkasse-Überweisung buchst.“",
    "Nur über die Zahlungsfunktion der Buchungsplattform selbst bezahlen und keine Vorkasse per Überweisung an eine Privatperson leisten.",
    [("Sofort per Überweisung an die Vermieterin zahlen, um die Wohnung zu sichern.", 0),
     ("Nur eine kleine Anzahlung per Überweisung leisten.", 0)],
    "Vorkasse per Überweisung außerhalb der Plattform ist die häufigste Ferienwohnungs-Betrugsmasche — die "
    "Plattform-eigene Zahlung schützt dich, eine private Überweisung nicht.",
    "Bezahl nie außerhalb der Plattform, auf der du gebucht hast.",
    ["accommodation", "rental-scam"], diagnostic=True))

CARDS.append(card(3, "H", "Visa & Einreise", "Dein Visum braucht „einen letzten Schritt“",
    "Kurz vor deinem Fernreise-Abflug kommt eine E-Mail: Dein Visum sei „fast fertig“, brauche aber „einen "
    "letzten Schritt“ — eine sofortige Zahlung über einen Link, sonst platze die Reise.",
    "Den Visumstatus ausschließlich über das offizielle Portal der Botschaft oder des Konsulats prüfen, statt über den Link zu zahlen.",
    [("Über den Link sofort zahlen, um die Reise nicht zu gefährden.", 0),
     ("Bei der im Link genannten Nummer anrufen, um nachzufragen.", 0)],
    "Visumsgebühren werden ausschließlich über die offiziellen Kanäle von Botschaft oder Konsulat erhoben, nie "
    "über einen Last-Minute-Link kurz vor Abflug.",
    "Ein Visum wird nie in letzter Minute per Link „fertig“.",
    ["visas-entry", "phishing"]))

CARDS.append(card(4, "H", "Nahverkehr", "Tippen, um die Fahrpreisnacherhebung zu vermeiden",
    "Im ICE klebt an der Sitzlehne ein QR-Code mit dem Hinweis „Fahrschein hier bestätigen, sonst "
    "Nacherhebung von 60 €“. Der Code führt zu einer Seite, die Kartendaten verlangt.",
    "Den QR-Code ignorieren und stattdessen dem Zugbegleiter das echte, in der DB-Navigator-App gebuchte Ticket zeigen.",
    [("Den Code scannen und die Kartendaten eingeben, um die Nacherhebung zu vermeiden.", 0),
     ("Den Code scannen, aber nur die Ticketnummer eingeben.", 1)],
    "Die Deutsche Bahn erhebt Nachzahlungen über den Zugbegleiter, nie über einen aufgeklebten QR-Code an der "
    "Sitzlehne. Das ist eine bekannte „Quishing“-Masche im Nahverkehr.",
    "Ein aufgeklebter QR-Code an der Sitzlehne ist nie die Deutsche Bahn.",
    ["transit", "quishing"]))

CARDS.append(card(5, "H", "Mietwagen", "Unterschreib hier — der Shuttle wartet",
    "Am Mietwagenschalter drängt der Mitarbeiter, schnell einen zusätzlichen „Vollkasko-Plus“-Vertrag auf "
    "einem Tablet zu unterschreiben, ohne die Details zu erklären, weil „der Shuttle draußen wartet“.",
    "Um einen Moment und eine ausgedruckte Übersicht der Zusatzkosten bitten, bevor irgendetwas unterschrieben wird — der Shuttle wartet notfalls eine Minute.",
    [("Schnell unterschreiben, um den Shuttle nicht zu verpassen.", 0),
     ("Nur mündlich nach den Kosten fragen und dann unterschreiben.", 1)],
    "Zeitdruck am Schalter ist eine bekannte Verkaufstaktik für teure Zusatzverträge — ein seriöser Anbieter "
    "gibt dir die Zeit, das zu lesen, was du unterschreibst.",
    "Ein wartender Shuttle ist kein Grund, ungelesen zu unterschreiben.",
    ["car-rental", "high-pressure-sales"]))

CARDS.append(card(6, "H", "Flüge", "Dein Anschlussflug hat sich „gerade geändert“",
    "Eine SMS kurz vor dem Abflug meldet, dein Anschlussflug sei geändert worden, und verlangt eine sofortige "
    "Umbuchungsgebühr von 45 € über einen Link, sonst verfalle der Sitzplatz.",
    "Den Flugstatus direkt in der App der Airline oder am Check-in-Schalter prüfen, statt über den SMS-Link zu zahlen.",
    [("Die Gebühr sofort über den Link zahlen, um den Sitzplatz zu behalten.", 0),
     ("Bei der Nummer aus der SMS zurückrufen.", 0)],
    "Airlines erheben Umbuchungsgebühren über ihre eigene App oder den Schalter, nie über einen SMS-Link mit "
    "Zeitdruck. Der echte Flugstatus steht immer in der App.",
    "Flugänderungen prüfst du in der App, nie über einen Link aus einer SMS.",
    ["flights", "smishing"]))

CARDS.append(card(7, "H", "Konnektivität", "Flughafen-eSIM: 70 % Rabatt, nur noch sechs Minuten",
    "Ein Bildschirm am Gate zeigt Werbung für eine eSIM mit 70 % Rabatt, „nur noch sechs Minuten gültig“ — der "
    "QR-Code führt zu einer Seite außerhalb bekannter eSIM-Anbieter, die volle Kartendaten verlangt.",
    "Den Rabatt ignorieren und eine eSIM nur über einen bekannten, etablierten Anbieter direkt in dessen eigener App kaufen.",
    [("Den QR-Code scannen und die Kartendaten eingeben, um den Rabatt zu sichern.", 0),
     ("Den Code scannen, aber ein virtuelles Karten-Duplikat verwenden.", 1)],
    "Ein Countdown auf einem Werbebildschirm am Gate hat keinen Einfluss auf echte eSIM-Preise — echte "
    "Anbieter verkaufen über ihre eigene, bekannte App.",
    "Ein Rabatt-Countdown am Gate ist Werbepsychologie, kein echtes Angebot.",
    ["connectivity", "esim-scam"]))

CARDS.append(card(8, "H", "Kreuzfahrt & Ausflüge", "Das Schiff legt ab. Der Link läuft ab.",
    "Kurz vor dem Ablegen bewirbt ein Stand am Hafen einen „letzten Platz“ für einen Landausflug — Buchung nur "
    "über einen privaten Zahlungslink, „bevor das Schiff ablegt“.",
    "Landausflüge nur über die offizielle Buchungsstelle des Reiseveranstalters oder an Bord buchen, nicht über einen privaten Link am Hafen.",
    [("Über den privaten Link sofort buchen und zahlen.", 0),
     ("Nur eine Anzahlung über den Link leisten.", 0)],
    "Ein „letzter Platz“ unter Zeitdruck am Hafen soll verhindern, dass du die offizielle, geprüfte "
    "Buchungsstelle des Reiseveranstalters nutzt.",
    "Landausflüge bucht man an Bord oder offiziell — nie am Hafenstand unter Zeitdruck.",
    ["cruise-excursions", "payment-scam"]))

CARDS.append(card(9, "H", "Flughafen-Services", "Dein Lounge-Zugang „läuft beim Boarding ab“",
    "Eine Mail sagt, dein gebuchter Lounge-Zugang verfalle, sobald das Boarding beginnt, und verlangt eine "
    "sofortige „Verlängerungsgebühr“ über einen Link, um ihn zu behalten.",
    "Den Lounge-Zugang direkt an der Lounge-Rezeption oder über die Airline-App prüfen, statt über den Link zu zahlen.",
    [("Die Verlängerungsgebühr sofort über den Link zahlen.", 0),
     ("Nur die Buchungsnummer über den Link bestätigen.", 1)],
    "Ein Lounge-Zugang „verfällt“ nicht durch das Boarding anderer Flüge — die Lounge-Rezeption oder die "
    "Airline-App zeigen den echten Status.",
    "Lounge-Zugang prüfst du vor Ort, nie über einen Link aus einer Mail.",
    ["airport-services", "phishing"]))

CARDS.append(card(10, "H", "Verlorenes Gepäck", "Dein Koffer wurde gefunden — zahl den Kurier",
    "Eine Nachricht meldet, dein vor Wochen verlorener Koffer sei gefunden worden, und ein Kurier bringe ihn "
    "vorbei — du müsstest aber „die Kurierkosten“ sofort per Guthabenkarte vorab bezahlen.",
    "Den Fund direkt bei der Airline oder dem Flughafen-Fundbüro über die bekannte Nummer bestätigen lassen, statt per Guthabenkarte vorab zu zahlen.",
    [("Die Kurierkosten sofort per Guthabenkarte zahlen, um den Koffer zurückzubekommen.", 0),
     ("Nur die Hälfte der Kurierkosten vorab zahlen.", 0)],
    "Airlines und Fundbüros verlangen keine Vorabzahlung per Guthabenkarte für die Zustellung gefundenen "
    "Gepäcks — das ist eine bekannte Betrugsmasche.",
    "Ein gefundener Koffer braucht keine Guthabenkarte, um zurückzukommen.",
    ["lost-luggage", "advance-fee"]))

CARDS.append(card(11, "H", "Pannenhilfe", "ADAC-Rechnung sofort zahlen, sonst wird das Auto beschlagnahmt",
    "Nach einer Panne im Ausland ruft angeblich der ADAC an: Die Abschleppkosten müssten sofort per "
    "Kartendaten am Telefon beglichen werden, sonst werde das Fahrzeug „von der örtlichen Polizei beschlagnahmt“.",
    "Auflegen und den ADAC über die offizielle Nummer auf deiner Mitgliedskarte oder in der ADAC-App selbst kontaktieren.",
    [("Die Kartendaten sofort am Telefon durchgeben, um die Beschlagnahmung zu vermeiden.", 0),
     ("Nach der Mitgliedsnummer fragen, um die Echtheit zu prüfen.", 1)],
    "Der ADAC zieht Kosten über die reguläre Abrechnung ein, nie per Drohung mit sofortiger "
    "Kartenzahlung am Telefon. Ein Rückruf über die bekannte Nummer klärt es sofort.",
    "Der ADAC droht nie mit sofortiger Beschlagnahmung am Telefon.",
    ["car-rental", "vishing"]))

CARDS.append(card(12, "H", "Hotelbuchungen", "Deine Buchung steht auf Halt — bestätige in 30 Minuten",
    "Eine E-Mail sagt, deine Hotelbuchung stehe „auf Halt“ und werde in 30 Minuten storniert, wenn du nicht "
    "über einen Link deine Kreditkartendaten erneut eingibst.",
    "Die Buchung direkt beim Hotel oder über die Buchungsplattform-App prüfen, statt über den Link erneut Kartendaten einzugeben.",
    [("Die Kartendaten sofort über den Link erneut eingeben.", 0),
     ("Beim Hotel über die im Link angegebene Nummer anrufen.", 0)],
    "Eine echte Buchungsplattform verlangt nie eine erneute Kartendateneingabe über einen externen Link mit "
    "Minutenfrist — der Buchungsstatus steht immer in der App.",
    "Buchungsstatus prüfst du in der App, nie über einen Link mit Countdown.",
    ["hotel-bookings", "phishing"]))

# ---------------------------------------------------------------- A (13-24)
CARDS.append(card(13, "A", "Flüge & Erstattungen", "Deine 486-€-Erstattung ist bereit",
    "Eine Mail im Namen deiner Fluggesellschaft meldet eine Ausgleichszahlung von 486 € für eine alte "
    "Verspätung und bittet, Kontodaten und eine Ausweiskopie über ein Formular „zur Auszahlung“ einzureichen.",
    "Die Erstattung direkt im eigenen Kundenkonto bei der Airline prüfen, statt über ein externes Formular Ausweis- und Kontodaten einzureichen.",
    [("Die Daten über das Formular einreichen, um die Erstattung zu bekommen.", 0),
     ("Nur die Kontodaten einreichen, aber keine Ausweiskopie.", 1)],
    "Airlines zahlen Ausgleichsleistungen über das bestehende Kundenkonto aus — sie verlangen dafür nie eine "
    "zusätzliche Ausweiskopie über ein externes Formular.",
    "Eine Erstattung, die eine Ausweiskopie will, ist keine echte Erstattung.",
    ["flights-refunds", "identity-phishing"], diagnostic=True))

CARDS.append(card(14, "A", "Grenze & Zoll", "„Grenzpolizei“ will eine mobile Geldbuße",
    "Eine Person in Uniform am Grenzübergang behauptet, in deinem Gepäck sei etwas Verbotenes gefunden worden, "
    "und verlangt eine Geldbuße sofort per Karte an einem mobilen Kartenlesegerät, um „das Verfahren zu vermeiden“.",
    "Um einen schriftlichen, offiziellen Bußgeldbescheid mit Dienstnummer bitten und die zuständige Behörde über eine unabhängig gefundene Nummer bestätigen lassen, bevor gezahlt wird.",
    [("Sofort per Karte am mobilen Gerät zahlen, um das Verfahren zu vermeiden.", 0),
     ("Nach dem Namen und der Dienststelle fragen und dann zahlen.", 1)],
    "Echte Grenzbehörden erheben Bußgelder über einen offiziellen, schriftlichen Bescheid, nicht über ein "
    "mobiles Kartenlesegerät direkt am Grenzübergang.",
    "Ein Bußgeld ohne schriftlichen Bescheid ist kein echtes Bußgeld.",
    ["border-customs", "government-impostor"], diagnostic=True))

CARDS.append(card(15, "A", "Hotels", "Die Rezeption ruft im Zimmer an",
    "Ein Anruf im Hotelzimmer, angeblich von der Rezeption, meldet ein Problem mit der Kreditkarte und bittet, "
    "die Kartennummer am Telefon erneut durchzugeben, um die Buchung „zu bestätigen“.",
    "Auflegen und persönlich zur Rezeption gehen, um das angebliche Problem zu klären, statt Kartendaten am Telefon durchzugeben.",
    [("Die Kartennummer am Telefon erneut durchgeben.", 0),
     ("Nur die letzten vier Ziffern der Karte durchgeben.", 0)],
    "Zimmertelefon-Anrufe lassen sich leicht als „Rezeption“ tarnen. Die echte Rezeption ist nur einen "
    "kurzen Gang entfernt und braucht deine Kartennummer nie am Telefon.",
    "Ein Weg zur echten Rezeption ist immer kürzer als ein Betrugsanruf lang.",
    ["hotels", "vishing"]))

CARDS.append(card(16, "A", "Flughafensicherheit", "Die Sicherheitskontrolle hat dein Tablet gefunden",
    "Nach der Sicherheitskontrolle meldet sich jemand mit Ausweis und sagt, dein Tablet sei liegen geblieben — "
    "du müsstest aber zur „Identitätsprüfung“ kurz dein Handy entsperren und ihm zeigen.",
    "Das Handy nicht entsperren und stattdessen direkt zum offiziellen Fundbüro des Sicherheitsbereichs gehen, um das Tablet dort abzuholen.",
    [("Das Handy entsperren und zeigen, um das Tablet zurückzubekommen.", 0),
     ("Nur den Sperrbildschirm zeigen, ohne zu entsperren.", 1)],
    "Ein Ausweis beweist keine echte Berechtigung, dein entsperrtes Handy zu sehen — das offizielle Fundbüro "
    "braucht das nie, um ein gefundenes Gerät zurückzugeben.",
    "Ein gefundenes Tablet braucht nie dein entsperrtes Handy als Gegenleistung.",
    ["airport-security", "impostor"]))

CARDS.append(card(17, "A", "Konsularhilfe", "Ein „Konsularbeamter“ hat gute Nachrichten",
    "Nach einem gemeldeten Notfall im Ausland ruft jemand an, der sich als Mitarbeiter des Auswärtigen Amts "
    "ausgibt, und bittet um deine Kreditkartendaten, um „die Rückreise vorzufinanzieren“.",
    "Auflegen und die Botschaft oder das Konsulat über die offizielle, unabhängig gefundene Nummer selbst kontaktieren.",
    [("Die Kreditkartendaten sofort durchgeben, um die Rückreise zu sichern.", 0),
     ("Nach dem Namen des Beamten fragen und dann die Daten durchgeben.", 1)],
    "Konsularmitarbeiter verlangen keine Kreditkartendaten am Telefon — echte konsularische Hilfe läuft über "
    "offizielle, verifizierbare Kanäle.",
    "Das Auswärtige Amt braucht deine Kartendaten nie am Telefon.",
    ["consular-help", "government-impostor"]))

CARDS.append(card(18, "A", "Mietwagen", "Der „Polizeibericht“-Link nach dem Unfall",
    "Nach einem kleinen Parkschaden am Mietwagen schickt eine angebliche örtliche Polizeidienststelle einen "
    "Link, über den du „den Bericht bestätigen und die Kaution online freigeben“ sollst.",
    "Den Link ignorieren und den Vorfall direkt über die Mietwagenfirma und die tatsächlich vor Ort aufgenommene Anzeige klären.",
    [("Über den Link den Bericht bestätigen und die Kaution freigeben.", 0),
     ("Den Link öffnen, aber nur den Bericht lesen, ohne etwas freizugeben.", 1)],
    "Ein Polizeibericht wird nicht per Link mit Kautionsfreigabe verschickt — das ist eine Phishing-Masche, "
    "die sich den Stress nach einem Unfall zunutze macht.",
    "Eine Kaution gibst du nie über einen Link aus einer unaufgeforderten Mail frei.",
    ["car-rental", "phishing"]))

CARDS.append(card(19, "A", "Reiseversicherung", "Die Bank hat die „Verifizierung nicht bestanden“",
    "Bei der Bearbeitung eines Versicherungsschadens meldet eine Mail, deine Bank habe eine „Verifizierung "
    "nicht bestanden“, und bittet, dich über einen Link erneut im Online-Banking anzumelden.",
    "Den Link ignorieren und sich wie gewohnt direkt über die Banking-App einloggen, um zu prüfen, ob wirklich ein Problem vorliegt.",
    [("Sich über den Link im Online-Banking anmelden, um die Verifizierung zu bestehen.", 0),
     ("Den Link öffnen, aber ein anderes Passwort verwenden.", 0)],
    "Eine Versicherung leitet dich nie zu einem externen Login für dein Online-Banking — das gehört nur in "
    "die eigene Banking-App.",
    "Online-Banking loggst du immer nur über die eigene App ein.",
    ["travel-insurance", "credential-phishing"]))

CARDS.append(card(20, "A", "Airline-Support", "Der blau-verifizierte Airline-Support-Account",
    "Nach einer öffentlichen Beschwerde auf X/Twitter meldet sich ein Account mit blauem Häkchen und "
    "Airline-Logo, bietet Entschädigung an und bittet um deine Buchungsdaten und IBAN per Direktnachricht.",
    "Die offizielle Airline-Website oder App nutzen, statt einem Account per Direktnachricht IBAN und Buchungsdaten zu schicken — ein blaues Häkchen beweist keine echte Airline-Identität.",
    [("Die Buchungsdaten und IBAN per Direktnachricht schicken, weil der Account verifiziert wirkt.", 0),
     ("Nur die Buchungsdaten schicken, aber keine IBAN.", 1)],
    "Ein blaues Häkchen bestätigt nur ein bezahltes Abo, keine echte Identität — Fake-Support-Accounts nutzen "
    "genau diesen Anschein von Autorität aus.",
    "Ein Häkchen ist kein Echtheitsbeweis für einen Airline-Account.",
    ["airline-support", "impostor"]))

CARDS.append(card(21, "A", "Öffentliches WLAN", "„Flughafen-WLAN“ will dein E-Mail-Passwort",
    "Das WLAN-Login am Flughafen verlangt statt der üblichen Zustimmung zu den Nutzungsbedingungen eine "
    "Anmeldung mit deinem vollen E-Mail-Passwort, um „personalisierte Angebote“ zu erhalten.",
    "Die Anmeldung mit dem E-Mail-Passwort verweigern; ein legitimes Gäste-WLAN braucht nie dein echtes E-Mail-Passwort.",
    [("Sich mit dem E-Mail-Passwort anmelden, um WLAN zu bekommen.", 0),
     ("Ein leicht abgewandeltes Passwort verwenden.", 0)],
    "Ein Gäste-WLAN braucht höchstens eine E-Mail-Adresse zur Bestätigung, nie dein echtes Passwort — das "
    "ist eine Methode, Zugangsdaten zu sammeln.",
    "WLAN-Zugang braucht nie dein echtes E-Mail-Passwort.",
    ["public-wifi", "credential-phishing"]))

CARDS.append(card(22, "A", "Bodenverkehr", "Der Mann mit dem Flughafenausweis",
    "Direkt am Ausgang spricht dich jemand mit einem offiziell wirkenden Flughafenausweis an und bietet ein "
    "„offizielles“ Taxi zum Festpreis an, deutlich günstiger als der reguläre Taxistand.",
    "Nur an den offiziellen Taxistand oder eine geprüfte Taxi-App gehen; ein Ausweis am Ausgang beweist keine offizielle Taxi-Autorisierung.",
    [("Mitgehen, weil der Ausweis offiziell wirkt und der Preis günstiger ist.", 0),
     ("Nach dem Preis fragen und dann trotzdem mitgehen.", 0)],
    "Ein Ausweis lässt sich leicht nachmachen oder gehört zu einer anderen Tätigkeit — echte, sichere Taxis "
    "erkennt man am offiziellen Stand oder der geprüften App, nicht an einer Ansprache am Ausgang.",
    "Ein Ausweis am Ausgang ist kein Taxischein.",
    ["ground-transport", "impostor"]))

CARDS.append(card(23, "A", "Zoll", "Dein vergessenes Paket „wird vom Zoll einbehalten“",
    "Eine Mail im Namen des Zolls sagt, ein an dich adressiertes Paket werde einbehalten, bis eine "
    "„Einfuhrabgabe“ von 15 € per Guthabenkarte über einen Link beglichen wird.",
    "Den Link ignorieren und den tatsächlichen Sendungsstatus direkt beim Zoll oder Versanddienst über die offizielle Nummer prüfen.",
    [("Die Einfuhrabgabe sofort per Guthabenkarte über den Link zahlen.", 0),
     ("Nur die Hälfte der Gebühr über den Link zahlen.", 1)],
    "Der Zoll erhebt Einfuhrabgaben nie per Guthabenkarte über einen E-Mail-Link — das ist eine bekannte "
    "Paket-Phishing-Masche.",
    "Der Zoll kassiert nie per Guthabenkarte.",
    ["customs-parcels", "phishing"]))

CARDS.append(card(24, "A", "Grenze & Zoll", "Touristenpolizei — nur Karte",
    "In einer belebten Altstadt hält dich jemand mit „Touristenpolizei“-Schild an und behauptet, du hättest "
    "gegen eine lokale Vorschrift verstoßen — das Bußgeld sei „nur mit Karte an diesem tragbaren Gerät“ zu zahlen.",
    "Um einen offiziellen, schriftlichen Bescheid bitten und den Vorfall bei der nächsten echten Polizeiwache oder über die Botschaft prüfen lassen, statt am tragbaren Gerät zu zahlen.",
    [("Sofort mit Karte am tragbaren Gerät zahlen, um die Sache zu erledigen.", 0),
     ("Nach dem Dienstausweis fragen und dann zahlen.", 1)],
    "„Nur mit Karte an diesem Gerät“ ist ein starkes Warnsignal — echte Behörden bieten immer einen "
    "offiziellen, überprüfbaren Zahlungsweg mit schriftlichem Beleg.",
    "Ein Bußgeld nur per Karte an einem tragbaren Gerät ist meist kein echtes Bußgeld.",
    ["border-customs", "government-impostor"]))

# ---------------------------------------------------------------- C (25-36)
CARDS.append(card(25, "C", "Reisebüro & Identität", "Das Reisebüro braucht deinen Pass — noch einmal",
    "Ein Reisebüro, über das du schon öfter gebucht hast, bittet per Mail erneut um eine Passkopie „zur "
    "Aktualisierung der Unterlagen“, obwohl die Reise längst bestätigt und bezahlt ist.",
    "Beim Reisebüro persönlich oder telefonisch über die bekannte Nummer nachfragen, warum eine erneute Passkopie nötig sein soll, bevor du sie schickst.",
    [("Die Passkopie sofort schicken, weil du dem Reisebüro schon oft vertraut hast.", 0),
     ("Nur eine teilweise geschwärzte Passkopie schicken.", 3)],
    "Frühere Zusammenarbeit ist kein Grund für eine unbegründete erneute Datenanfrage — ein E-Mail-Konto kann "
    "kompromittiert sein, auch bei einem bekannten Anbieter.",
    "Vertrauen aus der Vergangenheit rechtfertigt keine unbegründete neue Datenanfrage.",
    ["travel-agents-identity", "account-takeover"], diagnostic=True))

CARDS.append(card(26, "C", "Familie im Ausland", "Deine Schwester weint am Telefon",
    "Ein Anruf klingt wie deine Schwester, die gerade im Ausland unterwegs ist: Sie habe einen Unfall gehabt "
    "und brauche sofort 500 € per Überweisung an ein „Krankenhauskonto“, könne aber gerade „nicht lange reden“.",
    "Auflegen und deine Schwester über die gespeicherte Nummer oder einen Videoanruf direkt erreichen, bevor irgendetwas überwiesen wird.",
    [("Sofort überweisen, weil die Stimme genau wie deine Schwester klingt.", 0),
     ("In der Familiengruppe fragen, ob schon jemand mit ihr gesprochen hat.", 2)],
    "KI-Stimmenklone werden immer überzeugender — „kann gerade nicht lange reden“ soll verhindern, dass du "
    "sie direkt erreichst. Ein Rückruf oder Videoanruf klärt es in Minuten.",
    "„Kann nicht lange reden“ ist der Moment, gerade einen Rückruf zu versuchen.",
    ["family-abroad", "voice-clone"], diagnostic=True))

CARDS.append(card(27, "C", "Touren", "Der Reiseleiter hat ein „neues Zahlungskonto“",
    "Mitten in einer gebuchten Gruppenreise teilt der Reiseleiter mit, das Zahlungskonto für die "
    "Resttagesausflüge habe sich geändert — Zahlung jetzt an ein neues, privates Konto statt an den "
    "Reiseveranstalter.",
    "Beim Reiseveranstalter direkt über die offizielle Nummer nachfragen, ob der Kontowechsel wirklich stimmt, bevor Geld an das neue Konto geht.",
    [("Sofort an das neue Konto zahlen, weil der Reiseleiter es persönlich vor Ort sagt.", 0),
     ("Mit anderen Mitreisenden besprechen, ob sie dasselbe gehört haben.", 2)],
    "Eine persönliche Ansage vor Ort ersetzt keine Bestätigung beim Veranstalter — ein Kontowechsel wird immer "
    "offiziell und nachprüfbar kommuniziert.",
    "Ein neues Konto bestätigst du beim Veranstalter, nicht nur vor Ort.",
    ["tours", "payment-scam"]))

CARDS.append(card(28, "C", "Bonusmeilen", "40 % Bonusmeilen — alle teilen es gerade",
    "Ein Link zu angeblich 40 % Bonusmeilen beim Vielfliegerprogramm verbreitet sich gerade in einer "
    "Reise-Facebook-Gruppe — er verlangt, sich mit dem Programm-Login auf einer externen Seite anzumelden.",
    "Den Link ignorieren und Bonusaktionen nur direkt in der offiziellen App oder Website des Vielfliegerprogramms prüfen.",
    [("Sich über den externen Link anmelden, weil viele in der Gruppe es schon gemacht haben.", 0),
     ("Den Login auf der externen Seite mit einem anderen Passwort testen.", 0)],
    "Dass viele in einer Gruppe etwas geteilt haben, macht einen externen Login nicht sicherer — echte "
    "Bonusaktionen laufen immer über die offizielle App.",
    "Viele Mitmacher in einer Gruppe sind kein Sicherheitsbeweis.",
    ["loyalty-points", "credential-phishing"]))

CARDS.append(card(29, "C", "Reiseangebote", "Dein Lieblings-Creator hat einen geheimen Rabattcode",
    "Ein Reise-Influencer, dem du seit Jahren folgst, bewirbt einen „geheimen“ Rabattcode für ein Luxushotel — "
    "Buchung nur über einen externen Link mit sofortiger Vollzahlung per Überweisung.",
    "Das Hotel unabhängig über die offizielle Website oder eine bekannte Buchungsplattform prüfen und dort buchen, statt über den externen Link mit Vorkasse.",
    [("Über den externen Link sofort per Überweisung buchen, weil der Creator vertrauenswürdig wirkt.", 0),
     ("Nur eine Anzahlung über den Link leisten.", 0)],
    "Bekanntheit und Vertrauen in einen Creator sind kein Ersatz für eine geprüfte Buchung — ein „geheimer“ "
    "Code mit Vorkasse per Überweisung ist ein Warnsignal, unabhängig davon, wer ihn bewirbt.",
    "Ein bekannter Name macht eine Vorkasse-Überweisung nicht sicherer.",
    ["travel-deals", "advance-fee"]))

CARDS.append(card(30, "C", "Ferienwohnungen", "Der Gastgeber braucht „noch eine Kaution“",
    "Kurz nach der bestätigten Buchung schreibt der Gastgeber der Ferienwohnung, es sei „noch eine zusätzliche "
    "Kaution“ nötig, diesmal per Überweisung direkt an ihn statt über die Buchungsplattform.",
    "Die Zahlung ausschließlich über die Buchungsplattform abwickeln und eine Zahlungsaufforderung außerhalb der Plattform ablehnen oder beim Support der Plattform melden.",
    [("Die zusätzliche Kaution direkt an den Gastgeber überweisen.", 0),
     ("Nur die Hälfte der zusätzlichen Kaution überweisen.", 0)],
    "Zahlungsaufforderungen außerhalb der Buchungsplattform sind die häufigste Betrugsmasche bei "
    "Ferienwohnungen — die Plattform-eigene Zahlung ist immer der sichere Weg.",
    "Jede Zahlung außerhalb der Plattform ist ein Warnsignal.",
    ["vacation-rentals", "payment-scam"]))

CARDS.append(card(31, "C", "Gruppenreisen", "Der Kassenwart der Gruppe will einen schnellen Nachschuss",
    "In der Gruppenreise-Chatgruppe bittet der Kassenwart plötzlich um einen zusätzlichen Nachschuss von 50 € "
    "pro Person, „weil die Unterkunft teurer wurde“, an ein Konto, das du noch nicht kennst.",
    "In der Gruppe direkt nachfragen und die neue Kontoverbindung persönlich beim Kassenwart bestätigen lassen, bevor du zahlst.",
    [("Den Nachschuss sofort an das unbekannte Konto überweisen.", 0),
     ("Nur die Hälfte des Nachschusses überweisen.", 0)],
    "Eine unbekannte neue Kontoverbindung in einer Gruppenchat-Nachricht ist ein bekanntes Zeichen für einen "
    "übernommenen Account oder eine unterwanderte Gruppe.",
    "Eine neue Kontoverbindung bestätigst du persönlich, nicht nur im Chat.",
    ["group-travel", "account-takeover"]))

CARDS.append(card(32, "C", "Meilen & Punkte", "Ein Forums-Veteran bietet die fehlenden Meilen an",
    "In einem Vielflieger-Forum bietet ein langjähriges, angesehenes Mitglied an, dir gegen eine kleine Gebühr "
    "„fehlende Meilen“ auf dein Konto zu übertragen — dafür brauche er kurz deinen Programm-Login.",
    "Das Angebot ablehnen; kein legitimer Meilentransfer läuft über die Weitergabe deines Programm-Logins an eine fremde Person, egal wie angesehen sie im Forum ist.",
    [("Den Login weitergeben, weil die Person im Forum einen guten Ruf hat.", 0),
     ("Ein Zweit-Konto für den Transfer erstellen.", 1)],
    "Ein guter Ruf in einem Forum ist kein Identitätsnachweis — Meilentransfers laufen ausschließlich über die "
    "offiziellen Programme der Airline, nie über einen weitergegebenen Login.",
    "Ein Forumsruf ersetzt keinen offiziellen Meilentransfer.",
    ["points-miles", "credential-phishing"]))

CARDS.append(card(33, "C", "Romantik im Urlaub", "Dein Urlaubsflirt hat eine „einfache Investition“",
    "Eine Urlaubsbekanntschaft, mit der du seit der Reise täglich schreibst, erzählt begeistert von einer "
    "Trading-App, in die ihr „gemeinsam“ investieren könntet, um „die nächste Reise zu finanzieren“.",
    "Die Plattform unabhängig recherchieren und mit niemandem, den du erst aus dem Urlaub kennst, gemeinsam über eine Geldanlage entscheiden.",
    [("Gemeinsam investieren, weil die Verbindung sich echt anfühlt.", 0),
     ("Nur einen kleinen Betrag investieren, um es zu testen.", 0)],
    "Eine echte Verbindung braucht keine gemeinsame Geldanlage, um zu wachsen — das ist ein bekanntes Muster "
    "romantisch getarnter Investment-Betrugsmaschen.",
    "Wer dich zuerst verliebt und dann investieren lässt, will dein Geld, nicht dein Herz.",
    ["romance-abroad", "romance-scam"]))

CARDS.append(card(34, "C", "Zuhause während der Reise", "Der Haustiersitter braucht den Alarmcode",
    "Während du im Urlaub bist, schreibt der Haustiersitter, das Alarmsystem piepe ständig, und bittet um den "
    "vollständigen Alarmcode per SMS, um es „auszuschalten“.",
    "Ihn anrufen, um das Problem genauer zu verstehen, und den vollständigen Code nur nennen, wenn er wirklich notwendig ist — besser: einen begrenzten Gastcode einrichten, statt den Hauptcode per SMS zu teilen.",
    [("Den vollständigen Alarmcode sofort per SMS schicken.", 0),
     ("Den Code als Sprachnachricht statt als SMS schicken.", 1)],
    "Ein per SMS verschickter Code bleibt lesbar gespeichert. Ein begrenzter Gastcode für den Sitter schützt "
    "genauso gut, ohne den Hauptcode preiszugeben.",
    "Für einen Sitter reicht ein Gastcode — nie der Hauptcode per SMS.",
    ["home-while-away", "physical-security"]))

CARDS.append(card(35, "C", "Geldwechsel", "Ein Ortsansässiger bietet an, Geld zu wechseln",
    "Auf dem Markt bietet dir eine freundliche, ortskundig wirkende Person an, deine Euro „zum besten Kurs der "
    "Stadt“ in bar zu wechseln, statt zur offiziellen Wechselstube zu gehen.",
    "Nur bei einer offiziellen Wechselstube oder Bank wechseln, auch wenn der inoffizielle Kurs besser klingt.",
    [("Bei der Person auf dem Markt wechseln, weil sie freundlich und ortskundig wirkt.", 0),
     ("Nur einen kleinen Betrag bei der Person testweise wechseln.", 0)],
    "Freundlichkeit und Ortskenntnis sind kein Sicherheitsnachweis — inoffizielle Geldwechsler nutzen oft "
    "Falschgeld oder Ablenkungstricks beim Zählen.",
    "Der beste Kurs auf der Straße kostet meist mehr, nicht weniger.",
    ["currency-exchange", "street-scam"]))

CARDS.append(card(36, "C", "Bodenverkehr", "Der Gastgeber empfiehlt seinen Cousin als Fahrer",
    "Der Gastgeber deiner Ferienwohnung empfiehlt herzlich seinen „Cousin“ als privaten Fahrer für "
    "Flughafentransfers, deutlich günstiger als ein reguläres Taxi oder eine App.",
    "Für den Flughafentransfer eine offizielle Taxi-App oder den regulären Taxistand nutzen, auch wenn die Empfehlung persönlich und freundlich gemeint ist.",
    [("Den Cousin nehmen, weil die Empfehlung vom Gastgeber persönlich kommt.", 0),
     ("Nach dem Preis fragen und dann trotzdem mitfahren.", 0)],
    "Eine persönliche Empfehlung ist kein Sicherheits- oder Preisschutz — ein unregulierter privater Fahrer "
    "hat keine Versicherung oder Aufsicht wie ein offizielles Taxi.",
    "Eine herzliche Empfehlung ersetzt keine Taxi-Lizenz.",
    ["ground-transport", "unlicensed-transport"]))

# ---------------------------------------------------------------- K (37-48)
CARDS.append(card(37, "K", "Bodenverkehr", "Das Taxi-Terminal ist „kaputt“",
    "Am Taxistand sagt der Fahrer, das Kartenterminal sei „gerade kaputt“, und schickt dich zu einem "
    "„Kollegen“ nebenan, der das Geld in bar für ihn entgegennimmt.",
    "Nicht bei einer fremden Person bar zahlen; entweder auf ein funktionierendes Terminal bestehen oder ein anderes, reguläres Taxi nehmen.",
    [("Bei dem „Kollegen“ nebenan bar zahlen, wie vorgeschlagen.", 0),
     ("Nur die Hälfte des Fahrpreises beim Kollegen zahlen.", 0)],
    "Eine dritte, fremde Person, die „für den Fahrer“ Geld entgegennimmt, ist ein bekanntes Muster, um die "
    "Zahlung unnachvollziehbar zu machen.",
    "Zahl immer direkt an die Person, die dich gefahren hat — nie an einen „Kollegen“.",
    ["ground-transport", "cash-scam"], diagnostic=True))

CARDS.append(card(38, "K", "Konnektivität", "Der SIM-Kiosk will zwei Fotos",
    "Ein SIM-Kartenkiosk am Bahnhof verlangt für die Aktivierung einer Prepaid-Karte ein Foto deines "
    "Ausweises UND ein Selfie mit dem Ausweis in der Hand, angeblich „zur gesetzlichen Registrierung“.",
    "Nur bei einem etablierten, bekannten Mobilfunkanbieter registrieren und keine Selfie-mit-Ausweis-Kombination an einen kleinen Straßenkiosk geben.",
    [("Beide Fotos machen und dem Kiosk geben, um die SIM-Karte zu aktivieren.", 0),
     ("Nur das Ausweisfoto geben, aber kein Selfie.", 1)],
    "Ein Foto des Ausweises zusammen mit einem Selfie ist der Rohstoff für Identitätsdiebstahl — echte, "
    "gesetzlich vorgeschriebene Registrierungen laufen über etablierte Anbieter mit nachvollziehbarem Prozess.",
    "Ausweis plus Selfie zusammen gehören nur zu einem vertrauenswürdigen, bekannten Anbieter.",
    ["connectivity", "identity-theft"], diagnostic=True))

CARDS.append(card(39, "K", "Geldautomaten", "Ein hilfsbereiter Fremder kennt den Trick",
    "Am Geldautomaten scheint die Karte stecken zu bleiben. Ein hilfsbereiter Fremder erklärt, man müsse dafür "
    "die PIN „noch einmal zur Bestätigung“ eingeben, während er in der Nähe steht.",
    "Die PIN nicht in Anwesenheit der fremden Person eingeben; den Automaten verlassen und die Bank über die Sperr-Hotline kontaktieren.",
    [("Die PIN wie vorgeschlagen erneut eingeben, während die Person zusieht.", 0),
     ("Die PIN eingeben, aber die Hand dabei verdecken.", 1)],
    "Ein „steckengebliebener“ Automat mit einem zufällig hilfsbereiten Fremden in der Nähe ist eine bekannte "
    "Kartenfallen-Masche — die richtige Reaktion ist, die Karte sperren zu lassen, nicht die PIN erneut einzugeben.",
    "Bei einer feststeckenden Karte: Bank anrufen, nicht die PIN vor Fremden wiederholen.",
    ["atms", "card-trapping"]))

CARDS.append(card(40, "K", "Zahlungen", "Das Terminal bietet einen „garantierten Wechselkurs“",
    "An einem Zahlungsterminal im Ausland erscheint die Frage, ob in Euro oder Landeswährung abgerechnet "
    "werden soll, mit dem Hinweis „Euro-Abrechnung garantiert den besten Kurs für Sie“.",
    "Immer in der Landeswährung zahlen lassen; die „garantierte“ Euro-Abrechnung des Terminals hat fast immer einen deutlich schlechteren Wechselkurs eingepreist.",
    [("Die Euro-Abrechnung wählen, weil sie „garantiert“ den besten Kurs verspricht.", 0),
     ("Das Terminal fragen, welcher Kurs gilt, und dann Euro wählen.", 0)],
    "Diese „dynamische Währungsumrechnung“ am Terminal ist eine legale, aber schlechte Wahl — der "
    "eingepreiste Kurs ist fast immer teurer als der reguläre Kurs deiner eigenen Bank oder Karte.",
    "Zahl im Ausland immer in der Landeswährung, nie in der „garantierten“ Euro-Option.",
    ["payments", "dynamic-currency-conversion"]))

CARDS.append(card(41, "K", "Laden & Apps", "Das Ladegerät braucht eine App — per QR-Code",
    "An einer öffentlichen Ladestation am Flughafen verlangt ein Aufkleber, vor dem Laden eine App über einen "
    "QR-Code zu installieren, um „die Ladeleistung zu optimieren“.",
    "Die App nicht installieren; ein normales USB- oder Steckdosen-Ladegerät braucht nie eine zusätzliche App über einen aufgeklebten QR-Code.",
    [("Die App installieren, um besser laden zu können.", 0),
     ("Die App installieren, aber die Berechtigungen danach einschränken.", 1)],
    "Öffentliche Ladestationen, die eine App-Installation über einen Aufkleber-QR-Code verlangen, sind eine "
    "bekannte Schadsoftware-Masche („Juice Jacking“-Variante).",
    "Ein Ladegerät braucht keine App, um Strom zu liefern.",
    ["charging-apps", "malware"]))

CARDS.append(card(42, "K", "Konten", "Eine MFA-Anfrage kommt genau am Gate",
    "Direkt am Gate, kurz vor dem Boarding, bekommst du eine unerwartete MFA-Bestätigungsanfrage für dein "
    "E-Mail-Konto, obwohl du selbst gerade nichts angefragt hast.",
    "Die Anfrage ablehnen, wenn du selbst nichts ausgelöst hast, und das Passwort sobald wie möglich ändern; eine unerwartete MFA-Anfrage bestätigt meist einen fremden Login-Versuch.",
    [("Die Anfrage bestätigen, weil es schnell gehen muss und das Boarding beginnt.", 0),
     ("Die Anfrage ignorieren, aber später eine zweite Anfrage bestätigen.", 0)],
    "Der Zeitdruck vor dem Boarding ändert nichts daran, dass eine selbst nicht ausgelöste MFA-Anfrage fast "
    "immer einen Angreifer bestätigt, nicht dich selbst.",
    "Eine MFA-Anfrage, die du nicht ausgelöst hast, ist immer ein Nein — auch am Gate.",
    ["mfa", "mfa-fatigue"]))

CARDS.append(card(43, "K", "Bordkarten", "Füg diese Bordkarte deiner Wallet hinzu",
    "Eine SMS im Namen der Airline schickt einen Link, um die Bordkarte „bequem zur Handy-Wallet "
    "hinzuzufügen“ — der Link führt aber zu einer Seite außerhalb der offiziellen Airline-App.",
    "Die Bordkarte ausschließlich über die offizielle Airline-App oder die offizielle Check-in-Bestätigung zur Wallet hinzufügen, nicht über einen externen Link.",
    [("Über den Link die Bordkarte zur Wallet hinzufügen.", 0),
     ("Den Link öffnen, um nur die Flugdaten zu prüfen.", 1)],
    "Eine echte digitale Bordkarte kommt immer aus der offiziellen Airline-App oder dem offiziellen Check-in, "
    "nie über einen separaten SMS-Link.",
    "Eine Bordkarte holst du dir aus der Airline-App, nie aus einem SMS-Link.",
    ["boarding-passes", "phishing"]))

CARDS.append(card(44, "K", "Zoll & Pakete", "Deine vergessene Jacke wird „vom Zoll einbehalten“",
    "Eine Mail meldet, eine im Hotel vergessene Jacke sei per Post an dich unterwegs, werde aber „vom Zoll "
    "einbehalten“, bis eine Gebühr per Überweisung an ein privates Konto gezahlt wird.",
    "Nicht an das private Konto zahlen und den Sendungsstatus direkt beim Hotel oder Versanddienst über die offizielle Nummer nachfragen.",
    [("Die Gebühr sofort an das private Konto überweisen, um die Jacke zurückzubekommen.", 0),
     ("Nur die Hälfte der Gebühr überweisen.", 0)],
    "Echte Zollgebühren gehen nie an ein privates Konto — sie werden über den offiziellen Versanddienst oder "
    "direkt beim Zoll erhoben.",
    "Der Zoll hat kein privates Konto.",
    ["customs-parcels", "payment-scam"]))

CARDS.append(card(45, "K", "Mobile Zahlungen", "Der Händler bittet, Apple Pay „zu verifizieren“",
    "An einem Marktstand im Ausland bittet der Verkäufer, statt einfach zu bezahlen, dein Handy zu entsperren "
    "und eine „Testzahlung“ über Apple Pay/Google Pay zu bestätigen, „um zu prüfen, ob es funktioniert“.",
    "Das Handy nicht entsperren oder eine „Testzahlung“ bestätigen; eine echte Zahlung ist immer die einzige Zahlung, eine „Testzahlung“ gibt es nicht.",
    [("Das Handy entsperren und die Testzahlung bestätigen.", 0),
     ("Nur einen kleinen Betrag als Testzahlung bestätigen.", 0)],
    "Eine „Testzahlung“ vor der eigentlichen Zahlung existiert bei mobilen Bezahldiensten nicht — jede "
    "bestätigte Zahlung ist eine echte, abgebuchte Zahlung.",
    "Eine „Testzahlung“ ist immer eine echte Zahlung.",
    ["mobile-payments", "payment-scam"]))

CARDS.append(card(46, "K", "Karten & Buchungen", "Der „offizielle“ Kartenpin verkauft Tickets",
    "In einer beliebten Karten-App zeigt ein Pin an einer Sehenswürdigkeit „offizielle Tickets, kein "
    "Anstehen“ — der Link führt zu einer Seite außerhalb der echten Website der Sehenswürdigkeit.",
    "Tickets nur über die offizielle Website der Sehenswürdigkeit oder eine bekannte, geprüfte Ticketplattform kaufen, nicht über einen Kartenpin-Link.",
    [("Über den Kartenpin-Link kaufen, weil er „offiziell“ aussieht.", 0),
     ("Den Link öffnen, aber nur mit einer Wegwerf-Kreditkarte zahlen.", 1)],
    "Jeder kann einen Kartenpin mit beliebigem Text und Link versehen — das macht ihn nicht offiziell. Die "
    "echte Website der Sehenswürdigkeit ist immer der sichere Weg.",
    "Ein Pin auf der Karte ist keine offizielle Ticketstelle.",
    ["maps-bookings", "fake-listing"]))

CARDS.append(card(47, "K", "Ferienwohnungen", "Die Unterkunft meldet sich — gib die Karte erneut ein",
    "Nach dem Check-in schreibt die Ferienwohnung-App, es gebe ein Problem mit der Zahlung, und bittet, die "
    "Kartendaten über einen neuen Link erneut einzugeben, „um den Aufenthalt zu bestätigen“.",
    "Die Kartendaten nicht über einen externen Link erneut eingeben, sondern den Support der Buchungsplattform direkt über die App kontaktieren.",
    [("Die Kartendaten sofort über den neuen Link erneut eingeben.", 0),
     ("Nur die letzten vier Ziffern der Karte erneut eingeben.", 0)],
    "Eine bereits bezahlte Buchung braucht keine erneute Kartendateneingabe über einen externen Link — der "
    "echte Support der Plattform löst Zahlungsprobleme direkt in der App.",
    "Bereits bezahlt heißt bereits bezahlt — keine erneute Karteneingabe nötig.",
    ["vacation-rentals", "phishing"]))

CARDS.append(card(48, "K", "Gerätesicherheit", "Dein gestohlenes Handy: tippen, um den Standort zu sehen",
    "Nach einem Handy-Diebstahl im Urlaub bekommst du eine SMS von einer unbekannten Nummer: „Wir haben dein "
    "Handy gefunden, tippe hier, um den Standort zu sehen“ — der Link verlangt deine Apple-/Google-ID-Zugangsdaten.",
    "Den Link nicht öffnen und den Standort ausschließlich über die offizielle „Mein Gerät suchen“-Funktion auf einem anderen eigenen Gerät prüfen.",
    [("Über den Link die Apple-/Google-ID eingeben, um den Standort zu sehen.", 0),
     ("Den Link öffnen, aber ein anderes Passwort verwenden.", 0)],
    "Die echte Standortfunktion läuft ausschließlich über die offizielle App auf einem eigenen Gerät — ein "
    "SMS-Link, der nach der ID fragt, will das Konto übernehmen, nicht das Handy zurückgeben.",
    "Ein gestohlenes Handy suchst du in der eigenen offiziellen App, nie über einen fremden SMS-Link.",
    ["device-safety", "credential-phishing"]))

assert len(CARDS) == 48, f"expected 48 scored cards, got {len(CARDS)}"
for key in ("H", "A", "C", "K"):
    n = sum(1 for c in CARDS if c["hackKey"] == key)
    assert n == 12, f"{key}: expected 12, got {n}"
    d = sum(1 for c in CARDS if c["hackKey"] == key and "diagnostic" in c["tags"])
    assert d == 2, f"{key} diagnostic: expected 2, got {d}"

pos_count = {"A": 0, "B": 0, "C": 0}
for c in CARDS:
    best = max(c["scores"], key=lambda k: c["scores"][k])
    pos_count[best] += 1
assert pos_count == {"A": 16, "B": 16, "C": 16}, f"unbalanced positions: {pos_count}"

for c in CARDS:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

WILD = [
    {
        "id": "travelsafe-de-wild-tra-w1",
        "lang": "de",
        "title": "TravelSafe-Blitzrunde: Rote Flaggen",
        "edition": "travelsafe",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "TravelSafe-Onlinerunde: Jede Person hat 20 Sekunden, um ein Warnsignal aus der letzten "
                    "TravelSafe-Karte zu nennen, ohne eine andere Person zu wiederholen.",
        "answers": {
            "A": "Die Runde ohne Wiederholung durchspielen.",
            "B": "Passen.",
            "C": "Eine schwache Antwort höflich infrage stellen.",
            "D": "Der Gastgeber verrät die Musterantwort.",
        },
        "scores": {"A": 4, "B": 0, "C": 2, "D": 0},
        "safeActions": ["A", "C"],
        "explanation": "TravelSafe-Blitzrunde: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine genaue, konkrete sichere Handlung zählt mehr als "
                       "ein vager Ratschlag.",
        "proTip": "Nur direkt nach einer Szenariokarte einsetzen, nie als eigenständiges Minispiel.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["travelsafe", "online-play"],
        "active": True,
    },
    {
        "id": "travelsafe-de-wild-tra-w2",
        "lang": "de",
        "title": "TravelSafe-Kanalwechsel",
        "edition": "travelsafe",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "TravelSafe-Onlinerunde: Ersetze den riskanten Kanal aus der letzten TravelSafe-Karte "
                    "durch den sichersten passenden Prüfkanal.",
        "answers": {
            "A": "Einen konkreten, sichereren Kanal nennen.",
            "B": "Nur „sei vorsichtig“ sagen.",
            "C": "Den ursprünglichen riskanten Kanal wiederholen.",
            "D": "Den Gastgeber bitten, die Karte zu überspringen.",
        },
        "scores": {"A": 4, "B": 1, "C": 1, "D": 0},
        "safeActions": ["A"],
        "explanation": "TravelSafe-Kanalwechsel: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine gute Antwort nennt den konkreten Kanal.",
        "proTip": "Gute Antworten nennen den genauen Kanal: offizielle App, Rezeption/Schalter vor Ort, "
                  "Botschaft/Konsulat, ein Anruf bei der echten Person, Kundenservice-Hotline.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["travelsafe", "online-play"],
        "active": True,
    },
]
for c in WILD:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

print(f"Wrote {len(CARDS)} scored cards + {len(WILD)} wild cards to {OUT_DIR}")
print("position distribution:", pos_count)
