# -*- coding: utf-8 -*-
# Generates the German (de) Workplace edition deck — Stage 4 content, the
# fifth and final edition. Output: data/scenarios-de/workplace/. Culturally
# adapted (not translated) for German office/corporate life: Chef-Betrug
# (CEO-Fraud), Prokurist, Betriebsrat, DSGVO-Auskunftsanfragen,
# Lohnbuchhaltung, Wirtschaftsprüfer, SAP/IT-Service-Desk.
#
# Answer-position balance (16/16/16) built in at write time via a
# pre-shuffled per-card target-letter assignment — same method as the last
# three decks.
import json
import os

OUT_DIR = os.path.join("data", "scenarios-de", "workplace")
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

    cid = f"workplace-de-wrk-{num:02d}"
    all_tags = ["workplace", hack_key.lower()] + tags + (["diagnostic"] if diagnostic else [])
    return {
        "id": cid,
        "lang": "de",
        "title": title,
        "edition": "workplace",
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


TARGETS = ["A","A","B","A","B","C","C","A","C","B","B","A",
           "C","C","B","C","A","C","B","B","C","B","B","C",
           "C","B","A","A","B","C","A","B","B","A","B","B",
           "C","B","A","A","A","A","A","A","C","C","C","C"]
assert len(TARGETS) == 48

CARDS = []

# ---------------------------------------------------------------- H (1-12)
CARDS.append(card(1, "H", "Rechnungen", "Neue Bankverbindung vor Buchungsschluss",
    "Eine E-Mail im Namen eines bekannten Lieferanten meldet kurz vor dem monatlichen Buchungsschluss eine "
    "geänderte Bankverbindung für eine fällige Rechnung über 12.400 € und bittet, die Zahlung „noch heute“ "
    "auf das neue Konto anzuweisen.",
    "Die neue Kontoverbindung beim Lieferanten über eine unabhängig bekannte Telefonnummer bestätigen lassen, bevor die Zahlung angewiesen wird — unabhängig vom Buchungsschluss.",
    [("Die Zahlung sofort auf das neue Konto anweisen, um den Buchungsschluss nicht zu verpassen.", 0),
     ("Nur einen Teilbetrag auf das neue Konto anweisen.", 0)],
    "Geänderte Bankverbindungen sind die häufigste Rechnungsbetrugsmasche (CEO-/Rechnungs-Fraud) — der "
    "Buchungsschluss-Zeitdruck soll genau die Rückfrage verhindern, die den Betrug entlarvt.",
    "Eine neue IBAN bestätigst du immer telefonisch, nie nur per Mail-Antwort.",
    ["invoices", "invoice-fraud"], diagnostic=True))

CARDS.append(card(2, "H", "Lohnbuchhaltung", "Die Lohnbuchhaltung schließt in 20 Minuten",
    "Eine Mail im Namen der Personalabteilung sagt, das System für Gehaltsänderungen schließe in 20 Minuten "
    "für diesen Monat, und bittet, die eigene Bankverbindung „zur Sicherheit“ über einen Link zu bestätigen.",
    "Die Mail ignorieren und die eigene Bankverbindung nur direkt im offiziellen HR-Portal des Unternehmens prüfen oder ändern.",
    [("Die Bankverbindung sofort über den Link bestätigen, um die Frist nicht zu verpassen.", 0),
     ("Bei der im Link genannten Nummer anrufen, um nachzufragen.", 0)],
    "Echte Lohnbuchhaltungssysteme laufen über das interne HR-Portal, nie über einen externen Link mit "
    "Minutenfrist — die Frist soll verhindern, dass du im Portal selbst nachsiehst.",
    "Bankdaten fürs Gehalt änderst du nur im echten HR-Portal.",
    ["payroll", "phishing"], diagnostic=True))

CARDS.append(card(3, "H", "Anfragen der Geschäftsführung", "Der Geschäftsführer braucht zwischen zwei Flügen Gutscheinkarten",
    "Eine SMS, angeblich vom Geschäftsführer, der gerade auf Dienstreise ist, bittet dringend um den Kauf "
    "von Gutscheinkarten für „ein Kundengeschenk“ zwischen zwei Flügen — die Codes sollen sofort per Foto "
    "geschickt werden.",
    "Den Geschäftsführer über eine bekannte, unabhängige Nummer oder den Assistenten im Büro erreichen, bevor irgendetwas gekauft wird — Reisestress ändert daran nichts.",
    [("Die Gutscheinkarten sofort kaufen und die Codes fotografieren und schicken.", 0),
     ("Erst im Sekretariat fragen, ob die Geschäftsführung wirklich gerade reist.", 3)],
    "„Zwischen zwei Flügen, kann nicht lange reden“ ist die Standardformel, um eine Rückfrage zu verhindern — "
    "Gutscheincodes sind wie Bargeld und nicht rückholbar.",
    "Reisestress der Chefin ist kein Grund, eine Rückfrage zu überspringen.",
    ["executive-requests", "gift-card"]))

CARDS.append(card(4, "H", "Überweisungen", "Der Lieferant sagt: Die Sendung geht in einer Stunde raus",
    "Ein Anruf eines Lieferanten drängt, eine ausstehende Zahlung sofort per Blitzüberweisung anzuweisen, "
    "sonst werde die für heute geplante Lieferung „in einer Stunde storniert“.",
    "Die Zahlung über den regulären, mit dem Lieferanten vereinbarten Freigabeprozess abwickeln, statt wegen einer Stundenfrist eine ungeprüfte Blitzüberweisung anzuweisen.",
    [("Die Blitzüberweisung sofort anweisen, um die Lieferung nicht zu verlieren.", 0),
     ("Nur einen Teilbetrag als Blitzüberweisung anweisen.", 0)],
    "Ein regulärer Geschäftspartner droht nicht mit einer Stundenfrist bei einer bereits vereinbarten "
    "Zahlung — der interne Freigabeprozess existiert genau für solche Momente.",
    "Interne Freigabeprozesse gelten auch bei angeblicher Eile.",
    ["wire-transfers", "vishing"]))

CARDS.append(card(5, "H", "E-Signatur", "DocuSign läuft um 17 Uhr ab",
    "Eine Mail meldet, ein wichtiges Vertragsdokument in DocuSign laufe um 17 Uhr ab und müsse sofort über "
    "einen Link mit den eigenen Unternehmens-Zugangsdaten signiert werden.",
    "Den Link ignorieren und sich direkt über die offizielle DocuSign-Startseite oder die interne Vertragsverwaltung einloggen, um das Dokument zu finden.",
    [("Über den Link sofort mit den Zugangsdaten signieren, um die Frist nicht zu verpassen.", 0),
     ("Den Link öffnen, aber nur den Dokumentnamen prüfen, ohne sich anzumelden.", 1)],
    "Echte E-Signatur-Anfragen zeigen sich auch im eigenen DocuSign-Konto direkt — ein externer Link mit "
    "Ablauf-Uhrzeit ist eine bekannte Phishing-Masche für Unternehmens-Logins.",
    "Ein Dokument, das signiert werden soll, findest du auch im eigenen Konto direkt.",
    ["e-signature", "credential-phishing"]))

CARDS.append(card(6, "H", "IT-Vorfälle", "„Jetzt zurücksetzen“ während eines echten Ausfalls",
    "Während eines echten IT-Ausfalls im Unternehmen kommt eine Mail, die aussieht wie vom internen "
    "IT-Service-Desk, mit der Bitte, das Passwort sofort über einen externen Link zurückzusetzen, „um den "
    "Ausfall zu beheben“.",
    "Das Passwort nur über die offizielle interne IT-Seite oder das Ticket-System zurücksetzen, nicht über einen externen Link, auch während eines echten, bestätigten Ausfalls.",
    [("Das Passwort sofort über den externen Link zurücksetzen, um zu helfen.", 0),
     ("Den Link öffnen, aber ein anderes Passwort als sonst verwenden.", 0)],
    "Ein echter Ausfall ist der perfekte Deckmantel für Phishing — echte IT-Teams schicken Reset-Links nie "
    "während eines Vorfalls über einen externen Link, sondern über bekannte interne Systeme.",
    "Gerade während eines echten Vorfalls ist besondere Vorsicht bei „schnell zurücksetzen“ nötig.",
    ["cyber-incidents", "phishing"]))

CARDS.append(card(7, "H", "Beschaffung", "Der Quartalsend-Rabatt läuft heute Nacht ab",
    "Ein neuer Lieferant bietet einen außergewöhnlich hohen Rabatt, der „nur bis Mitternacht wegen "
    "Quartalsabschluss“ gelte, wenn die Bestellung sofort ohne den üblichen Freigabeprozess ausgelöst wird.",
    "Die Bestellung durch den regulären Beschaffungs-Freigabeprozess laufen lassen, unabhängig von der angeblichen Mitternachtsfrist.",
    [("Die Bestellung sofort ohne Freigabeprozess auslösen, um den Rabatt zu sichern.", 0),
     ("Nur eine Teilbestellung ohne Freigabeprozess auslösen.", 0)],
    "Ein Rabatt, der genau den internen Kontrollprozess umgehen soll, ist verdächtiger als der entgangene "
    "Rabatt selbst — echte Lieferanten respektieren normale Freigabewege.",
    "Ein Rabatt, der Kontrollen umgehen will, kostet am Ende mehr.",
    ["procurement", "process-bypass"]))

CARDS.append(card(8, "H", "Kundenerstattungen", "Erstatte diesen Kunden, bevor er eskaliert",
    "Eine Mail, angeblich vom Vorgesetzten, drängt, einem unbekannten Kunden sofort eine hohe Erstattung ohne "
    "die übliche Prüfung auszuzahlen, „bevor er in den sozialen Medien eskaliert“.",
    "Die Erstattung durch die reguläre Prüfung laufen lassen und die Anweisung beim Vorgesetzten persönlich oder telefonisch bestätigen, bevor ausgezahlt wird.",
    [("Die Erstattung sofort ohne Prüfung auszahlen, um eine öffentliche Eskalation zu vermeiden.", 0),
     ("Nur die Hälfte der Erstattung sofort auszahlen.", 0)],
    "Die Angst vor öffentlicher Eskalation wird gezielt genutzt, um Kontrollprozesse zu umgehen — eine "
    "kurze Rückfrage beim echten Vorgesetzten kostet keine zusätzliche Eskalation.",
    "Reputationsangst ist kein Grund, eine Prüfung zu überspringen.",
    ["customer-refunds", "social-engineering"]))

CARDS.append(card(9, "H", "Recht", "Sichere diese Dateien in 30 Minuten",
    "Eine Mail im Namen der Rechtsabteilung verlangt, binnen 30 Minuten bestimmte interne Dateien über einen "
    "externen Upload-Link „zur Beweissicherung“ hochzuladen, wegen eines angeblich laufenden Verfahrens.",
    "Die Anfrage direkt bei der internen Rechtsabteilung über eine bekannte Nummer bestätigen lassen, bevor Dateien über einen externen Link hochgeladen werden.",
    [("Die Dateien sofort über den externen Link hochladen, um die Frist einzuhalten.", 0),
     ("Nur einen Teil der Dateien hochladen.", 0)],
    "Eine echte Beweissicherung (Litigation Hold) läuft über interne, bekannte Systeme — ein externer "
    "Upload-Link mit Minutenfrist ist eine bekannte Datenexfiltrations-Masche.",
    "Beweissicherung läuft nie über einen externen Upload-Link mit Countdown.",
    ["legal", "data-exfiltration"]))

CARDS.append(card(10, "H", "Dienstreisen der Führungsebene", "Die Führungskraft sitzt fest — sofort umbuchen",
    "Eine SMS, angeblich von der reisenden Geschäftsführung, meldet einen verpassten Anschlussflug und "
    "bittet, sofort über einen Link einen teuren Ersatzflug mit der Firmenkreditkarte zu buchen.",
    "Die Geschäftsführung über eine bekannte, unabhängige Nummer erreichen oder das Reisebüro des Unternehmens direkt kontaktieren, statt über den Link zu buchen.",
    [("Über den Link sofort den Ersatzflug mit der Firmenkarte buchen.", 0),
     ("Nur die Flugdaten über den Link prüfen, ohne zu buchen.", 1)],
    "Eine echte gestrandete Führungskraft ruft das Reisebüro oder die Assistenz an — sie schickt keinen "
    "Buchungslink mit sofortiger Kartenzahlungsaufforderung per SMS.",
    "Firmenkarten-Buchungen laufen über das Reisebüro, nie über einen SMS-Link.",
    ["executive-travel", "smishing"]))

CARDS.append(card(11, "H", "Identität", "Registriere dein neues MFA-Gerät, bevor du ausgesperrt wirst",
    "Eine Mail im Namen der IT-Abteilung warnt, dass alle Mitarbeitenden ihr MFA-Gerät binnen einer Stunde "
    "über einen externen Link neu registrieren müssten, sonst würden sie „vom System ausgesperrt“.",
    "Das MFA-Gerät nur über die offizielle interne IT-Seite neu registrieren und die Frist beim IT-Service-Desk telefonisch überprüfen lassen.",
    [("Das Gerät sofort über den externen Link registrieren, um nicht ausgesperrt zu werden.", 0),
     ("Nur die alte MFA-Methode über den Link bestätigen.", 0)],
    "Ein unternehmensweiter MFA-Reset mit Stundenfrist über einen externen Link ist ein bekanntes "
    "Massen-Phishing-Muster — die interne IT-Seite ist immer der sichere Weg.",
    "MFA-Geräte registrierst du nur über die interne IT-Seite.",
    ["identity", "mass-phishing"]))

CARDS.append(card(12, "H", "Recht", "Die Wirtschaftsprüfer brauchen diese Datei vor Mittag",
    "Eine Mail, angeblich von den externen Wirtschaftsprüfern, verlangt eine vertrauliche Finanzdatei „vor "
    "ihrer Abreise um 12 Uhr“ über einen externen Link, statt über den vereinbarten sicheren Datenraum.",
    "Die Anfrage über den internen Ansprechpartner für die Prüfung bestätigen und Dateien ausschließlich über den vereinbarten sicheren Datenraum teilen.",
    [("Die Datei sofort über den externen Link schicken, um die Frist einzuhalten.", 0),
     ("Nur einen Teil der Datei über den Link schicken.", 0)],
    "Wirtschaftsprüfungen laufen über einen vorher vereinbarten, sicheren Datenraum — ein plötzlicher "
    "externer Link mit Mittagsfrist weicht vom vereinbarten Prozess ab und ist ein Warnsignal.",
    "Prüfungsunterlagen gehen nur über den vereinbarten Datenraum, nie über einen neuen Link.",
    ["legal", "data-exfiltration"]))

# ---------------------------------------------------------------- A (13-24)
CARDS.append(card(13, "A", "Deepfake-Stimme", "Der Chef ist am Telefon. Irgendwie.",
    "Ein Anruf klingt täuschend echt wie die Stimme des Geschäftsführers und weist an, sofort eine "
    "Überweisung für eine „vertrauliche Übernahme“ auszulösen — die Stimme klingt zwar richtig, aber "
    "hastiger als sonst.",
    "Auflegen und die Anweisung über einen zweiten, unabhängigen Kanal (persönlich, bekannte Nummer, internes Chatsystem) beim Geschäftsführer selbst bestätigen, bevor irgendetwas überwiesen wird.",
    [("Die Überweisung sofort auslösen, weil die Stimme eindeutig nach dem Geschäftsführer klingt.", 0),
     ("Nach Details zur Übernahme fragen, um die Geschichte zu prüfen.", 1)],
    "KI-Stimmenklone werden immer überzeugender — eine vertraute Stimme allein ist kein Beweis mehr. Ein "
    "zweiter, unabhängiger Kanal ist die einzige verlässliche Bestätigung bei ungewöhnlichen Zahlungen.",
    "Eine vertraute Stimme reicht bei einer ungewöhnlichen Zahlung nicht mehr als Beweis.",
    ["deepfake-voice", "voice-clone"], diagnostic=True))

CARDS.append(card(14, "A", "IT-Support", "IT will Fernzugriff",
    "Ein Anrufer, der sich als IT-Support ausgibt, bittet um Fernzugriff auf deinen Arbeitsrechner, um „ein "
    "dringendes Sicherheitsproblem“ zu beheben, das angeblich dein Konto betrifft.",
    "Auflegen und den IT-Service-Desk über die bekannte interne Nummer oder das Ticket-System selbst kontaktieren, statt spontanen Fernzugriff zu gewähren.",
    [("Den Fernzugriff sofort gewähren, um das Sicherheitsproblem zu beheben.", 0),
     ("Nach der Ticketnummer fragen und dann Zugriff gewähren.", 1)],
    "Echter IT-Support meldet sich über bekannte, interne Kanäle und Ticket-Nummern — ein spontaner Anruf "
    "mit sofortiger Fernzugriffsanfrage ist eine bekannte Social-Engineering-Masche.",
    "Fernzugriff gewährst du nur über einen selbst eröffneten IT-Kontakt, nie auf spontanen Anruf.",
    ["it-support", "remote-access"], diagnostic=True))

CARDS.append(card(15, "A", "Banking", "Die Betrugsabteilung deiner Bank ruft die Buchhaltung an",
    "Ein Anrufer gibt sich als Betrugsabteilung der Firmenbank aus und bittet die Buchhaltung, eine "
    "laufende Überweisung „zur Sicherheit“ auf ein anderes, vom Anrufer genanntes Konto umzuleiten.",
    "Auflegen und die Bank über die offizielle, unabhängig bekannte Firmenkundennummer selbst kontaktieren, bevor irgendeine Umleitung vorgenommen wird.",
    [("Die Überweisung wie gewünscht auf das genannte Konto umleiten.", 0),
     ("Nach dem Namen und der Abteilung des Anrufers fragen und dann umleiten.", 1)],
    "Eine echte Bank leitet Zahlungen nie telefonisch auf ein vom Anrufer genanntes Konto um — das ist "
    "genau die Methode, eine Überweisung zu kapern.",
    "Keine Bank verlangt telefonisch eine Umleitung auf ein neues Konto.",
    ["banking", "vishing"]))

CARDS.append(card(16, "A", "Personalabteilung", "Die Personalabteilung braucht deinen Login",
    "Eine Mail, angeblich von der Personalabteilung, bittet dich, dich über einen Link mit deinem "
    "Unternehmens-Login anzumelden, um „die neuen Sozialleistungen zu bestätigen“.",
    "Den Link ignorieren und dich stattdessen direkt im bekannten HR-Portal des Unternehmens einloggen, um die Information dort zu finden.",
    [("Sich über den Link mit dem Unternehmens-Login anmelden.", 0),
     ("Den Link öffnen, aber ein anderes Passwort verwenden.", 0)],
    "Die Personalabteilung verschickt Login-Aufforderungen nie über einen externen Link — das bekannte "
    "HR-Portal ist immer der richtige Ort für solche Informationen.",
    "Ein HR-Login gehört nur ins bekannte, interne Portal.",
    ["hr", "credential-phishing"]))

CARDS.append(card(17, "A", "Recht", "Die externe Anwaltskanzlei fordert einen Datenexport",
    "Eine Mail, angeblich von einer externen Anwaltskanzlei, mit der das Unternehmen tatsächlich "
    "zusammenarbeitet, fordert einen vollständigen Export von Personaldaten „für ein laufendes Mandat“ über "
    "einen externen Link.",
    "Die Anfrage über den internen Rechts- oder Datenschutzverantwortlichen prüfen lassen, bevor irgendein Datenexport über einen externen Link erfolgt.",
    [("Den Datenexport sofort über den Link bereitstellen, weil die Kanzlei bekannt ist.", 0),
     ("Nur einen Teil der Daten über den Link bereitstellen.", 0)],
    "Eine bekannte Zusammenarbeit macht eine konkrete E-Mail nicht automatisch echt — E-Mail-Konten von "
    "Kanzleien werden gezielt kompromittiert. Der interne Datenschutzverantwortliche prüft solche Anfragen "
    "immer zuerst.",
    "Ein bekannter Name ersetzt keine interne Freigabe für einen Datenexport.",
    ["legal", "business-email-compromise"]))

CARDS.append(card(18, "A", "Cloud-Dienste", "„Microsoft-Admin“ braucht eine Zustimmungsfreigabe",
    "Eine Mail, angeblich von Microsoft, bittet dich, einer App eine OAuth-„Zustimmungsfreigabe“ mit "
    "weitreichendem Zugriff auf dein Firmenkonto zu erteilen, um „ein Sicherheitsupdate abzuschließen“.",
    "Die Zustimmung verweigern und die IT-Abteilung über den internen Kanal fragen, ob eine solche App wirklich benötigt und freigegeben ist.",
    [("Die Zustimmung sofort erteilen, um das Sicherheitsupdate abzuschließen.", 0),
     ("Die Zustimmung mit eingeschränkten Rechten erteilen.", 1)],
    "Echte Sicherheitsupdates verlangen keine OAuth-Zustimmung für eine Drittanbieter-App — das ist eine "
    "bekannte Methode, dauerhaften Zugriff auf Firmenkonten zu bekommen.",
    "Eine OAuth-Zustimmung für eine unbekannte App ist nie ein „Sicherheitsupdate“.",
    ["cloud-services", "oauth-phishing"]))

CARDS.append(card(19, "A", "Aufsichtsbehörden", "Eine Aufsichtsbehörde will heute Unterlagen",
    "Eine Mail, angeblich von einer Aufsichtsbehörde, verlangt die sofortige Übermittlung interner "
    "Unterlagen „noch heute“ über eine externe Upload-Seite, sonst drohten „rechtliche Konsequenzen“.",
    "Die Anfrage über den internen Compliance- oder Rechtsverantwortlichen bestätigen lassen und Unterlagen nur über offizielle, bekannte Behördenkanäle übermitteln.",
    [("Die Unterlagen sofort über die externe Upload-Seite übermitteln.", 0),
     ("Nur einen Teil der Unterlagen übermitteln.", 0)],
    "Echte Behördenanfragen laufen über offizielle, formale Kanäle mit angemessenen Fristen, nicht über "
    "eine externe Upload-Seite mit Tagesfrist und Drohung.",
    "Behörden drohen nicht per E-Mail mit sofortigen Konsequenzen.",
    ["regulators", "government-impostor"]))

CARDS.append(card(20, "A", "Lieferanten-Führung", "Der Geschäftsführer des Lieferanten will eine Ausnahme",
    "Eine Mail, angeblich vom Geschäftsführer eines langjährigen Lieferanten, bittet persönlich um eine "
    "Ausnahme von den üblichen Zahlungsbedingungen — Vorauszahlung auf ein neues Konto statt der üblichen "
    "Rechnung nach Lieferung.",
    "Die Bitte über den bekannten, üblichen Ansprechpartner beim Lieferanten bestätigen lassen, bevor von den normalen Zahlungsbedingungen abgewichen wird.",
    [("Die Ausnahme gewähren, weil die Bitte persönlich von der Geschäftsführung kommt.", 0),
     ("Nur eine kleine Vorauszahlung als Ausnahme leisten.", 0)],
    "Ein persönlicher Name an der Spitze macht eine Ausnahme von etablierten Zahlungsprozessen nicht sicherer "
    "— genau das nutzen Betrüger gezielt aus, wenn sie sich als Führungsperson ausgeben.",
    "Eine Ausnahme von der Regel bestätigst du über den üblichen Kontakt, nicht nur per Mail von „oben“.",
    ["vendor-leadership", "impostor"]))

CARDS.append(card(21, "A", "Vorstandskommunikation", "Ein Vorstandsmitglied fragt nach der Gesellschafterliste",
    "Eine Mail, angeblich von einem Vorstandsmitglied, bittet dringend und vertraulich um die aktuelle "
    "Gesellschafterliste und Beteiligungsdetails, „für ein Gespräch mit einem Investor heute Nachmittag“.",
    "Die Anfrage direkt beim Vorstandsmitglied über eine bekannte, unabhängige Nummer bestätigen, bevor vertrauliche Gesellschafterdaten verschickt werden.",
    [("Die Liste sofort schicken, weil die Anfrage von einem Vorstandsmitglied kommt.", 0),
     ("Nach dem Namen des Investors fragen und dann schicken.", 1)],
    "Vertrauliche Gesellschafterdaten werden nicht spontan per E-Mail unter Zeit- und Vertraulichkeitsdruck "
    "herausgegeben — ein kompromittiertes Vorstands-E-Mail-Konto sieht genauso aus wie das echte.",
    "„Vertraulich und dringend“ zusammen ist ein Grund für eine zusätzliche Rückfrage, nicht weniger.",
    ["board-communications", "business-email-compromise"]))

CARDS.append(card(22, "A", "Bank-Sicherheit", "„Betrugsprävention“ will eine Testzahlung",
    "Ein Anrufer, angeblich von der Betrugsprävention der Bank, bittet die Buchhaltung, eine kleine "
    "„Testzahlung“ an ein neues Konto zu senden, um „die Sicherheit des Kontos zu überprüfen“.",
    "Auflegen und die Bank über die offizielle Firmenkundennummer selbst kontaktieren; keine Testzahlung an ein vom Anrufer genanntes Konto senden.",
    [("Die Testzahlung senden, um bei der Sicherheitsprüfung zu helfen.", 0),
     ("Nur einen sehr kleinen Betrag als Testzahlung senden.", 0)],
    "Eine „Testzahlung“ existiert bei echten Banküberweisungen nicht — jede bestätigte Überweisung ist eine "
    "echte, unwiderrufliche Zahlung.",
    "Eine „Testzahlung“ ist immer eine echte Zahlung.",
    ["bank-security", "payment-scam"]))

CARDS.append(card(23, "A", "Personalbeziehungen", "Eine vertraute HR-Partnerin braucht Mitarbeiterdaten",
    "Die HR-Partnerin, mit der du seit Jahren zusammenarbeitest, schreibt aus einer neuen, unbekannten "
    "E-Mail-Adresse und bittet dringend um eine Liste mit Gehalts- und Kontodaten von Mitarbeitenden.",
    "Sie über die bekannte, alte E-Mail-Adresse oder telefonisch fragen, warum sie von einer neuen Adresse schreibt, bevor sensible Daten geschickt werden.",
    [("Die Daten sofort schicken, weil man die Person seit Jahren kennt.", 0),
     ("Nur einen Teil der Daten schicken.", 0)],
    "Eine neue, unbekannte Absenderadresse bei einer sonst vertrauten Person ist ein starkes Warnsignal — "
    "jahrelange Zusammenarbeit ersetzt keine Bestätigung über den bekannten Kanal.",
    "Eine neue Absenderadresse prüfst du über den alten, bekannten Kanal.",
    ["hr-relationships", "account-takeover"]))

CARDS.append(card(24, "A", "Datenschutz", "DSGVO-Auskunftsanfrage: schick alles zu dieser Person",
    "Eine E-Mail, angeblich eine Auskunftsanfrage nach Art. 15 DSGVO, verlangt sofort alle gespeicherten "
    "Daten zu einer bestimmten Person, ohne den üblichen internen Datenschutzprozess zu durchlaufen.",
    "Die Anfrage über den internen Datenschutzbeauftragten bearbeiten lassen — auch eine DSGVO-Anfrage läuft über den etablierten Prozess, nicht per direkter Sofortauskunft.",
    [("Alle Daten sofort direkt an die anfragende Person schicken.", 0),
     ("Nur einen Teil der Daten sofort schicken.", 0)],
    "DSGVO-Auskunftsanfragen haben eine gesetzliche Frist von einem Monat, keine Sofortpflicht — und sie "
    "laufen über den Datenschutzbeauftragten, der auch die Identität der anfragenden Person prüft.",
    "Auch eine echte DSGVO-Anfrage läuft über den Datenschutzbeauftragten, nicht sofort direkt.",
    ["legal", "identity-phishing"]))

# ---------------------------------------------------------------- C (25-36)
CARDS.append(card(25, "C", "Lieferanten", "Der E-Mail-Verlauf ist echt; das Bankkonto ist neu",
    "In einem langen, echten E-Mail-Verlauf mit einem bekannten Lieferanten taucht plötzlich eine neue "
    "Nachricht auf: Die Bankverbindung habe sich geändert, bitte die nächste Zahlung auf das neue Konto "
    "überweisen.",
    "Die neue Kontoverbindung über eine unabhängig bekannte Telefonnummer beim Lieferanten bestätigen lassen, auch wenn der E-Mail-Verlauf echt und lange bekannt ist.",
    [("Auf das neue Konto überweisen, weil der gesamte E-Mail-Verlauf echt aussieht.", 0),
     ("Nur einen Teilbetrag auf das neue Konto überweisen.", 0)],
    "Ein echter, langer E-Mail-Verlauf beweist nicht, dass das E-Mail-Konto gerade nicht kompromittiert ist "
    "— Angreifer klinken sich oft mitten in echte Threads ein, gerade weil das Vertrauen schafft.",
    "Ein echter E-Mail-Verlauf ist kein Beweis für eine echte neue Kontoverbindung.",
    ["suppliers", "business-email-compromise"], diagnostic=True))

CARDS.append(card(26, "C", "Zusammenarbeit", "Dein Kollege schickt eine Teams-Datei",
    "Ein Kollege, mit dem du regelmäßig zusammenarbeitest, schickt über Teams einen Link zu einer "
    "„wichtigen Datei“ — der Link verlangt aber, dich erneut mit deinem vollen Unternehmens-Login anzumelden.",
    "Den Kollegen kurz fragen, ob er die Datei wirklich geschickt hat, bevor du dich über den Link erneut anmeldest — normale geteilte Dateien verlangen das nicht.",
    [("Sich sofort über den Link erneut anmelden, um die Datei zu öffnen.", 0),
     ("Den Link öffnen, aber ein anderes Passwort verwenden.", 0)],
    "Eine normale Teams-geteilte Datei öffnet sich direkt, ohne erneute volle Anmeldung zu verlangen — das "
    "ist ein bekanntes Zeichen für ein kompromittiertes Kollegenkonto.",
    "Eine echte geteilte Datei verlangt keine erneute volle Anmeldung.",
    ["collaboration", "account-takeover"], diagnostic=True))

CARDS.append(card(27, "C", "Berater", "Der vertraute Berater braucht OAuth-Zugriff",
    "Ein externer Berater, mit dem das Unternehmen seit Jahren zusammenarbeitet, bittet um eine "
    "OAuth-Zustimmung mit weitreichendem Zugriff auf das Firmen-E-Mail-System, „um die Analyse zu "
    "automatisieren“.",
    "Nur den minimal nötigen, zeitlich begrenzten Zugriff über die IT-Abteilung einrichten lassen, statt eine weitreichende OAuth-Zustimmung direkt zu erteilen.",
    [("Die weitreichende OAuth-Zustimmung direkt erteilen, weil der Berater seit Jahren vertrauenswürdig ist.", 0),
     ("Die Zustimmung erteilen, aber sie nach dem Projekt wieder entziehen.", 1)],
    "Langjähriges Vertrauen rechtfertigt keinen weitreichenderen Zugriff als nötig — ein Beraterkonto kann "
    "kompromittiert werden, und die IT-Abteilung kann einen sauber begrenzten Zugang einrichten.",
    "Vertrauen in eine Person ersetzt kein minimal-notwendiges Zugriffsrecht.",
    ["consultants", "oauth-phishing"]))

CARDS.append(card(28, "C", "Kommunikation", "Der Partner verlegt das Geschäft auf WhatsApp",
    "Mitten in einer offiziellen Vertragsverhandlung per E-Mail schlägt der Geschäftspartner plötzlich vor, "
    "„der Einfachheit halber“ auf WhatsApp zu wechseln, um Zahlungsdetails zu besprechen.",
    "Beim offiziellen E-Mail-Kanal und den dokumentierten Prozessen bleiben; einen plötzlichen Wechsel zu einem privaten Messenger für Zahlungsdetails ablehnen oder hinterfragen.",
    [("Auf WhatsApp wechseln, um es dem Partner einfacher zu machen.", 0),
     ("Auf WhatsApp wechseln, aber alle Nachrichten zusätzlich per E-Mail bestätigen lassen.", 2)],
    "Ein plötzlicher Kanalwechsel weg von dokumentierten, offiziellen Systemen — gerade bei Zahlungsdetails "
    "— ist ein bekanntes Muster, um Spuren zu verwischen oder ein übernommenes Konto zu nutzen.",
    "Zahlungsdetails bleiben auf dem offiziellen, dokumentierten Kanal.",
    ["messaging", "channel-switch-scam"]))

CARDS.append(card(29, "C", "Projekte", "Der Link zum geteilten Laufwerk kommt vom Projektleiter",
    "Der Projektleiter, den du gut kennst, teilt einen Link zu einem „aktualisierten“ gemeinsamen Laufwerk "
    "— der Link verlangt aber eine App-Installation, bevor der Ordner sichtbar wird.",
    "Den Projektleiter fragen, ob die App-Installation wirklich nötig und von der IT freigegeben ist, bevor irgendetwas installiert wird.",
    [("Die App sofort installieren, um auf das Laufwerk zuzugreifen.", 0),
     ("Die App installieren, aber die Berechtigungen danach einschränken.", 1)],
    "Ein bekannter Name im Absender macht eine ungewöhnliche App-Installationsanforderung nicht sicherer — "
    "sein Konto kann kompromittiert sein.",
    "Eine App-Installation für ein Laufwerk braucht immer eine IT-Freigabe.",
    ["projects", "malware"]))

CARDS.append(card(30, "C", "Kundenbeziehungen", "Der Kunde sagt: „Nutz heute meine private Gmail“",
    "Ein wichtiger Kunde schreibt, sein Firmen-E-Mail-Postfach funktioniere gerade nicht, und bittet, "
    "vertrauliche Vertragsunterlagen stattdessen an seine private Gmail-Adresse zu schicken.",
    "Vertrauliche Unterlagen nicht an eine private Adresse schicken, sondern anbieten, zu warten oder einen anderen offiziellen Kanal zu nutzen, und die Bitte telefonisch beim Kunden bestätigen.",
    [("Die Unterlagen sofort an die private Gmail-Adresse schicken, um dem Kunden zu helfen.", 0),
     ("Nur einen Teil der Unterlagen an die private Adresse schicken.", 0)],
    "Eine plötzliche Bitte, vertrauliche Firmenunterlagen an eine private Adresse zu schicken, ist ein "
    "bekanntes Muster für ein kompromittiertes Kundenkonto — eine telefonische Bestätigung klärt es sicher.",
    "Vertrauliche Unterlagen bleiben auf offiziellen Kanälen, auch wenn der Kunde um eine Ausnahme bittet.",
    ["client-relationships", "business-email-compromise"]))

CARDS.append(card(31, "C", "Kalender", "Die Einladung der Assistentin hat einen Login-Button",
    "Eine Kalendereinladung, die aussieht, als käme sie von der Assistentin eines wichtigen Kontakts, enthält "
    "einen Button „Anmelden, um am Meeting teilzunehmen“, der nach dem vollen Unternehmens-Login fragt.",
    "Den Kalendereintrag direkt im eigenen Kalendersystem öffnen, statt sich über einen Button in der Einladung mit dem vollen Login anzumelden.",
    [("Sich über den Button in der Einladung mit dem vollen Login anmelden.", 0),
     ("Den Button öffnen, aber ein anderes Passwort verwenden.", 0)],
    "Echte Meeting-Einladungen öffnen sich direkt im eigenen Kalender- oder Videokonferenzsystem, ohne eine "
    "erneute volle Login-Eingabe über einen Button in der Mail zu verlangen.",
    "Ein Meeting öffnest du im eigenen Kalender, nicht über einen Login-Button in der Einladung.",
    ["calendars", "credential-phishing"]))

CARDS.append(card(32, "C", "Bewerbungen", "Der Bewerber hat sein Portfolio geschickt",
    "Ein Bewerber auf eine offene Stelle schickt sein Portfolio als „interaktive Datei“, die beim Öffnen "
    "eine Makro-Aktivierung verlangt, um „alle Projekte korrekt anzuzeigen“.",
    "Die Datei nicht mit aktivierten Makros öffnen und stattdessen um ein PDF oder einen Link zu einem Online-Portfolio bitten.",
    [("Die Makros aktivieren, um das Portfolio vollständig zu sehen.", 0),
     ("Die Datei in einer isolierten Testumgebung mit Makros öffnen.", 1)],
    "Eine Bewerbung, die eine Makro-Aktivierung verlangt, ist eine bekannte Schadsoftware-Einschleusung — "
    "ein normales Portfolio braucht das nie.",
    "Ein Portfolio, das Makros braucht, ist verdächtiger als ein fehlendes Feature.",
    ["hr-relationships", "malware"]))

CARDS.append(card(33, "C", "Zusammenarbeit", "Der Meeting-Bot ist schon in der Konferenz",
    "Zu Beginn eines wichtigen Videocalls ist bereits ein unbekannter „Notiz-Bot“ mit professionellem Namen "
    "im Meeting, der automatisch mitschreibt und die Zusammenfassung „an alle Teilnehmer per Link“ verschicken will.",
    "Den Bot aus dem Meeting entfernen, wenn ihn niemand eingeladen hat, und die Zusammenfassung nur über den offiziellen, bekannten Kanal des Unternehmens teilen lassen.",
    [("Den Bot mitschreiben lassen und den Link zur Zusammenfassung später anklicken.", 0),
     ("Den Bot fragen, wer ihn eingeladen hat, und ihn dann weiterlaufen lassen.", 1)],
    "Ein professionell aussehender Name macht einen unbekannten Meeting-Bot nicht automatisch legitim — "
    "solche Bots werden genutzt, um vertrauliche Gespräche mitzuschneiden oder Phishing-Links zu verbreiten.",
    "Ein Bot, den niemand eingeladen hat, gehört nicht ins Meeting.",
    ["collaboration", "meeting-bot-scam"]))

CARDS.append(card(34, "C", "Kollegen", "Dein Kollege hat eine neue Nummer",
    "Ein Kollege schreibt von einer neuen Handynummer auf WhatsApp und bittet dringend, ihm bei einer "
    "„vertraulichen Zahlungsangelegenheit“ für die Abteilung zu helfen, während er „gerade unterwegs“ ist.",
    "Ihn über die alte, im Firmenverzeichnis bekannte Nummer oder E-Mail-Adresse erreichen, bevor irgendetwas in einer „vertraulichen Zahlungsangelegenheit“ unternommen wird.",
    [("Der Bitte auf der neuen Nummer sofort folgen, weil es wie der Kollege klingt.", 0),
     ("Im Team fragen, ob jemand die neue Nummer schon kennt.", 2)],
    "Eine neue, unbestätigte Nummer plus eine vertrauliche Zahlungsbitte ist eine klassische "
    "Chef-/Kollegen-Betrugsmasche — das Firmenverzeichnis kennt die echte, bekannte Nummer.",
    "Eine neue Nummer bestätigst du über die alte, bekannte — nie umgekehrt.",
    ["coworkers", "impostor"]))

CARDS.append(card(35, "C", "Kundensupport", "Ein Kunde antwortet mit einer „Diagnosedatei“",
    "Ein Kunde im Support-Ticket schickt eine „Diagnosedatei“ zur Fehleranalyse, die als Word-Dokument mit "
    "aktivierten Makros ankommt und beim Öffnen sofort Warnungen der Sicherheitssoftware auslöst.",
    "Die Datei nicht öffnen und den Kunden bitten, stattdessen einen Screenshot oder eine reine Textbeschreibung des Fehlers zu schicken.",
    [("Die Datei trotz Warnung öffnen, um dem Kunden schnell zu helfen.", 0),
     ("Die Datei in einer isolierten Testumgebung öffnen.", 1)],
    "Eine Sicherheitswarnung beim Öffnen einer Kundendatei ist ein direktes Signal, nicht fortzufahren — "
    "ein Screenshot oder eine Textbeschreibung reicht für die meisten Support-Fälle.",
    "Eine Warnung der eigenen Sicherheitssoftware ist kein Hindernis, das man umgeht.",
    ["customer-support", "malware"]))

CARDS.append(card(36, "C", "Kunden", "Der Kunde sagt: „Nutz heute meine private Gmail“",
    "Ein Bestandskunde schreibt aus einer neuen, privaten E-Mail-Adresse, sein Geschäftskonto sei „gerade "
    "gesperrt“, und bittet, die aktuelle Bestellung samt Zahlungsdetails an diese neue Adresse zu schicken.",
    "Vertrauliche Bestell- und Zahlungsdetails nicht an die neue Adresse schicken, sondern die Bitte telefonisch beim bekannten Ansprechpartner des Kunden bestätigen.",
    [("Die Bestellung sofort an die neue Adresse schicken, um den Kunden nicht zu verlieren.", 0),
     ("Nur einen Teil der Bestellung an die neue Adresse schicken.", 0)],
    "Eine neue Adresse mit der Begründung „gerade gesperrt“ ist ein bekanntes Muster für ein übernommenes "
    "Kundenkonto — ein Anruf beim bekannten Ansprechpartner klärt es sicher.",
    "Eine „gesperrte“ Adresse bestätigst du telefonisch, bevor du auf die neue reagierst.",
    ["client-relationships", "account-takeover"]))

# ---------------------------------------------------------------- K (37-48)
CARDS.append(card(37, "K", "Identität", "MFA-Erschöpfung um 7:03 Uhr",
    "Schon vor Arbeitsbeginn kommen mehrere MFA-Bestätigungsanfragen für dein Konto hintereinander, obwohl "
    "du selbst noch nichts angefragt hast — bis eine davon endlich bestätigt wird, hören sie nicht auf.",
    "Keine der Anfragen bestätigen, das Passwort sofort ändern und den IT-Service-Desk kontaktieren; wiederholte unerwartete MFA-Anfragen sind ein bekanntes Angriffsmuster (MFA-Fatigue).",
    [("Eine der Anfragen bestätigen, damit die Flut aufhört.", 0),
     ("Eine Anfrage bestätigen und danach das Passwort ändern.", 1)],
    "„MFA-Fatigue“ setzt genau darauf, dass Genervtheit irgendwann zum Bestätigen führt — jede einzelne "
    "Anfrage, die du selbst nicht ausgelöst hast, ist ein Nein.",
    "Viele Anfragen hintereinander sind ein Angriff, keine Ausrede zum Bestätigen.",
    ["identity", "mfa-fatigue"], diagnostic=True))

CARDS.append(card(38, "K", "OAuth", "Die Login-Seite ist echt; die App ist es nicht",
    "Ein Link zu einer neuen Produktivitäts-App führt zur echten, offiziellen Microsoft-Login-Seite — nach "
    "der Anmeldung fragt aber eine unbekannte App nach weitreichender OAuth-Zustimmung für E-Mail und Dateien.",
    "Die Zustimmung für die unbekannte App verweigern, auch wenn die vorherige Login-Seite echt aussah, und die App bei der IT-Abteilung melden.",
    [("Die Zustimmung erteilen, weil die Login-Seite davor eindeutig echt war.", 0),
     ("Die Zustimmung mit eingeschränkten Rechten erteilen.", 1)],
    "Eine echte Login-Seite garantiert nicht, dass die App danach vertrauenswürdig ist — genau dieser "
    "Zwei-Schritt-Trick nutzt das Vertrauen in die echte Microsoft-Seite aus.",
    "Eine echte Login-Seite macht die App danach nicht automatisch echt.",
    ["oauth", "oauth-phishing"], diagnostic=True))

CARDS.append(card(39, "K", "QR-Phishing", "Der QR-Code in der Teeküche sagt „Benefits-Update“",
    "An der Pinnwand in der Teeküche hängt ein Zettel mit QR-Code: „Wichtiges Update zu euren "
    "Sozialleistungen — bitte scannen und Login bestätigen.“",
    "Den QR-Code nicht scannen und Informationen zu Sozialleistungen nur über das bekannte, offizielle HR-Portal suchen.",
    [("Den Code scannen und den Login bestätigen, um informiert zu bleiben.", 0),
     ("Den Code scannen, aber ein anderes Passwort verwenden.", 0)],
    "Ein Zettel mit QR-Code an einer öffentlich zugänglichen Pinnwand kann von jedem aufgehängt werden — "
    "echte HR-Kommunikation läuft über bekannte, offizielle interne Kanäle.",
    "Ein Zettel an der Pinnwand ist keine offizielle HR-Kommunikation.",
    ["qr-phishing", "quishing"]))

CARDS.append(card(40, "K", "Browser-Erweiterungen", "Diese Erweiterung repariert das kaputte Portal",
    "Nach einem gemeldeten Problem mit dem internen Firmenportal empfiehlt ein Chat-Kanal eine "
    "Browser-Erweiterung, die das Problem „sofort behebt“ — sie verlangt weitreichenden Zugriff auf alle "
    "besuchten Seiten.",
    "Die Erweiterung nicht installieren und das Portalproblem stattdessen über den offiziellen IT-Support melden.",
    [("Die Erweiterung installieren, um das Portal wieder nutzen zu können.", 0),
     ("Die Erweiterung installieren, aber die Berechtigungen danach einschränken.", 1)],
    "Eine Browser-Erweiterung mit Zugriff auf alle besuchten Seiten kann jedes Login und jede Sitzung "
    "mitlesen — ein Portalfehler wird über IT-Support behoben, nie über eine inoffizielle Erweiterung.",
    "Ein IT-Problem löst der IT-Support, keine inoffizielle Erweiterung.",
    ["browser-extensions", "malware"]))

CARDS.append(card(41, "K", "Passwort-Manager", "„Exportier deinen Passwort-Tresor zur Wiederherstellung“",
    "Eine Mail im Namen des Passwort-Manager-Anbieters des Unternehmens bittet, den gesamten Passwort-Tresor "
    "als Datei zu exportieren und über ein Formular „zur Kontowiederherstellung“ hochzuladen.",
    "Den Tresor nicht exportieren; eine echte Kontowiederherstellung beim Passwort-Manager läuft nie über den Export und Upload des gesamten Tresors an Dritte.",
    [("Den Tresor exportieren und über das Formular hochladen.", 0),
     ("Nur einen Teil der Passwörter exportieren.", 0)],
    "Ein exportierter Passwort-Tresor enthält alle Zugangsdaten im Klartext — kein legitimer "
    "Wiederherstellungsprozess verlangt, ihn an ein externes Formular zu schicken.",
    "Ein Passwort-Tresor verlässt nie das eigene Gerät als Export an Dritte.",
    ["password-managers", "data-exfiltration"]))

CARDS.append(card(42, "K", "Quellcode-Verwaltung", "Security fragt nach deinem API-Schlüssel",
    "Eine Chat-Nachricht, angeblich vom Sicherheitsteam, bittet dich, deinen persönlichen API-Schlüssel für "
    "das Quellcode-System zu „einer Sicherheitsüberprüfung“ direkt im Chat zu posten.",
    "Den API-Schlüssel niemals in einem Chat posten und die Anfrage über den offiziellen Sicherheitskanal verifizieren; ein Schlüssel wird bei Bedarf rotiert, nie im Chat geteilt.",
    [("Den API-Schlüssel im Chat posten, um bei der Überprüfung zu helfen.", 0),
     ("Nur die Hälfte des Schlüssels im Chat posten.", 0)],
    "Ein echtes Sicherheitsteam braucht deinen Schlüssel nie im Klartext im Chat — bei einem echten Verdacht "
    "wird der Schlüssel rotiert, nicht abgefragt.",
    "Ein API-Schlüssel gehört nie in eine Chat-Nachricht.",
    ["source-control", "credential-phishing"]))

CARDS.append(card(43, "K", "Bildschirmfreigabe", "Der Lieferant will dir „die Lösung zeigen“",
    "Bei einem Support-Anruf mit einem Softwarelieferanten schlägt dieser vor, per Bildschirmfreigabe live "
    "mitzuschauen, „um den Fehler direkt zu beheben“ — dabei bittet er, kurz auch das interne Admin-Tool zu öffnen.",
    "Die Bildschirmfreigabe auf den konkreten Fehlerbereich begrenzen und das interne Admin-Tool nicht während der Freigabe öffnen; bei Zweifel den internen IT-Ansprechpartner hinzuziehen.",
    [("Das Admin-Tool wie gewünscht während der Freigabe öffnen und zeigen.", 0),
     ("Das Admin-Tool kurz öffnen, aber ohne sich einzuloggen.", 0)],
    "Ein Software-Support-Fall rechtfertigt nicht automatisch den Blick eines Fremden ins interne "
    "Admin-Tool — Bildschirmfreigaben sollten immer auf das konkrete Problem begrenzt bleiben.",
    "Bildschirmfreigabe zeigt nur das Problem, nie das gesamte Admin-Tool.",
    ["screen-sharing", "remote-access"]))

CARDS.append(card(44, "K", "Deepfake-Video", "Der CFO ist live im Video",
    "In einem Videocall, der wie ein echtes Meeting mit dem Finanzvorstand aussieht, wird live angewiesen, "
    "eine große Überweisung an ein neues Konto vorzunehmen — Bild und Stimme wirken überzeugend echt.",
    "Die Anweisung über einen zweiten, unabhängigen Kanal (Anruf auf bekannter Nummer, persönliches Gespräch) beim Finanzvorstand bestätigen, unabhängig davon, wie echt das Video wirkte.",
    [("Die Überweisung sofort vornehmen, weil das Video überzeugend echt aussah.", 0),
     ("Im Videocall selbst nach zusätzlichen Details fragen und dann überweisen.", 1)],
    "Deepfake-Video-Technologie macht auch Bild und Bewegung täuschend echt — bei ungewöhnlichen "
    "Zahlungsanweisungen ist ein zweiter, unabhängiger Kanal die einzige verlässliche Bestätigung.",
    "Ein überzeugendes Video ersetzt bei einer Großüberweisung nie eine zweite Bestätigung.",
    ["deepfake-video", "voice-clone"]))

CARDS.append(card(45, "K", "Wechselmedien", "Der Konferenz-USB-Stick sagt „Vortragsunterlagen“",
    "Am Stand einer Fachkonferenz wird ein USB-Stick mit „Vortragsunterlagen zum Nachlesen“ verteilt — "
    "zurück im Büro steckt ein Kollege ihn direkt in seinen Arbeitsrechner.",
    "Den Stick nicht in einen Arbeitsrechner stecken und stattdessen bei der IT-Abteilung prüfen lassen oder die Unterlagen über die offizielle Konferenz-Website anfragen.",
    [("Den Stick in den Arbeitsrechner stecken, um die Unterlagen zu lesen.", 0),
     ("Den Stick in einem privaten Rechner testen, bevor er ins Büro kommt.", 1)],
    "Unbekannte USB-Sticks von einer Konferenz sind ein klassischer Weg, Schadsoftware ins Firmennetz "
    "einzuschleusen — die IT-Abteilung kann sie sicher isoliert prüfen.",
    "Ein unbekannter USB-Stick gehört zuerst zur IT, nie direkt in den Arbeitsrechner.",
    ["removable-media", "malware"]))

CARDS.append(card(46, "K", "Cloud-Administration", "Support will ein Wiederherstellungs-Token",
    "Ein Anrufer, angeblich vom Cloud-Anbieter, bittet um das Wiederherstellungs-Token des "
    "Administrator-Kontos, um „einen Ausfall zu beheben“, den es angeblich gerade gibt.",
    "Das Token für niemanden herausgeben und den Ausfall über die offizielle Statusseite des Anbieters oder das interne IT-Team prüfen.",
    [("Das Token durchgeben, um den Ausfall schnell zu beheben.", 0),
     ("Nur einen Teil des Tokens durchgeben.", 0)],
    "Ein Wiederherstellungs-Token für ein Administratorkonto ist der Generalschlüssel — kein echter Support "
    "braucht ihn am Telefon, um einen Ausfall zu beheben.",
    "Ein Wiederherstellungs-Token gibst du nie am Telefon heraus.",
    ["cloud-admin", "credential-phishing"]))

CARDS.append(card(47, "K", "Zugang & Daten", "Facilities: erneuere hier deine Zugangskartendaten",
    "Eine Mail, angeblich von der Haustechnik/Facilities, verlangt, die Zugangskartendaten über ein externes "
    "Formular zu „erneuern“, da sonst die Karte am nächsten Morgen nicht mehr funktioniere.",
    "Das Formular ignorieren und die Zugangskarte direkt beim Empfang oder der internen Facilities-Abteilung persönlich prüfen lassen.",
    [("Die Daten über das externe Formular erneuern.", 0),
     ("Nur einen Teil der Daten über das Formular erneuern.", 0)],
    "Physische Zugangskarten werden persönlich am Empfang oder Werksschutz verwaltet, nie über ein externes "
    "Online-Formular mit Datenabfrage.",
    "Zugangskarten verwaltest du persönlich vor Ort, nie über ein externes Formular.",
    ["access-data", "phishing"]))

CARDS.append(card(48, "K", "Identität", "Security ruft an — lies deinen Code vor",
    "Ein Anrufer, angeblich vom internen Sicherheitsteam, sagt, es gebe einen Vorfall mit deinem Konto, und "
    "bittet dich, den 6-stelligen Code vorzulesen, den du gerade per SMS bekommst, „um den Zugriff zu sperren“.",
    "Auflegen und den Code für niemanden vorlesen; das interne Sicherheitsteam über die bekannte interne Nummer selbst kontaktieren.",
    [("Den Code vorlesen, um den Zugriff sperren zu lassen.", 0),
     ("Nur die ersten drei Ziffern des Codes vorlesen.", 0)],
    "Ein Code, der gerade per SMS ankommt, bestätigt eine Aktion an deinem Konto — ihn vorzulesen gibt dem "
    "Anrufer genau den Zugriff, den er angeblich sperren will.",
    "Ein gerade erhaltener Code wird nie am Telefon vorgelesen — auch nicht an „Security“.",
    ["identity", "otp-phishing"]))

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
        "id": "workplace-de-wild-wrk-w1",
        "lang": "de",
        "title": "Workplace-Blitzrunde: Rote Flaggen",
        "edition": "workplace",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Workplace-Onlinerunde: Jede Person hat 20 Sekunden, um ein Warnsignal aus der letzten "
                    "Workplace-Karte zu nennen, ohne eine andere Person zu wiederholen.",
        "answers": {
            "A": "Die Runde ohne Wiederholung durchspielen.",
            "B": "Passen.",
            "C": "Eine schwache Antwort höflich infrage stellen.",
            "D": "Der Gastgeber verrät die Musterantwort.",
        },
        "scores": {"A": 4, "B": 0, "C": 2, "D": 0},
        "safeActions": ["A", "C"],
        "explanation": "Workplace-Blitzrunde: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine genaue, konkrete sichere Handlung zählt mehr als "
                       "ein vager Ratschlag.",
        "proTip": "Nur direkt nach einer Szenariokarte einsetzen, nie als eigenständiges Minispiel.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["workplace", "online-play"],
        "active": True,
    },
    {
        "id": "workplace-de-wild-wrk-w2",
        "lang": "de",
        "title": "Workplace-Kanalwechsel",
        "edition": "workplace",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Workplace-Onlinerunde: Ersetze den riskanten Kanal aus der letzten Workplace-Karte "
                    "durch den sichersten passenden Prüfkanal.",
        "answers": {
            "A": "Einen konkreten, sichereren Kanal nennen.",
            "B": "Nur „sei vorsichtig“ sagen.",
            "C": "Den ursprünglichen riskanten Kanal wiederholen.",
            "D": "Den Gastgeber bitten, die Karte zu überspringen.",
        },
        "scores": {"A": 4, "B": 1, "C": 1, "D": 0},
        "safeActions": ["A"],
        "explanation": "Workplace-Kanalwechsel: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine gute Antwort nennt den konkreten Kanal.",
        "proTip": "Gute Antworten nennen den genauen Kanal: internes IT-Ticket, bekannte Telefonnummer, "
                  "persönliches Gespräch, offizielles HR-/Rechts-Portal, Compliance-Team.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["workplace", "online-play"],
        "active": True,
    },
]
for c in WILD:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

print(f"Wrote {len(CARDS)} scored cards + {len(WILD)} wild cards to {OUT_DIR}")
print("position distribution:", pos_count)
