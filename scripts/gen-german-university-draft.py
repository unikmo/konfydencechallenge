# -*- coding: utf-8 -*-
# Generates the German (de) University edition deck — Stage 4 content.
# Output: data/scenarios-de/university/. Culturally adapted (not translated)
# for German student life: WG-Zimmer, BAföG, Prüfungsamt, Rückmeldung,
# Ausländerbehörde, Hiwi-Jobs, Fachschaft/AStA, Deutschlandticket.
#
# Answer-position balance is fixed at write time this round (lesson from the
# School deck, which had to be rebalanced after the fact): each card's
# correct answer is placed at a pre-shuffled target letter (16 A / 16 B /
# 16 C across the 48 cards), not always the same slot out of habit.
import json
import os

OUT_DIR = os.path.join("data", "scenarios-de", "university")
os.makedirs(OUT_DIR, exist_ok=True)

TRIGGER_LABEL = {"H": "Hetze", "A": "Autorität", "C": "Vertrautheit", "K": "Notbremse"}


def card(num, hack_key, category, title, scenario, best, other_two, explanation,
         pro_tip, tags, diagnostic=False):
    """
    best: the correct-answer text.
    other_two: [(text, score), (text, score)] for the other two options, in
      the order they should land in the two non-best letters (alphabetically
      by whichever letters remain). Scores for `best` is always 4.
    The letter the correct answer lands on is pulled from TARGETS[num-1].
    """
    letters = ["A", "B", "C"]
    target = TARGETS[num - 1]
    remaining = [l for l in letters if l != target]
    answers = {target: best}
    scores = {target: 4}
    for letter, (text, score) in zip(remaining, other_two):
        answers[letter] = text
        scores[letter] = score
    safe = [target] + [l for l, (_, s) in zip(remaining, other_two) if s >= 3]

    cid = f"university-de-uni-{num:02d}"
    all_tags = ["university", hack_key.lower()] + tags + (["diagnostic"] if diagnostic else [])
    return {
        "id": cid,
        "lang": "de",
        "title": title,
        "edition": "university",
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


TARGETS = ["C","C","C","A","C","A","B","A","C","B","A","C",
           "B","C","B","B","B","A","A","B","A","A","B","B",
           "A","C","A","B","A","B","C","A","B","C","A","C",
           "C","B","B","A","C","C","B","B","A","C","C","A"]
assert len(TARGETS) == 48

CARDS = []

# ---------------------------------------------------------------- H (1-12)
CARDS.append(card(1, "H", "Wohnen", "Kaution bis zum Mittagessen, sonst ist das Zimmer weg",
    "Auf WG-Gesucht meldet sich eine Vermieterin für ein günstiges WG-Zimmer, das perfekt zur Uni passt. Sie will "
    "das Zimmer aber nicht persönlich zeigen — nur die Kaution von 600 € per Überweisung bis zum Mittag, „sonst "
    "geht das Zimmer an die nächste Interessentin“.",
    "Kein Geld überweisen, ohne das Zimmer und die vermietende Person persönlich oder per Videocall gesehen zu haben.",
    [("Nur die halbe Kaution überweisen, um vorsichtig zu bleiben.", 0),
     ("Die Kaution überweisen, weil so viele andere Interessent:innen Druck machen.", 0)],
    "Ein Zimmer, das man nie sehen darf, aber sofort per Überweisung sichern soll, ist die klassische "
    "WG-Betrugsmasche. Echte Vermieter:innen zeigen Zimmer — persönlich oder per Video — bevor Geld fließt.",
    "Kein Zimmer, keine Besichtigung, kein Geld.",
    ["housing", "rental-scam"], diagnostic=True))

CARDS.append(card(2, "H", "BAföG", "Deine BAföG-Nachzahlung läuft heute Mitternacht ab",
    "Eine SMS im Namen des Studierendenwerks sagt, eine BAföG-Nachzahlung von 340 € verfalle um Mitternacht, "
    "wenn du nicht sofort über einen Link deine IBAN bestätigst.",
    "Abwarten und morgen direkt im BAföG-Online-Portal oder beim Studierendenwerk nachfragen, ob wirklich etwas offen ist.",
    [("Die IBAN sofort über den Link bestätigen, um die Nachzahlung nicht zu verlieren.", 0),
     ("Bei der im Link angegebenen Nummer zurückrufen.", 0)],
    "BAföG-Nachzahlungen verfallen nicht über Nacht, und das Studierendenwerk verschickt keine SMS-Links mit "
    "Kontodatenabfrage. Sowohl der Link als auch eine Nummer daraus führen zu den Tätern.",
    "Eine Frist bis Mitternacht ist gemacht, damit du nicht nachdenkst.",
    ["financial-aid", "smishing"], diagnostic=True))

CARDS.append(card(3, "H", "Nebenjobs", "Leichter Nebenjob — heute Abend geht's schon los",
    "Eine Jobanzeige in der Fachschafts-WhatsApp-Gruppe verspricht 25 €/Stunde für „Produkttests von zuhause“, "
    "Start noch heute Abend — du müsstest dich dafür nur sofort mit Ausweis und Kontodaten registrieren.",
    "Die Anzeige unabhängig recherchieren (Firmenname plus „Betrug“ suchen) und dich nicht unter Zeitdruck sofort mit Ausweis- und Kontodaten registrieren.",
    [("Dich sofort registrieren, um den Job noch heute zu bekommen.", 0),
     ("Nur den Ausweis hochladen, aber die Kontodaten weglassen.", 1)],
    "Ein Nebenjob, der sofortige Ausweis- und Kontodaten unter Zeitdruck verlangt, ist eine Standard-Masche für "
    "Identitätsdiebstahl oder Geldwäsche über dein Konto. Eine kurze Recherche zeigt es meist sofort.",
    "25 €/Stunde für „Produkttests“ ist ein Warnsignal, kein Angebot.",
    ["jobs", "job-scam"]))

CARDS.append(card(4, "H", "Stipendien", "Nimm dein Stipendium in 60 Minuten an",
    "Eine E-Mail gratuliert dir zu einem Deutschlandstipendium, für das du dich nie beworben hast, und verlangt, "
    "die Zusage innerhalb von 60 Minuten über einen Link mit Kontodaten zu bestätigen.",
    "Beim Career Service oder Studierendensekretariat deiner Uni nachfragen, ob ein solches Stipendium und eine Bewerbung von dir überhaupt existieren, bevor du irgendetwas bestätigst.",
    [("Die Kontodaten über den Link bestätigen, um das Stipendium nicht zu verlieren.", 0),
     ("Nur den Namen bestätigen, aber keine Kontodaten.", 1)],
    "Ein Stipendium, für das man sich nie beworben hat, gewinnt man auch nicht. Deine Uni kann in einem Anruf "
    "sofort bestätigen, ob es das Programm überhaupt gibt.",
    "Ein Gewinn ohne Bewerbung ist kein Gewinn.",
    ["scholarships", "phishing"]))

CARDS.append(card(5, "H", "Internationale Studierende", "Ausländerbehörde: Antworte vor Mitternacht",
    "Eine E-Mail im Namen der Ausländerbehörde warnt, dein Aufenthaltstitel werde „automatisch widerrufen“, wenn "
    "du nicht vor Mitternacht über einen Link deine Passdaten bestätigst.",
    "Die E-Mail ignorieren und direkt bei der zuständigen Ausländerbehörde oder dem International Office deiner Uni über die bekannte Nummer nachfragen.",
    [("Die Passdaten sofort über den Link bestätigen, um den Aufenthaltstitel nicht zu verlieren.", 0),
     ("Auf die E-Mail antworten und um mehr Zeit bitten.", 0)],
    "Behörden entscheiden nicht per Mitternachtsfrist über einen Aufenthaltstitel per E-Mail-Link. Das "
    "International Office kennt den echten Stand deines Verfahrens.",
    "Ein Aufenthaltstitel verfällt nicht per E-Mail-Countdown.",
    ["international-students", "phishing"]))

CARDS.append(card(6, "H", "Tickets", "Studierendenblock, halber Preis, nur zehn Minuten",
    "In einer Ticketbörse-Gruppe bietet jemand ein Stadion-Ticket im Studierendenblock zum halben Preis an — "
    "„reserviert nur die nächsten zehn Minuten“ — Zahlung per Überweisung an eine Privatperson.",
    "Nur über eine Plattform mit Käuferschutz zahlen oder eine persönliche Übergabe gegen Bargeld vorschlagen.",
    [("Sofort überweisen, um das Ticket nicht zu verpassen.", 0),
     ("Die Hälfte anzahlen, den Rest bei Übergabe.", 0)],
    "Ein enges Zeitfenster bei Vorauszahlung an eine unbekannte Person ist die klassische Ticket-Betrugsmasche — "
    "Käuferschutz oder persönliche Übergabe schützen dich, ein Countdown nie.",
    "Ein Ticket, das in zehn Minuten weg ist, ist meist gar nicht da.",
    ["tickets", "payment-scam"]))

CARDS.append(card(7, "H", "Lieferungen", "Deine Laptop-Lieferung braucht 2,40 €",
    "Eine SMS im Namen von DHL sagt, dein neu bestellter Laptop könne wegen einer offenen Zollgebühr von 2,40 € "
    "nicht zugestellt werden. Der Link verlangt Kartendaten und Adresse.",
    "Die SMS ignorieren und die Sendung direkt in der DHL-App oder auf dhl.de mit der Sendungsnummer verfolgen.",
    [("Über den Link zahlen, um die Zustellung nicht zu verzögern.", 0),
     ("Den Link öffnen, aber nur die Adresse bestätigen, keine Kartendaten.", 1)],
    "Zollgebühren werden nicht per SMS-Link mit Kartennummer eingezogen — der winzige Betrag soll das Risiko "
    "klein wirken lassen. Der echte Status steht in der Versand-App.",
    "Ein Paket, das eine Kartennummer will, ist kein Paket.",
    ["deliveries", "smishing"]))

CARDS.append(card(8, "H", "Studienfinanzierung", "Der Nothilfefonds läuft heute Abend ab",
    "Eine Mail im Namen des Studierendenwerks kündigt einen einmaligen Nothilfefonds für in Not geratene "
    "Studierende an — die Bewerbung mit vollständigen Kontodaten müsse heute Abend über einen externen Link "
    "eingereicht werden.",
    "Direkt beim Studierendenwerk über die offizielle Website oder Telefonnummer nachfragen, ob dieser Fonds und der Link wirklich echt sind.",
    [("Die Kontodaten sofort über den Link einreichen, um die Frist nicht zu verpassen.", 0),
     ("Nur einen Teil der Daten einreichen, um vorsichtig zu bleiben.", 0)],
    "Echte Nothilfefonds laufen über die offizielle Studierendenwerk-Website, nicht über einen externen "
    "Abendfrist-Link. Ein Anruf klärt es in Minuten.",
    "Ein Fonds mit Abendfrist über einen fremden Link ist kein echter Fonds.",
    ["financial-aid", "phishing"]))

CARDS.append(card(9, "H", "Hiwi-Jobs", "Der Professor braucht heute sofort eine Hiwi",
    "Eine E-Mail, angeblich von einem Professor, den du nur aus einer großen Vorlesung kennst, bietet dir "
    "spontan eine gut bezahlte Hiwi-Stelle an — du müsstest aber noch heute deine Kontodaten für die „sofortige "
    "erste Zahlung“ schicken.",
    "Den Professor über die offizielle Uni-E-Mail-Adresse oder in der Sprechstunde persönlich fragen, ob das Angebot wirklich von ihm kommt, bevor du Kontodaten schickst.",
    [("Die Kontodaten sofort schicken, um die Stelle nicht zu verpassen.", 0),
     ("Nur den Namen und die Matrikelnummer schicken.", 1)],
    "Hiwi-Stellen laufen über offizielle Uni-Prozesse, nicht über eine spontane E-Mail mit "
    "Sofort-Kontodaten-Anfrage. Eine kurze Rückfrage über einen bekannten Kanal klärt es.",
    "Eine echte Hiwi-Stelle läuft nie über eine Mail mit Zeitdruck und Kontodatenwunsch.",
    ["research-jobs", "phishing"]))

CARDS.append(card(10, "H", "Zwischenmiete", "Zwischenmiete-Zimmer — Kaution jetzt sichern",
    "Für ein Auslandssemester suchst du eine Zwischenmiete. Ein Angebot passt perfekt — die Person bittet aber, "
    "die Kaution „jetzt sofort“ zu überweisen, weil „noch zwei andere Leute Interesse haben“.",
    "Erst das Zimmer besichtigen oder mit der Person videotelefonieren und einen echten Untermietvertrag sehen, bevor irgendetwas überwiesen wird.",
    [("Die Kaution sofort überweisen, um das Zimmer zu sichern.", 0),
     ("Nur die Hälfte der Kaution überweisen.", 0)],
    "„Noch zwei andere Interessenten“ ist der Standard-Zeitdrucksatz bei Zwischenmiete-Betrug. Ein echter "
    "Vertrag und eine Besichtigung — auch per Video — kommen immer vor der Zahlung.",
    "Kein Vertrag gesehen, keine Kaution überwiesen.",
    ["sublets", "rental-scam"]))

CARDS.append(card(11, "H", "Deutschlandticket", "Die Ticket-Ermäßigung läuft in einer Stunde ab",
    "Eine E-Mail im Design des Semesterticket-Büros sagt, die ermäßigte Deutschlandticket-Verlängerung laufe in "
    "einer Stunde ab, und verlangt eine sofortige Zahlung über einen externen Zahlungsdienst statt des üblichen "
    "Lastschriftverfahrens.",
    "Die Mail ignorieren und im eigenen Studierendenportal nachsehen, ob die Verlängerung wie gewohnt per Lastschrift läuft.",
    [("Sofort über den externen Zahlungsdienst zahlen, um die Ermäßigung zu sichern.", 0),
     ("Beim Semesterticket-Büro über die in der Mail genannte Nummer nachfragen.", 1)],
    "Das Semesterticket wird gewohnheitsgemäß per Lastschrift abgebucht — ein plötzlicher externer Zahlungsweg "
    "mit Stundenfrist ist untypisch und ein Warnsignal.",
    "Ein neuer Zahlungsweg mit Countdown ist verdächtiger als der gewohnte.",
    ["campus-finance", "phishing"]))

CARDS.append(card(12, "H", "Rückmeldung", "Rückmeldefrist — heute Abend letzte Chance",
    "Eine SMS warnt, deine Rückmeldung fürs nächste Semester sei noch offen und du würdest exmatrikuliert, wenn "
    "du nicht heute Abend über einen Link den Semesterbeitrag per Karte zahlst.",
    "Direkt im Studierendenportal nachsehen, ob die Rückmeldung wirklich noch offen ist, statt über den SMS-Link zu zahlen.",
    [("Über den Link sofort zahlen, um die Exmatrikulation zu vermeiden.", 0),
     ("Beim Studierendensekretariat über die Nummer aus der SMS nachfragen.", 0)],
    "Die Rückmeldung läuft ausschließlich über das offizielle Studierendenportal, niemals über einen SMS-Link "
    "mit Kartenzahlung. Der echte Status steht direkt im Portal.",
    "Rückmeldung prüfst du im Portal — nie über einen Link aus einer SMS.",
    ["campus-finance", "smishing"]))

# ---------------------------------------------------------------- A (13-24)
CARDS.append(card(13, "A", "Ausländerbehörde", "Der „Sachbearbeiter“ bleibt in der Leitung",
    "Ein Anrufer gibt sich als Sachbearbeiter der Ausländerbehörde aus und sagt, es gebe ein Problem mit deinem "
    "Aufenthaltstitel — du müsstest, während er in der Leitung bleibt, eine „Bearbeitungsgebühr“ per "
    "Guthabenkarte zahlen, sonst drohe die Ausreise.",
    "Auflegen und die Ausländerbehörde über die offizielle, unabhängig gefundene Nummer selbst kontaktieren, um nachzufragen.",
    [("In der Leitung bleiben und die Gebühr per Guthabenkarte zahlen, um die Ausreise zu vermeiden.", 0),
     ("Nach dem Namen und der Dienststelle des Sachbearbeiters fragen, um die Geschichte zu prüfen.", 1)],
    "Behörden verlangen keine Gebühren per Guthabenkarte am Telefon, und sie halten dich nicht absichtlich in "
    "der Leitung. Ein Rückruf über die offizielle Nummer erreicht die echte Behörde.",
    "Keine Behörde kassiert per Guthabenkarte am Telefon.",
    ["immigration", "government-impostor"], diagnostic=True))

CARDS.append(card(14, "A", "Nebenjobs", "Der „kleine Gefallen“ deines Professors",
    "Eine E-Mail, die aussieht, als käme sie vom Uni-Account eines Professors, bittet dich dringend, für ihn "
    "Gutscheinkarten für eine Konferenz zu kaufen, und verspricht sofortige Rückerstattung — er sei „gerade auf "
    "einer Tagung nicht erreichbar“.",
    "Den Professor persönlich in der Sprechstunde oder über eine dir bekannte Telefonnummer fragen, ob die Bitte wirklich von ihm kommt, bevor du etwas kaufst.",
    [("Die Karten kaufen und die Codes wie gewünscht schicken.", 0),
     ("Im Sekretariat des Lehrstuhls fragen, ob andere Studierende dieselbe Mail bekommen haben.", 2)],
    "„Dringend, aber gerade nicht erreichbar“ soll Rückfragen verhindern. Ein E-Mail-Konto einer Lehrkraft kann "
    "kompromittiert sein — eine persönliche Rückfrage klärt es sofort.",
    "Wer „gerade auf einer Tagung“ ist, kann trotzdem später bestätigen.",
    ["jobs", "gift-card"], diagnostic=True))

CARDS.append(card(15, "A", "Campus-Sicherheit", "Der Objektschutz sagt, du schuldest ein Bußgeld",
    "Eine Person in Uniform am Campus-Eingang behauptet, du hättest unerlaubt im Sperrbereich geparkt, und "
    "verlangt ein Bußgeld von 80 € sofort in bar, sonst werde dein Fahrzeug abgeschleppt.",
    "Nach einem offiziellen, nummerierten Bußgeldbescheid fragen und das Bußgeld nur über den regulären, bekannten Weg der Uni-Verwaltung zahlen — nicht bar am Ort.",
    [("Die 80 € sofort bar zahlen, um das Abschleppen zu vermeiden.", 0),
     ("Um eine Quittung mit Dienstnummer bitten und dann bar zahlen.", 1)],
    "Echte Bußgelder auf dem Campus laufen über einen offiziellen, nummerierten Bescheid und die reguläre "
    "Kassen- oder Verwaltungsstelle, nie über sofortige Barzahlung an eine Person am Eingang.",
    "Bar am Ort zahlen ist bei einem echten Bußgeld nie nötig.",
    ["campus-safety", "impostor"]))

CARDS.append(card(16, "A", "Studierendenkonten", "Das Prüfungsamt sagt, dein Konto sei gesperrt",
    "Eine E-Mail im Namen des Prüfungsamts sagt, dein Studierendenkonto sei „aus Sicherheitsgründen gesperrt“, "
    "und du müsstest sofort über einen Link dein Passwort neu setzen, um Klausuranmeldungen nicht zu verpassen.",
    "Die Mail ignorieren und dich direkt im gewohnten Studierendenportal einloggen, um zu prüfen, ob wirklich eine Sperrung vorliegt.",
    [("Das Passwort sofort über den Link neu setzen.", 0),
     ("Den Link öffnen, aber ein anderes Passwort als sonst verwenden.", 0)],
    "Ein direkter Login im gewohnten Portal zeigt sofort, ob eine Sperrung überhaupt existiert — das "
    "Prüfungsamt verschickt keine Passwort-Reset-Links per E-Mail.",
    "Ein Login im gewohnten Portal ist immer sicherer als ein Link aus einer Mail.",
    ["student-accounts", "phishing"]))

CARDS.append(card(17, "A", "Studienkredite", "„BAföG-Rückzahlungserleichterung“ kennt deinen Saldo",
    "Ein Anruf im Namen einer „staatlichen Rückzahlungsstelle“ nennt dir korrekt deine offene BAföG-Summe und "
    "bietet einen „Sondererlass“ an, wenn du sofort eine Bearbeitungsgebühr überweist.",
    "Auflegen und beim Bundesverwaltungsamt (der echten BAföG-Rückzahlungsstelle) über die offizielle Nummer nachfragen, ob ein solcher Erlass existiert.",
    [("Die Bearbeitungsgebühr sofort überweisen, um den Sondererlass zu sichern.", 0),
     ("Nach schriftlichen Unterlagen zum Erlass fragen, bevor du zahlst.", 2)],
    "Die richtige Kenntnis deines Saldos kann aus einem Datenleck stammen und ist kein Echtheitsbeweis. Echte "
    "Erlassregelungen kosten keine vorab zu zahlende „Bearbeitungsgebühr“.",
    "Den richtigen Betrag zu kennen macht einen Anrufer nicht echt.",
    ["loans", "vishing"]))

CARDS.append(card(18, "A", "Banking", "Dein Studierendenkonto wird „geprüft“",
    "Ein Anruf im Namen deiner Bank sagt, dein kostenloses Studierendenkonto werde wegen „ungewöhnlicher "
    "Aktivität“ geprüft, und bittet dich, eine push-TAN zu bestätigen, um es „freizugeben“.",
    "Auflegen und die Bank über die Nummer aus der App oder von der Kartenrückseite selbst anrufen; keine TAN am Telefon freigeben.",
    [("Die push-TAN bestätigen, um das Konto freizugeben.", 0),
     ("Nach dem Namen der Mitarbeiterin fragen und zurückrufen lassen.", 1)],
    "Keine Bank braucht eine TAN-Freigabe am Telefon, um ein Konto zu „prüfen“ — jede TAN bestätigt eine "
    "konkrete Aktion, meist eine Überweisung an die Täter.",
    "Eine TAN gibst du nie am Telefon frei — auch nicht zur „Prüfung“.",
    ["banking", "push-tan"]))

CARDS.append(card(19, "A", "Uni-IT", "Die IT „migriert“ dein Postfach",
    "Eine Mail im Namen des Hochschulrechenzentrums kündigt eine Postfach-Migration an und bittet, die "
    "Zugangsdaten über ein verlinktes Formular „zur Sicherung“ erneut einzugeben.",
    "Das Formular ignorieren und sich wie gewohnt direkt im Uni-Webmail einloggen; eine echte Migration verlangt keine externe Dateneingabe.",
    [("Die Zugangsdaten über das Formular erneut eingeben.", 0),
     ("Ein neues, unbekanntes Passwort im Formular verwenden.", 0)],
    "Eine echte Systemmigration läuft im Hintergrund — sie verlangt nie, dass alle Nutzer ihre Zugangsdaten "
    "über ein externes Formular neu eingeben.",
    "Migrationen passieren ohne dich — Zugangsdaten gibst du dafür nie erneut ein.",
    ["university-it", "mass-phishing"]))

CARDS.append(card(20, "A", "Wohnen", "Der Vermieter hat das Mietkonto geändert",
    "Eine E-Mail „vom Vermieter“ deiner WG informiert alle Mitbewohner:innen, dass die Miete ab sofort auf ein "
    "neues Konto überwiesen werden soll — angeblich wegen eines Bankwechsels.",
    "Den Vermieter über die bekannte Telefonnummer oder persönlich nach dem angeblichen Bankwechsel fragen, bevor die erste Miete auf das neue Konto geht.",
    [("Ab sofort auf das neue Konto überweisen, wie in der Mail beschrieben.", 0),
     ("Mit den Mitbewohnern besprechen, ob sie dieselbe Mail bekommen haben.", 2)],
    "E-Mail-Konten von Vermietern werden gezielt übernommen, gerade weil regelmäßig Miete fließt. Eine "
    "geänderte Kontoverbindung wird immer telefonisch über eine unabhängig bekannte Nummer bestätigt.",
    "Miete geht nur auf ein Konto, das dir am Telefon bestätigt wurde.",
    ["housing", "business-email-compromise"]))

CARDS.append(card(21, "A", "Recruiting", "Ein bekannter Konzern-Recruiter braucht sofort Unterlagen",
    "Eine Nachricht auf LinkedIn, angeblich von einer Recruiterin eines bekannten Konzerns, bietet dir ein "
    "Praktikum an, wenn du „noch heute“ eine Ausweiskopie und deine IBAN für die „Vertragsvorbereitung“ schickst.",
    "Die Anfrage über die offizielle Karriereseite des Unternehmens verifizieren und keine IBAN oder Ausweiskopie vor einem echten, unterschriebenen Vertrag schicken.",
    [("Die Unterlagen sofort schicken, um das Praktikum nicht zu verlieren.", 0),
     ("Nur die Ausweiskopie schicken, aber nicht die IBAN.", 1)],
    "Ein bekannter Firmenname macht eine Anfrage nicht automatisch echt — echte Praktikumsverträge verlangen "
    "keine IBAN vor Vertragsunterschrift. Die offizielle Karriereseite bestätigt echte Angebote.",
    "Ein großer Name ersetzt keine echte Vertragsunterschrift.",
    ["recruiting", "identity-phishing"]))

CARDS.append(card(22, "A", "Krankenversicherung", "Die Krankenkasse sagt: Versicherungsschutz läuft ab",
    "Eine Mail im Namen deiner studentischen Krankenkasse sagt, dein Versicherungsschutz laufe morgen ab, wenn "
    "du nicht sofort über einen Link deine Kontodaten zur „Beitragsbestätigung“ eingibst.",
    "Die Mail ignorieren und direkt im Kundenportal der Krankenkasse oder über die bekannte Servicenummer nachfragen, ob wirklich etwas offen ist.",
    [("Die Kontodaten sofort über den Link eingeben, um den Versicherungsschutz zu sichern.", 0),
     ("Bei der Nummer aus der Mail anrufen, um nachzufragen.", 0)],
    "Krankenkassen kündigen einen Versicherungsablauf nicht per Link-Formular mit Kontodatenabfrage an — das "
    "Kundenportal zeigt den echten Status sofort.",
    "Versicherungsstatus prüfst du im Portal, nie über einen Link aus einer Mail.",
    ["health-insurance", "phishing"]))

CARDS.append(card(23, "A", "Prüfungsausschuss", "Wissenschaftliches Fehlverhalten — antworte in 24 Stunden",
    "Eine E-Mail im Namen des Prüfungsausschusses beschuldigt dich wissenschaftlichen Fehlverhaltens in einer "
    "Hausarbeit und verlangt, innerhalb von 24 Stunden über einen Link eine „Stellungnahme mit Login-Bestätigung“ "
    "einzureichen, sonst drohe die Exmatrikulation.",
    "Direkt beim Prüfungsausschuss oder Studierendensekretariat über die offizielle Nummer der Uni nachfragen, ob dieses Verfahren wirklich läuft, statt über den Link zu reagieren.",
    [("Über den Link sofort eine Stellungnahme mit Login einreichen, um die Exmatrikulation zu vermeiden.", 0),
     ("Direkt auf die E-Mail antworten und sich verteidigen.", 1)],
    "Formale Disziplinarverfahren laufen über offizielle, schriftliche Wege der Uni, nicht über einen Link mit "
    "Login-Bestätigung und Tagesfrist. Ein Anruf bei der Uni klärt es sicher.",
    "Ein echtes Verfahren schickt dich nie zu einem Login-Link.",
    ["university-it", "fake-disciplinary"]))

CARDS.append(card(24, "A", "Uni-IT", "„Dein Gerät ist nicht konform“ — installier dieses Profil",
    "Eine Mail im Namen der Uni-IT sagt, dein Laptop erfülle nicht die „Sicherheitsanforderungen“ für den "
    "WLAN-Zugang und verlangt die Installation eines Verwaltungsprofils von einer externen Seite, bevor du "
    "weiter das Uni-WLAN nutzen darfst.",
    "Das Profil nicht von der externen Seite installieren und die Uni-IT über den offiziellen Helpdesk-Kanal fragen, ob eine solche Anforderung wirklich existiert.",
    [("Das Profil sofort installieren, um den WLAN-Zugang nicht zu verlieren.", 0),
     ("Das Profil installieren, aber danach die Berechtigungen prüfen.", 1)],
    "Ein Verwaltungsprofil gibt weitreichende Kontrolle über ein Gerät — echte Uni-IT verteilt so etwas nie über "
    "eine externe Seite ohne offizielle Ankündigung über den Helpdesk.",
    "Ein Verwaltungsprofil von einer fremden Seite ist keine WLAN-Voraussetzung.",
    ["university-it", "malicious-profile"]))

# ---------------------------------------------------------------- C (25-36)
CARDS.append(card(25, "C", "Mitbewohner", "Dein Mitbewohner hat eine neue Zahlungs-Handle",
    "Dein WG-Mitbewohner schreibt in der Haushaltskasse-Gruppe, sein PayPal sei gesperrt, und bittet, deinen "
    "Anteil für die Nebenkosten diesmal an eine „neue“ PayPal-Adresse zu schicken.",
    "Ihn persönlich oder per Anruf fragen, ob die neue Adresse wirklich seine ist, bevor du dorthin etwas schickst.",
    [("Sofort an die neue Adresse zahlen, weil es aus der WG-Gruppe kommt.", 0),
     ("In der Gruppe fragen, ob andere die Nachricht auch bekommen haben.", 2)],
    "Ein gehacktes Konto in der eigenen WG-Gruppe wirkt besonders glaubwürdig. Eine kurze persönliche Rückfrage "
    "klärt es in Sekunden, bevor Geld an die falsche Adresse geht.",
    "Eine neue Zahlungsadresse bestätigst du persönlich, nicht nur im Chat.",
    ["roommates", "account-takeover"], diagnostic=True))

CARDS.append(card(26, "C", "Lernchats", "Der Lernleitfaden im Gruppenchat will deinen Login",
    "Im WhatsApp-Lerngruppenchat für die anstehende Klausur teilt jemand einen Link zu einem „geteilten "
    "Lernleitfaden“, der zum Öffnen deinen Uni-Portal-Login verlangt.",
    "Den Link nicht öffnen und stattdessen direkt im Uni-Portal oder auf der offiziellen Kursseite nach Lernmaterial suchen.",
    [("Sich über den Link mit dem Uni-Login anmelden, um den Leitfaden zu sehen.", 0),
     ("Fragen, wer den Link ursprünglich geteilt hat, und dann einloggen.", 1)],
    "Ein echter geteilter Leitfaden braucht nie deinen vollen Uni-Portal-Login — das ist eine "
    "Login-Phishing-Masche, die sich den Druck der Klausurphase zunutze macht.",
    "Lernmaterial braucht nie deinen Uni-Login.",
    ["class-chats", "credential-phishing"], diagnostic=True))

CARDS.append(card(27, "C", "Investitionen", "Dein neuer Wohnheim-Kumpel hat „eine sichere Sache“",
    "Ein neuer Bekannter aus dem Wohnheim, mit dem du dich gut verstehst, erzählt begeistert von einer "
    "Krypto-Plattform, auf der er „garantiert“ Geld verdient, und bietet an, dich mit seinem Einladungslink "
    "einzuweisen.",
    "Die Plattform unabhängig recherchieren (Name plus „Betrug“, BaFin-Warnliste prüfen) und mit niemandem, den du erst seit kurzem kennst, über eine Geldanlage entscheiden.",
    [("Über den Einladungslink einsteigen, weil er im Wohnheim vertrauenswürdig wirkt.", 0),
     ("Einen kleinen Betrag investieren, um es auszuprobieren.", 0)],
    "„Garantiert“ gibt es bei echten Geldanlagen nicht — das ist das klassische Signal einer "
    "Investment-Betrugsmasche. Eine kurze Recherche und die BaFin-Warnliste zeigen es meist sofort.",
    "„Garantiert“ ist bei Geldanlagen immer ein Warnwort.",
    ["investments", "crypto-scam"]))

CARDS.append(card(28, "C", "Freunde & Geld", "Kannst du das kurz für mich empfangen?",
    "Eine Bekannte aus dem Seminar bittet dich, eine Zahlung von 800 € auf dein Konto empfangen zu dürfen, weil "
    "ihr eigenes „gerade Probleme macht“ — sie hole das Geld dann bar bei dir ab.",
    "Ablehnen; über ein fremdes Konto Geld weiterzuleiten kann als Geldwäsche gelten, egal wie gut man sich kennt.",
    [("Zustimmen, um kurzfristig zu helfen.", 0),
     ("Nur zustimmen, wenn sie den Grund genauer erklärt.", 1)],
    "Wer Geld über ein fremdes Konto „durchleitet“, macht sich strafbar mitverantwortlich — auch wenn die "
    "eigene Absicht gut ist und die Person bekannt wirkt.",
    "Dein Konto ist kein Durchlaufposten für fremdes Geld.",
    ["friends-and-money", "money-mule"]))

CARDS.append(card(29, "C", "Dating", "Aus dem Date wird ein Trading-Mentor",
    "Nach ein paar netten Dates auf einer Dating-App beginnt die Person, dir enthusiastisch von einer "
    "Trading-Plattform zu erzählen, auf der sie „gutes Geld“ macht, und bietet an, dich persönlich anzuleiten.",
    "Die Plattform unabhängig recherchieren und mit niemandem, den du erst über eine Dating-App kennst, über eine Geldanlage entscheiden.",
    [("Ihr vertrauen und mit dem Investieren beginnen, weil die Dates gut gelaufen sind.", 0),
     ("Nach den Kontodaten der Plattform fragen, um selbst direkt einzuzahlen.", 0)],
    "Romantisches Interesse und eine plötzliche Trading-Empfehlung zusammen sind ein bekanntes Muster "
    "(„Pig Butchering“) — echte Zuneigung braucht keine gemeinsame Geldanlage.",
    "Wer dich zuerst verliebt und dann investieren lässt, will dein Geld, nicht dein Herz.",
    ["dating", "romance-scam"]))

CARDS.append(card(30, "C", "Studierendenclubs", "Der Kassenwart hat ein neues Konto",
    "Der Kassenwart deines Fachschafts-/Vereinsvorstands schreibt in der Gruppe, die Vereinskasse habe ein "
    "„neues, sichereres Konto“, und bittet alle, ausstehende Beiträge dorthin zu überweisen.",
    "Bei einer Vorstandssitzung oder persönlich nachfragen, ob das neue Konto wirklich vom Verein stammt, bevor Beiträge dorthin gehen.",
    [("Den Beitrag sofort an das neue Konto überweisen.", 0),
     ("In der Gruppe fragen, warum das Konto gewechselt wurde.", 2)],
    "Ein Kontowechsel für eine Vereinskasse wird auf einer Sitzung beschlossen, nicht per einzelner Chat-Ansage "
    "— ein gehacktes Konto im Vorstand ist ein bekanntes Muster.",
    "Ein neues Vereinskonto wird auf einer Sitzung bestätigt, nicht im Chat.",
    ["student-clubs", "account-takeover"]))

CARDS.append(card(31, "C", "Mentoring", "Der Alumni-Mentor will „deiner Bonität helfen“",
    "Ein Alumni-Mentor aus einem offiziellen Uni-Mentoring-Programm bietet an, „deine Bonität zu verbessern“, "
    "wenn du ihm kurz Zugriff auf dein Online-Banking gibst, um „ein paar Einträge zu korrigieren“.",
    "Das Angebot ablehnen; kein legitimer Mentor braucht oder sollte je Zugriff auf dein Online-Banking bekommen.",
    [("Den Zugriff gewähren, weil das Mentoring-Programm offiziell ist.", 0),
     ("Nur Leserechte ohne Überweisungsmöglichkeit gewähren.", 0)],
    "Der offizielle Rahmen des Mentoring-Programms macht diese konkrete Bitte nicht legitim — kein echter "
    "Mentor braucht Zugriff auf dein Bankkonto, um Bonität zu „verbessern“.",
    "Ein Mentor gibt Rat — er braucht nie deinen Bankzugang.",
    ["mentoring", "account-access"]))

CARDS.append(card(32, "C", "Freunde im Ausland", "Dein Freund „sitzt an der Grenze fest“",
    "Eine Nachricht über Facebook Messenger von einem Freund im Auslandssemester sagt, ihm sei an der Grenze "
    "das Geld gestohlen worden, und er brauche sofort 300 € per Zahlungs-App, bis seine Bank das Problem löst.",
    "Ihn über eine andere, dir bekannte Nummer per Anruf oder Videoanruf erreichen, bevor du irgendetwas schickst.",
    [("Das Geld über den im Chat genannten Weg sofort schicken.", 0),
     ("In der gemeinsamen Freundesgruppe fragen, ob schon jemand mit ihm gesprochen hat.", 2)],
    "Ein Chat, der plötzlich nur noch Text erlaubt und um Geld bittet, ist ein klassisches Zeichen für ein "
    "übernommenes Konto. Ein Videoanruf zeigt sofort, wer wirklich am anderen Ende ist.",
    "Wer wirklich an der Grenze festsitzt, kann fast immer telefonieren oder sich per Video zeigen.",
    ["friends-abroad", "account-takeover"]))

CARDS.append(card(33, "C", "Forschung", "Dein Laborpartner teilt ein „neues Analyse-Tool“",
    "Dein Laborpartner, mit dem du seit dem ersten Semester zusammenarbeitest, schickt einen Link zu einem "
    "„viel schnelleren“ Analyse-Tool für eure gemeinsamen Forschungsdaten — es verlangt aber deinen Uni-Login, "
    "um „die Daten zu synchronisieren“.",
    "Den Laborpartner fragen, ob das Tool offiziell von der Uni oder dem Lehrstuhl freigegeben ist, bevor du dich mit dem Uni-Login anmeldest.",
    [("Sich sofort mit dem Uni-Login anmelden, weil man dem Partner seit Jahren vertraut.", 0),
     ("Das Tool auf einem privaten Test-Account ausprobieren.", 1)],
    "Lange Zusammenarbeit ist kein Sicherheitsnachweis für ein Tool von außerhalb der offiziellen Uni-Infrastruktur "
    "— und der Uni-Login gehört nur in offizielle Uni-Systeme.",
    "Jahre der Zusammenarbeit ersetzen keine offizielle Freigabe eines Tools.",
    ["research", "credential-phishing"]))

CARDS.append(card(34, "C", "Marktplätze", "Der Lehrbuch-Käufer hat gemeinsame Freunde",
    "Du verkaufst ein teures Lehrbuch auf Kleinanzeigen. Ein Käufer mit mehreren gemeinsamen Facebook-Freunden "
    "will sofort kaufen und schickt einen Link zu „Kleinanzeigen — Sichere Bezahlung“, der nach Bankdaten und "
    "TAN fragt.",
    "Die Bezahlung ausschließlich über die offizielle Funktion in der Kleinanzeigen-App abwickeln und den externen Link ignorieren.",
    [("Über den Link gehen, weil ihr gemeinsame Freunde habt.", 0),
     ("Nur die Kontonummer eingeben, aber keine TAN.", 0)],
    "Gemeinsame Freunde sind kein Identitätsnachweis — auch alte, vernetzte Konten werden übernommen. Die "
    "echte „Sichere Bezahlung“ läuft komplett in der App, nie über einen externen Link.",
    "Gemeinsame Freunde sind kein TAN-Schutz.",
    ["marketplaces", "phishing"]))

CARDS.append(card(35, "C", "Lerntools", "Das Premium-KI-Lerntool, das alle nutzen",
    "In der Klausurphase teilt fast der ganze Semester-Chat den Zugang zu einem „Premium-KI-Lerntool“, das "
    "kostenlos ist, wenn man sich mit dem eigenen Uni-Account anmeldet und die Chrome-Erweiterung installiert.",
    "Sich nicht mit dem Uni-Account anmelden und die Erweiterung nicht installieren, egal wie viele andere es schon getan haben; ein echtes Tool braucht keinen fremden Zugriff auf den Uni-Account.",
    [("Sich anmelden und die Erweiterung installieren, weil fast alle im Chat es schon nutzen.", 0),
     ("Sich mit einem separaten, neuen Account anmelden, um vorsichtig zu bleiben.", 2)],
    "Dass viele andere mitmachen, macht ein Tool, das vollen Kontozugriff und eine Browser-Erweiterung verlangt, "
    "nicht sicherer — Gruppendruck ersetzt keine Prüfung der Berechtigungen.",
    "Viele Mitmacher sind kein Sicherheitscheck.",
    ["class-chats", "app-phishing"]))

CARDS.append(card(36, "C", "Investitionen", "Werde bezahlte Campus-Botschafterin für eine Trading-App",
    "Eine bekannte Kommilitonin mit großer Instagram-Reichweite bietet dir an, als bezahlte „Campus-Botschafterin“ "
    "für eine Trading-App zu arbeiten — du müsstest dafür nur zuerst selbst „aktiv investieren“, um „authentisch“ "
    "zu wirken.",
    "Das Angebot ablehnen oder die Trading-App unabhängig recherchieren, bevor du eigenes Geld investierst, egal wie bekannt und vertrauenswürdig die Person wirkt.",
    [("Selbst investieren, um die Botschafterrolle zu bekommen, weil die Kommilitonin bekannt und beliebt ist.", 0),
     ("Nur einen kleinen Betrag investieren, um „authentisch“ zu wirken.", 0)],
    "Eine bekannte, sympathische Person zu sein, macht eine Trading-App nicht seriöser — „erst selbst "
    "investieren, um authentisch zu wirken“ ist ein bekanntes Werbe-für-Betrug-Muster.",
    "Bekanntheit ist kein Beweis für eine seriöse Geldanlage.",
    ["investments", "affiliate-scam"]))

# ---------------------------------------------------------------- K (37-48)
CARDS.append(card(37, "K", "Nebenjobs", "Der Scheck ist „eingegangen“ — kauf den Laptop",
    "Ein neuer „Arbeitgeber“ für einen Remote-Nebenjob schickt dir einen Scheck, der laut Banking-App bereits "
    "„eingegangen“ ist, und bittet dich, davon sofort einen teuren Laptop zu kaufen und ihm die Quittung zu schicken.",
    "Nicht kaufen und abwarten, bis der Scheck tatsächlich vollständig gebucht und nicht mehr rückbuchbar ist — im Zweifel bei der eigenen Bank nachfragen.",
    [("Den Laptop sofort kaufen, weil der Scheck laut App schon eingegangen ist.", 0),
     ("Nur einen Teil des Betrags ausgeben und den Rest zurückhalten.", 0)],
    "Ein Scheck kann Tage später als ungültig zurückgebucht werden, auch wenn er kurzfristig als „eingegangen“ "
    "angezeigt wird — das ausgegebene Geld ist dann trotzdem weg und du haftest.",
    "„Eingegangen“ in der App ist nicht dasselbe wie endgültig gebucht.",
    ["jobs", "check-scam"], diagnostic=True))

CARDS.append(card(38, "K", "Vorstellungsgespräche", "Installier diese App fürs Interview",
    "Vor einem angeblichen Online-Vorstellungsgespräch verlangt der „Recruiter“, statt Zoom oder Teams eine "
    "unbekannte Interview-App zu installieren, die weitreichende Geräteberechtigungen braucht.",
    "Die App nicht installieren und stattdessen auf ein gängiges, bekanntes Videotool bestehen; ein echtes Interview braucht keine App mit weitreichenden Berechtigungen.",
    [("Die App installieren, um das Vorstellungsgespräch nicht zu verpassen.", 0),
     ("Die App installieren, aber die Berechtigungen danach einschränken.", 1)],
    "Seriöse Unternehmen führen Interviews über bekannte, geprüfte Videotools. Eine unbekannte App mit "
    "weitreichenden Rechten ist ein bekanntes Einfallstor für Schadsoftware.",
    "Ein echtes Interview braucht kein Programm mit Vollzugriff auf dein Gerät.",
    ["interviews", "malware"], diagnostic=True))

CARDS.append(card(39, "K", "Cloud-Apps", "Das geteilte Dokument will OAuth-Zugriff",
    "Ein Kommilitone teilt ein Google Doc für ein gemeinsames Referat. Beim Öffnen erscheint eine Aufforderung, "
    "einer fremden App „OAuth-Zugriff auf dein gesamtes Google-Konto“ zu erlauben, um das Dokument zu sehen.",
    "Den Zugriff verweigern und das Dokument direkt über die Google-Docs-Oberfläche öffnen; ein normales Dokument braucht keine OAuth-Freigabe für eine fremde App.",
    [("Den Zugriff erlauben, um das Dokument sehen zu können.", 0),
     ("Den Zugriff nur für einen begrenzten Zeitraum erlauben.", 0)],
    "Eine OAuth-Freigabe für eine fremde App gibt dauerhaften Zugriff auf E-Mails, Dateien und Kontakte — weit "
    "mehr, als ein geteiltes Dokument je braucht.",
    "Ein Dokument öffnet man, man verknüpft dafür kein fremdes Konto.",
    ["cloud-apps", "oauth-phishing"]))

CARDS.append(card(40, "K", "Aufgaben-Betrug", "Zahl 60 €, um 480 € freizuschalten",
    "Bei einem angeblichen Nebenjob „einfache Online-Aufgaben erledigen“ zeigt eine App ein Guthaben von 480 €, "
    "das aber erst durch eine „Freischaltungsgebühr“ von 60 € ausgezahlt werden kann.",
    "Nicht zahlen und die App löschen; ein angezeigtes Guthaben, das erst durch eigene Zahlung „freigeschaltet“ werden muss, ist kein echtes Geld.",
    [("Die 60 € zahlen, um die 480 € zu bekommen.", 0),
     ("Nur die Hälfte der Gebühr zahlen, um zu testen, ob es funktioniert.", 0)],
    "Ein „Guthaben“, das man erst durch eigene Vorabzahlung freischalten muss, existiert nur in der App-Anzeige "
    "— echtes Geld wird nie so ausgezahlt.",
    "Ein Guthaben, das eine Gebühr braucht, um „frei“ zu werden, ist nie echt.",
    ["task-scams", "advance-fee"]))

CARDS.append(card(41, "K", "Identität", "Lade den Reisepass hoch „zur Studierendenverifizierung“",
    "Eine E-Mail einer angeblichen internationalen Studierendenplattform verlangt, für die „Verifizierung deines "
    "Studierendenstatus“ eine Kopie deines Reisepasses und eine Selfie-Verifizierung auf einer externen Seite hochzuladen.",
    "Nichts hochladen und stattdessen die offizielle Verifizierung über deine eigene Uni oder eine bekannte, geprüfte Plattform nutzen.",
    [("Reisepass und Selfie sofort hochladen, um verifiziert zu werden.", 0),
     ("Nur den Reisepass hochladen, aber kein Selfie.", 1)],
    "Eine echte Studierendenverifizierung läuft über die eigene Uni oder etablierte, geprüfte Anbieter — nicht "
    "über eine unbekannte externe Seite, die Reisepass und Selfie gleichzeitig verlangt.",
    "Reisepass und Selfie zusammen sind der Rohstoff für Identitätsdiebstahl.",
    ["identity", "identity-theft"]))

CARDS.append(card(42, "K", "QR-Codes", "Der kostenlose Kaffee-QR-Code auf dem Campus",
    "An mehreren Stellen auf dem Campus kleben Sticker mit QR-Code: „Kostenloser Kaffee — scann hier!“ Der Code "
    "führt zu einer Seite, die eine App-Installation und deine Kartendaten „zur Verifizierung“ verlangt.",
    "Den Code nicht scannen oder zumindest keine Kartendaten eingeben; ein echter Kaffee-Aktion braucht keine Kartendaten „zur Verifizierung“.",
    [("Den Code scannen und die Kartendaten eingeben, um den Kaffee zu bekommen.", 0),
     ("Den Code scannen, aber die App nicht installieren.", 1)],
    "Aufgeklebte QR-Codes an öffentlichen Orten sind eine bekannte Betrugsmasche („Quishing“). Eine echte "
    "Aktion würde nie Kartendaten „zur Verifizierung“ eines kostenlosen Getränks verlangen.",
    "Kostenloser Kaffee braucht nie deine Kartendaten.",
    ["qr-codes", "quishing"]))

CARDS.append(card(43, "K", "MFA", "Bestätige, um „dein Postfach wiederherzustellen“",
    "Nach einer angeblichen Wartung bittet eine Mail, eine MFA-Anfrage auf deinem Handy zu bestätigen, um „dein "
    "E-Mail-Postfach wiederherzustellen“ — die Anfrage kommt aber, ohne dass du selbst etwas angefragt hast.",
    "Die MFA-Anfrage ablehnen, wenn du selbst nichts angefragt hast, und dein Passwort ändern; eine unerwartete MFA-Anfrage bestätigt meist einen fremden Login-Versuch.",
    [("Die Anfrage bestätigen, um das Postfach wiederherzustellen.", 0),
     ("Die Anfrage einmal ignorieren, aber bei der zweiten Anfrage bestätigen.", 0)],
    "Eine MFA-Anfrage, die du selbst nicht ausgelöst hast, bestätigt fast immer einen Login-Versuch der Täter, "
    "nicht eine „Wiederherstellung“ auf deiner Seite.",
    "Eine MFA-Anfrage, die du nicht selbst ausgelöst hast, ist ein Nein.",
    ["mfa", "mfa-fatigue"]))

CARDS.append(card(44, "K", "Zahlungen", "Der Käufer hat „aus Versehen zu viel überwiesen“",
    "Du verkaufst dein altes Fahrrad. Der Käufer schickt einen Screenshot einer Überweisung über 150 € mehr als "
    "vereinbart und bittet, die Differenz per Sofortüberweisung zurückzuschicken, bevor er das Rad abholt.",
    "Erst im eigenen Konto prüfen, ob das Geld tatsächlich eingegangen ist, bevor irgendetwas zurücküberwiesen wird; ein Screenshot ist kein Zahlungseingang.",
    [("Die Differenz sofort zurücküberweisen, damit die Abholung klappt.", 0),
     ("Die Hälfte der Differenz zurücküberweisen, um entgegenzukommen.", 0)],
    "Ein Screenshot lässt sich fälschen, oder die ursprüngliche Zahlung wird später storniert, sobald die "
    "„Rückerstattung“ schon geschickt ist. Nur der eigene Kontostand beweist einen echten Zahlungseingang.",
    "Ein Screenshot ist kein Geldeingang — schau in dein eigenes Konto.",
    ["payments", "overpayment"]))

CARDS.append(card(45, "K", "Nebenjobs", "Dein erster Job: Pakete empfangen",
    "Ein angebliches „Logistik-Nebenjob“-Angebot besteht nur darin, fremde Pakete an deiner eigenen Adresse "
    "anzunehmen und sie an eine andere Adresse weiterzuschicken, gegen eine Aufwandsentschädigung.",
    "Das Angebot ablehnen; das Weiterleiten fremder Pakete an eine Privatadresse ist ein bekanntes Muster für Warenbetrug oder Hehlerei, egal wie legal es klingt.",
    [("Annehmen, weil es einfach klingt und gut bezahlt wird.", 0),
     ("Nur ein oder zwei Pakete testweise annehmen.", 0)],
    "„Pakete empfangen und weiterschicken“ ist eine bekannte Masche, bei der Betrogene unwissentlich Teil "
    "einer Warenbetrugs- oder Hehlerei-Kette werden — mit echtem strafrechtlichem Risiko für dich.",
    "Fremde Pakete über deine Adresse weiterzuleiten ist kein harmloser Nebenjob.",
    ["jobs", "reshipping-scam"]))

CARDS.append(card(46, "K", "Wohnen", "Die „Bonitätsprüfung“ braucht deinen Bank-Login",
    "Für eine WG-Bewerbung verlangt eine vermeintliche Vermieterin, dass du dich über einen Link bei deiner "
    "Bank einloggst, damit ein „automatisches Bonitätstool“ direkt deinen Kontostand prüfen kann.",
    "Ablehnen und stattdessen einen offiziellen Bonitätsnachweis (Schufa-Auskunft, Gehaltsnachweis) anbieten; eine echte Vermieterin braucht nie deinen direkten Bank-Login.",
    [("Sich über den Link bei der Bank einloggen, um die Bonität zu belegen.", 0),
     ("Nur den Kontostand als Screenshot schicken.", 2)],
    "Ein Bank-Login über einen fremden Link gibt vollen Zugriff auf dein Konto — das hat mit einer legitimen "
    "Bonitätsprüfung nichts zu tun. Offizielle Nachweise wie eine Schufa-Auskunft reichen aus.",
    "Für eine Bonitätsprüfung gibst du nie deinen Bank-Login weiter.",
    ["housing", "credential-phishing"]))

CARDS.append(card(47, "K", "Finanzielle Unterstützung", "Dein Stipendium hat dich überzahlt — zahl den Rest zurück",
    "Nach einer Stipendienauszahlung zeigt dein Konto plötzlich 600 € mehr als erwartet. Eine Mail meldet einen "
    "„Systemfehler“ und bittet, die Differenz sofort per Überweisung zurückzuschicken, bevor „das System es "
    "automatisch meldet“.",
    "Nicht zurücküberweisen, sondern zuerst beim Studierendenwerk direkt über die bekannte Nummer nachfragen, ob wirklich ein Fehler vorliegt.",
    [("Die Differenz sofort zurücküberweisen, um Ärger zu vermeiden.", 0),
     ("Nur einen Teil der Differenz zurücküberweisen.", 0)],
    "Eine „versehentliche Überzahlung“, die man selbst per Überweisung korrigieren soll, ist eine bekannte "
    "Masche — der ursprüngliche Betrag verschwindet später oft wieder, und die Rücküberweisung ist dann echter "
    "Verlust.",
    "Ein Systemfehler wird vom System korrigiert, nicht von einer hastigen Rücküberweisung.",
    ["financial-aid", "overpayment"]))

CARDS.append(card(48, "K", "Uni-IT", "Logg dich im Uni-Portal ein, um deine Daten zu bestätigen",
    "Eine SMS im Namen des Studierendensekretariats bittet, sich über einen verlinkten „Schnellzugang“ im "
    "Uni-Portal einzuloggen und persönliche Daten zu bestätigen, da sonst „administrative Nachteile“ drohten.",
    "Den Link ignorieren und dich wie gewohnt direkt über die offizielle Uni-Adresse ins Portal einloggen, um dort selbst nachzusehen, ob etwas zu bestätigen ist.",
    [("Sich über den verlinkten Schnellzugang einloggen und die Daten bestätigen.", 0),
     ("Den Link öffnen, aber nur den Namen bestätigen.", 0)],
    "Ein „Schnellzugang“-Link mit vager Drohung ist eine klassische Phishing-Formulierung — das echte Portal "
    "erreichst du immer über die offizielle, bekannte Adresse deiner Uni.",
    "Ein „Schnellzugang“ per Link ist nie schneller als der gewohnte, sichere Weg.",
    ["university-it", "phishing"]))

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
        "id": "university-de-wild-uni-w1",
        "lang": "de",
        "title": "Uni-Blitzrunde: Rote Flaggen",
        "edition": "university",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Uni-Onlinerunde: Jede Person hat 20 Sekunden, um ein Warnsignal aus der letzten "
                    "Uni-Karte zu nennen, ohne eine andere Person zu wiederholen.",
        "answers": {
            "A": "Die Runde ohne Wiederholung durchspielen.",
            "B": "Passen.",
            "C": "Eine schwache Antwort höflich infrage stellen.",
            "D": "Der Gastgeber verrät die Musterantwort.",
        },
        "scores": {"A": 4, "B": 0, "C": 2, "D": 0},
        "safeActions": ["A", "C"],
        "explanation": "Uni-Blitzrunde: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine genaue, konkrete sichere Handlung zählt mehr als "
                       "ein vager Ratschlag.",
        "proTip": "Nur direkt nach einer Szenariokarte einsetzen, nie als eigenständiges Minispiel.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["university", "online-play"],
        "active": True,
    },
    {
        "id": "university-de-wild-uni-w2",
        "lang": "de",
        "title": "Uni-Kanalwechsel",
        "edition": "university",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Uni-Onlinerunde: Ersetze den riskanten Kanal aus der letzten Uni-Karte durch den "
                    "sichersten passenden Prüfkanal.",
        "answers": {
            "A": "Einen konkreten, sichereren Kanal nennen.",
            "B": "Nur „sei vorsichtig“ sagen.",
            "C": "Den ursprünglichen riskanten Kanal wiederholen.",
            "D": "Den Gastgeber bitten, die Karte zu überspringen.",
        },
        "scores": {"A": 4, "B": 1, "C": 1, "D": 0},
        "safeActions": ["A"],
        "explanation": "Uni-Kanalwechsel: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine gute Antwort nennt den konkreten Kanal.",
        "proTip": "Gute Antworten nennen den genauen Kanal: Uni-Portal, Studierendenwerk-Hotline, "
                  "offizielle App, ein Anruf bei der echten Person, Sekretariat.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["university", "online-play"],
        "active": True,
    },
]
for c in WILD:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

print(f"Wrote {len(CARDS)} scored cards + {len(WILD)} wild cards to {OUT_DIR}")
print("position distribution:", pos_count)
