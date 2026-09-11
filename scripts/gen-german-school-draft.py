# -*- coding: utf-8 -*-
# Generates the German (de) School edition deck — Stage 4 content.
# Output: data/scenarios-de/school/. Culturally adapted (not translated) for
# German teen/student digital life: Discord, WhatsApp-Klassenchat, IServ/
# Schulcloud, Fortnite/Valorant, TikTok/Instagram, Klassenfahrt, LKA-Cybercrime.
import json
import os

OUT_DIR = os.path.join("data", "scenarios-de", "school")
os.makedirs(OUT_DIR, exist_ok=True)

TRIGGER_LABEL = {"H": "Hetze", "A": "Autorität", "C": "Vertrautheit", "K": "Notbremse"}


def card(num, hack_key, category, title, scenario, answers, scores, safe, explanation,
         pro_tip, tags, diagnostic=False):
    cid = f"school-de-sch-{num:02d}"
    all_tags = ["school", hack_key.lower()] + tags + (["diagnostic"] if diagnostic else [])
    return {
        "id": cid,
        "lang": "de",
        "title": title,
        "edition": "school",
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


CARDS = []

# ---------------------------------------------------------------- H (1-12)
CARDS.append(card(1, "H", "Gaming", "Dein Account wird in 9 Minuten gelöscht",
    "Eine E-Mail im Namen von Epic Games sagt, dein Fortnite-Account werde wegen eines „Verstoßes“ in 9 Minuten "
    "gelöscht — es sei denn, du „verifizierst“ dich jetzt über einen Link mit E-Mail und Passwort.",
    {"A": "Auf den Link klicken und dich sofort verifizieren, bevor der Account gelöscht wird.",
     "B": "Den Link ignorieren und dich direkt in der Fortnite-App oder auf epicgames.com einloggen, um nachzusehen.",
     "C": "Nur die E-Mail-Adresse eingeben, aber nicht das Passwort."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Epic Games löscht Accounts nicht per 9-Minuten-Countdown in einer E-Mail. Ein Login über einen fremden Link "
    "gibt Angreifern genau die Daten, die sie wollen — die App oder die offizielle Seite zeigt den echten Status "
    "sofort.",
    "Ein Countdown in einer Mail ist kein echtes Zeitlimit deines Accounts.",
    ["gaming", "phishing"], diagnostic=True))

CARDS.append(card(2, "H", "Schularbeiten", "Die „Prüfungsfragen“-Liste schließt um Mitternacht",
    "In eurem Klassenchat kursiert ein Link zu angeblich echten Fragen der morgigen Mathe-Klausur — der Zugang "
    "„schließt um Mitternacht“ und kostet 5 € per Handy-Guthaben.",
    {"A": "Zahlen und die Liste noch schnell ansehen, bevor der Zugang schließt.",
     "B": "Den Link nicht öffnen und stattdessen für die Klausur lernen; solche Listen sind fast immer Betrug oder Fake.",
     "C": "Erst eine Freundin fragen, ob die Liste echt aussieht."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Echte Klausurfragen kursieren nicht gegen Bezahlung mit Mitternachtsfrist in einem Klassenchat. Selbst wenn "
    "etwas echt aussieht, ist die Nutzung ein Betrugsrisiko UND ein Schulproblem — der Zeitdruck soll dich davon "
    "abhalten, das zu merken.",
    "Eine Klausur, die man kaufen muss, ist keine Abkürzung — sie ist eine Falle.",
    ["schoolwork", "scam"], diagnostic=True))

CARDS.append(card(3, "H", "Tickets", "Zwei Tickets. Fünf Minuten.",
    "In einer Ticketbörse-Gruppe auf Telegram bietet jemand zwei Konzertkarten zum Originalpreis an — „nur die "
    "nächsten 5 Minuten reserviert“, Zahlung per Überweisung an eine Privatperson.",
    {"A": "Sofort überweisen, um die Tickets nicht zu verpassen.",
     "B": "Nur über eine Plattform mit Käuferschutz zahlen oder persönliche Übergabe gegen Bargeld vorschlagen.",
     "C": "Die Hälfte anzahlen, um Interesse zu zeigen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein enges Zeitfenster bei einer Vorauszahlung an eine unbekannte Person ist die klassische Ticket-Betrugsmasche. "
    "Käuferschutz oder eine persönliche Übergabe schützen dich, ein Countdown tut das nie.",
    "Tickets, die in 5 Minuten weg sind, sind meist gar nicht da.",
    ["tickets", "payment-scam"]))

CARDS.append(card(4, "H", "Schulaccounts", "Dein Passwort „läuft heute ab“",
    "Eine Mail im Design eures Schulportals (IServ) sagt, dein Passwort laufe heute Abend ab und du müsstest es "
    "über einen Link sofort neu setzen, sonst verlierst du den Zugang zu deinen Noten.",
    {"A": "Über den Link ein neues Passwort setzen, um den Zugang nicht zu verlieren.",
     "B": "Die Mail ignorieren und dich wie gewohnt direkt im Schulportal einloggen, um zu prüfen, ob wirklich etwas anliegt.",
     "C": "Den Link öffnen, aber ein Passwort eingeben, das du sonst nirgendwo benutzt."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Schulportale wie IServ setzen keine Mitternachtsfristen für Passwortänderungen per externem Link. Ein direktes "
    "Login über die bekannte Schulseite zeigt sofort, ob überhaupt etwas zu tun ist.",
    "Ein „Passwort läuft ab“-Timer in einer Mail ist fast immer Phishing.",
    ["school-it", "phishing"]))

CARDS.append(card(5, "H", "Soziale Medien", "Urheberrechts-Meldung: 15 Minuten zum Widerspruch",
    "Eine Nachricht meldet einen „Copyright-Strike“ auf deinem Instagram-Account und gibt dir 15 Minuten, über "
    "einen Link Widerspruch einzulegen, sonst werde der Account „endgültig gelöscht“.",
    {"A": "Sofort auf den Link klicken und Widerspruch einlegen, um die Löschung zu verhindern.",
     "B": "Die Nachricht ignorieren und den Account-Status direkt in der Instagram-App unter „Konto-Status“ prüfen.",
     "C": "Den Link öffnen, aber keine Zugangsdaten eingeben."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Instagram löscht Accounts nicht mit einer 15-Minuten-Frist per DM oder E-Mail-Link. Der echte Konto-Status "
    "steht immer direkt in der App.",
    "15 Minuten für einen „endgültigen“ Schritt gibt es bei echten Plattformen nicht.",
    ["social-media", "phishing"]))

CARDS.append(card(6, "H", "Gaming", "Der Skin-Drop endet in 90 Sekunden",
    "Eine Werbeanzeige zeigt einen seltenen Valorant-Skin für 1 € statt 20 € — „Angebot endet in 90 Sekunden“ — "
    "und verlangt dazu deinen Riot-Account-Login auf einer externen Seite.",
    {"A": "Schnell einloggen, um das Angebot nicht zu verpassen.",
     "B": "Den Skin nur im offiziellen Riot-/Valorant-Shop kaufen und die externe Seite ignorieren.",
     "C": "Ein Zweit-Account zum Testen der Seite benutzen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Ein 90-Sekunden-Countdown soll verhindern, dass du merkst: Riot verkauft Skins nie über eine externe "
    "Login-Seite. Wer sich dort einloggt, gibt sein Passwort direkt an Angreifer weiter.",
    "Skins kauft man im Spiel, nie auf einer fremden Login-Seite.",
    ["gaming", "credential-phishing"]))

CARDS.append(card(7, "H", "Wettbewerbe", "Anmeldeschluss in einer Stunde",
    "Eine E-Mail zu einem bundesweiten Schülerwettbewerb sagt, die Anmeldung schließe in einer Stunde und "
    "verlangt eine „Bearbeitungsgebühr“ von 15 € per Guthabenkarte, um den Platz zu sichern.",
    {"A": "Die Gebühr sofort per Guthabenkarte zahlen, um die Anmeldung nicht zu verpassen.",
     "B": "Bei deiner Schule oder Lehrkraft nachfragen, ob der Wettbewerb und die Gebühr echt sind, bevor du zahlst.",
     "C": "Nur die Hälfte der Gebühr zahlen, um vorsichtig zu bleiben."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Seriöse Schülerwettbewerbe verlangen keine Guthabenkarten-Zahlung unter Zeitdruck. Deine Schule oder "
    "Lehrkraft kennt echte Wettbewerbe und kann das in Minuten bestätigen.",
    "Eine Guthabenkarte als „Bearbeitungsgebühr“ ist immer ein Warnsignal.",
    ["competitions", "gift-card"]))

CARDS.append(card(8, "H", "Sneaker & Shopping", "Versandgebühr vor der Mittagspause",
    "Nach einer Sneaker-Bestellung kommt eine SMS: Eine Versandgebühr von 2,50 € müsse vor 12 Uhr per Kartendaten "
    "über einen Link nachgezahlt werden, sonst gehe das Paket zurück.",
    {"A": "Die Kartendaten sofort über den Link eingeben, um das Paket nicht zu verlieren.",
     "B": "Den Bestellstatus direkt beim Shop oder Versanddienst über die offizielle App oder Website prüfen.",
     "C": "Die Gebühr überweisen statt Kartendaten einzugeben."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Eine winzige Nachgebühr mit knapper Frist ist eine klassische Smishing-Masche — der kleine Betrag soll dich "
    "zum schnellen Klick verleiten. Der echte Status steht immer in der Versand-App.",
    "Ein kleiner Betrag mit großer Eile ist trotzdem eine Falle.",
    ["shopping", "smishing"]))

CARDS.append(card(9, "H", "Freunde", "„Schick den Code, bevor mein Vater es sieht“",
    "Ein Freund schreibt dir auf WhatsApp panisch, er brauche sofort deinen gerade erhaltenen SMS-Code für ein "
    "Konto, „bevor mein Vater das Handy sieht“ — es dauere nur eine Minute.",
    {"A": "Den Code sofort schicken, um ihm schnell zu helfen.",
     "B": "Den Code für niemanden weiterschicken und ihn stattdessen anrufen, um zu verstehen, was wirklich los ist.",
     "C": "Nur die Hälfte des Codes schicken."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein Code, der gerade bei dir ankommt, gehört zu deinem eigenen Konto — kein echter Grund macht daraus ein "
    "Konto deines Freundes. Panik und Zeitdruck sollen dich davon abhalten, das zu hinterfragen.",
    "Ein SMS-Code ist immer für dich — auch wenn ein Freund in Eile ist.",
    ["friends", "otp-phishing"]))

CARDS.append(card(10, "H", "Schul-AGs", "Der Spendenlink für die Klassenfahrt „schließt heute Abend“",
    "Eine Nachricht in der Eltern-/Schüler-WhatsApp-Gruppe sagt, der Spendenlink für die Klassenfahrtkasse "
    "schließe heute Abend und bittet um sofortige Überweisung über einen neuen, unbekannten Zahlungsdienst.",
    {"A": "Sofort über den neuen Dienst spenden, damit die Frist nicht verstreicht.",
     "B": "Bei der Klassenlehrkraft oder Elternvertretung nachfragen, ob dieser Link und Zahlungsweg wirklich von der Schule kommt.",
     "C": "Nur einen kleinen Betrag über den Link schicken."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Echte Klassenfahrtkassen nutzen bekannte, angekündigte Zahlungswege, keine plötzlich neuen Links mit "
    "Abendfrist. Eine kurze Rückfrage bei der Lehrkraft klärt es sofort.",
    "Ein neuer Zahlungsweg mit Frist ist verdächtiger als der alte, bekannte.",
    ["school-clubs", "payment-scam"]))

CARDS.append(card(11, "H", "Gaming", "Kostenloses Discord Nitro — Link läuft heute Nacht ab",
    "Eine Nachricht in einem Discord-Server verspricht kostenloses Nitro für ein Jahr, wenn du dich „noch heute "
    "Nacht“ über einen Link mit deinem Discord-Login anmeldest.",
    {"A": "Sich sofort über den Link anmelden, um das kostenlose Nitro zu sichern.",
     "B": "Den Link ignorieren; Discord verschenkt Nitro nicht über Links in Server-Nachrichten mit Fristen.",
     "C": "Den Link öffnen, aber ein anderes Passwort als sonst benutzen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "„Kostenloses Nitro, Login-Link, heute Nacht“ ist eine der verbreitetsten Discord-Phishing-Maschen. Discord "
    "vergibt Geschenke nie so.",
    "Kostenloses Nitro über einen fremden Link gibt es nicht — nur gestohlene Logins.",
    ["gaming", "discord-phishing"]))

CARDS.append(card(12, "H", "Apps & Abos", "Die Testphase deiner Lern-App endet um Mitternacht",
    "Eine Push-Nachricht deiner Lern-App sagt, die kostenlose Testphase ende um Mitternacht und du müsstest "
    "sofort über einen externen Zahlungslink bezahlen, sonst gingen deine Lernfortschritte verloren.",
    {"A": "Sofort über den externen Link zahlen, um die Fortschritte zu retten.",
     "B": "Das Abo direkt in der App oder im App-Store-Konto verwalten statt über einen externen Link zu zahlen.",
     "C": "Screenshots der Fortschritte machen und dann entscheiden."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Lernfortschritte gehen nicht verloren, weil eine Testphase endet, und Abo-Zahlungen laufen über die App "
    "oder den App-Store, nie über einen externen Link in einer Push-Nachricht.",
    "Ein Abo verwaltet man in der App — nie über einen fremden Zahlungslink.",
    ["apps", "subscription-scam"]))

# ---------------------------------------------------------------- A (13-24)
CARDS.append(card(13, "A", "Gaming", "Ein „Discord-Mod“ braucht deine Verifizierung",
    "Jemand mit dem Titel „Moderator“ schreibt dir auf Discord, dein Account sei wegen eines Berichts "
    "„vorübergehend eingeschränkt“ — du müsstest dich über einen Link „verifizieren“, sonst folge ein permanenter Bann.",
    {"A": "Sich sofort über den Link verifizieren, um den Bann zu vermeiden.",
     "B": "Den Link nicht öffnen und den Vorfall über die offiziellen Discord-Support-Kanäle prüfen.",
     "C": "Dem „Mod“ per DM Fragen stellen, um die Geschichte zu prüfen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Echte Discord-Moderatoren schreiben Nutzer nicht per DM an, um sie über einen Link zu „verifizieren“. Der "
    "Titel „Moderator“ ist leicht vorzutäuschen und soll allein durch Autorität wirken.",
    "Ein Titel in einem Profil ist kein Beweis für echte Autorität.",
    ["gaming", "discord-phishing"], diagnostic=True))

CARDS.append(card(14, "A", "Schulpersonal", "Dein Lehrer hat „eine private Datei geteilt“",
    "Eine E-Mail, die aussieht, als käme sie vom Schulaccount deines Lehrers, meldet eine „private Datei zu "
    "deinen Noten“ und bittet um dein Schulportal-Passwort, um sie zu öffnen.",
    {"A": "Das Passwort eingeben, weil die Mail von der Adresse des Lehrers kommt.",
     "B": "Den Lehrer persönlich oder über die Schule direkt fragen, ob er diese Mail wirklich geschickt hat, bevor du irgendetwas eingibst.",
     "C": "Die Mail an eine Mitschülerin weiterleiten und fragen, ob sie dieselbe bekommen hat."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Lehrkräfte brauchen dein Schulportal-Passwort nie, um dir eine Datei zu zeigen — und ein Schulaccount kann "
    "gehackt oder gefälscht sein. Eine kurze persönliche Rückfrage klärt es sofort.",
    "Kein Lehrer braucht dein Passwort, um dir etwas zu zeigen.",
    ["school-staff", "credential-phishing"], diagnostic=True))

CARDS.append(card(15, "A", "Schul-IT", "Die IT-Abteilung braucht deine MFA-Freigabe",
    "Ein Anruf im Namen der Schul-IT sagt, es gebe ein Sicherheitsproblem mit dem Schulnetzwerk, und bittet dich, "
    "den gerade angezeigten Bestätigungscode auf deinem Handy vorzulesen, um „dein Konto zu schützen“.",
    {"A": "Den Code vorlesen, damit das Konto geschützt wird.",
     "B": "Auflegen und den Code für niemanden vorlesen; die Schul-IT über den bekannten Weg kontaktieren, um nachzufragen.",
     "C": "Nur die ersten drei Ziffern des Codes vorlesen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein Bestätigungscode, der gerade auf deinem Gerät erscheint, bestätigt einen Login-Versuch — meist den der "
    "Angreifer, nicht deinen eigenen. Echte IT-Abteilungen fragen nie danach.",
    "Ein MFA-Code ist ein Nein, das du nie am Telefon in ein Ja verwandelst.",
    ["school-it", "mfa-phishing"]))

CARDS.append(card(16, "A", "Gaming", "Der „Spieladmin“ kann deinen Gegenstand wiederherstellen",
    "Nach einem verlorenen seltenen Item schreibt dir jemand mit dem Namen „[Admin] Support“, er könne es "
    "wiederherstellen, wenn du dich kurz über einen Link mit deinem Account einloggst, „damit er den Fehler sieht“.",
    {"A": "Sich über den Link einloggen, damit der Admin den Fehler beheben kann.",
     "B": "Den Link ignorieren und den Vorfall über den offiziellen Support des Spiels melden.",
     "C": "Dem „Admin“ Screenshots des Fehlers schicken, aber nicht einloggen."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Echte Spiele-Admins reparieren Accounts nie, indem sie dich auf eine externe Login-Seite schicken — sie "
    "arbeiten über das offizielle Support-System. Ein „[Admin]“ im Namen ist leicht zu fälschen.",
    "Ein Name mit „Admin“ drin macht aus einem Link kein offizielles Tool.",
    ["gaming", "account-phishing"]))

CARDS.append(card(17, "A", "Soziale Plattformen", "„Verifizierungs-Team“ bietet ein blaues Häkchen an",
    "Eine Nachricht im Namen des „Instagram Verifizierungs-Teams“ bietet dir ein blaues Häkchen an, wenn du "
    "deine Login-Daten zur „Identitätsprüfung“ auf einer verlinkten Seite bestätigst.",
    {"A": "Die Login-Daten auf der verlinkten Seite bestätigen, um das Häkchen zu bekommen.",
     "B": "Die Nachricht ignorieren; eine echte Verifizierung läuft ausschließlich über die Einstellungen in der App selbst.",
     "C": "Nach mehr Informationen über den Prozess fragen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Plattformen verifizieren Accounts nie über einen externen Link mit Login-Eingabe. Das Verlangen ist reine "
    "Autoritäts-Camouflage, um deine Zugangsdaten zu stehlen.",
    "Verifizierung passiert in der App — nie auf einer fremden Seite.",
    ["social-platforms", "credential-phishing"]))

CARDS.append(card(18, "A", "Sicherheit", "„Cyber-Abteilung der Polizei“ schreibt dir",
    "Eine Nachricht, angeblich von der „Cyberkriminalitätsabteilung“ der Polizei, sagt, du seist in einen "
    "Vorfall verwickelt, und verlangt sofort Screenshots deines Chatverlaufs und deine Zugangsdaten „zur Prüfung“.",
    {"A": "Die Zugangsdaten und Screenshots sofort schicken, um zu kooperieren.",
     "B": "Nichts schicken, mit einem Erwachsenen sprechen und die Sache über die offizielle Nummer der örtlichen Polizei prüfen lassen.",
     "C": "Nur die Screenshots schicken, aber keine Zugangsdaten."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Die echte Polizei verlangt niemals Zugangsdaten per Chat-Nachricht — das ist bei jeder Behörde ein "
    "Warnsignal. Ein Erwachsener und die offizielle Nummer klären es sicher.",
    "Zugangsdaten gibt keine echte Behörde per Chat heraus — auch nicht „zur Prüfung“.",
    ["safety", "government-impostor"]))

CARDS.append(card(19, "A", "Esport", "Der Turnierveranstalter braucht deinen Login",
    "Ein Organisator eines Online-Turniers verlangt vor dem Start deinen vollständigen Riot- oder Steam-Login, "
    "„um die Teilnahme zu bestätigen“, statt der üblichen Team-Anmeldung.",
    {"A": "Den Login schicken, um sicher am Turnier teilnehmen zu können.",
     "B": "Ablehnen und stattdessen die übliche Team-/Spieler-ID-Anmeldung nutzen; ein echtes Turnier braucht nie deinen Login.",
     "C": "Ein Zweit-Account für die Anmeldung nutzen."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Turniere bestätigen Teilnahme über Spieler-IDs oder Team-Codes, niemals über volle Kontozugangsdaten. Wer "
    "danach fragt, will den Account übernehmen, nicht die Teilnahme prüfen.",
    "Ein Turnier braucht deine Spieler-ID, nie dein Passwort.",
    ["esports", "credential-phishing"]))

CARDS.append(card(20, "A", "Stipendien", "Du hast ein „Stipendium“ gewonnen",
    "Eine E-Mail gratuliert dir zu einem 500-€-Schülerstipendium, an das du dich nie beworben hast, und bittet um "
    "Kontodaten und eine Ausweiskopie, um die Auszahlung „zu verifizieren“.",
    {"A": "Die Daten schicken, um das Geld nicht zu verpassen.",
     "B": "Die Stiftung unabhängig recherchieren und bei deiner Schule nachfragen, ob sie das Stipendium kennt, bevor du irgendetwas schickst.",
     "C": "Nur die Kontodaten schicken, aber keine Ausweiskopie."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein Gewinn, für den man sich nie beworben hat, ist ein klassisches Warnsignal. Echte Stipendien verlangen "
    "keine Ausweiskopie per E-Mail, um Geld auszuzahlen.",
    "Ein Stipendium, das du nie beantragt hast, hast du auch nicht gewonnen.",
    ["scholarships", "identity-phishing"]))

CARDS.append(card(21, "A", "App-Stores", "„Apple/Google Support“ hat eine Abbuchung gefunden",
    "Eine Nachricht im Namen des App-Store-Supports meldet eine ungewöhnliche Abbuchung auf deinem Konto und "
    "bittet, dich über einen Link anzumelden, um sie „zu stornieren“.",
    {"A": "Sich über den Link anmelden, um die Abbuchung sofort zu stornieren.",
     "B": "Den Link ignorieren und den Kauf- und Abo-Verlauf direkt in den App-Store-Einstellungen prüfen.",
     "C": "Den Link öffnen, aber die Anmeldung abbrechen, sobald nach dem Passwort gefragt wird."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "App-Store-Support kontaktiert dich nicht per Link-Anmeldung wegen einer Abbuchung — der komplette "
    "Kaufverlauf steht immer direkt in den Store-Einstellungen deines Geräts.",
    "Kaufverlauf prüfst du in den Einstellungen, nie über einen Link aus einer Nachricht.",
    ["app-stores", "phishing"]))

CARDS.append(card(22, "A", "Sportvereine", "Der Trainer braucht ein neues Anmeldeformular",
    "Eine E-Mail, angeblich vom Trainer deines Vereins, verlangt, dass deine Eltern ein „neues "
    "Anmeldeformular“ mit Bankdaten für die Vereinsbeiträge über einen Link ausfüllen, sonst dürftest du nicht "
    "mehr mitspielen.",
    {"A": "Die Bankdaten der Eltern sofort über den Link eingeben, damit du weiter mitspielen darfst.",
     "B": "Den Trainer persönlich oder über den Verein direkt fragen, ob dieses Formular wirklich von ihm kommt.",
     "C": "Nur den Namen ausfüllen, aber keine Bankdaten."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Vereinsbeiträge laufen über bekannte, angekündigte Wege — ein plötzlicher neuer Link mit Bankdatenabfrage "
    "und Drohung ist ein klares Warnsignal. Der Trainer kann es in einem Gespräch sofort bestätigen.",
    "Eine Drohung mit Vereinsausschluss soll dich vom Nachfragen abhalten.",
    ["sports-teams", "phishing"]))

CARDS.append(card(23, "A", "Schulleitung", "Die Schulleitung will Gutscheinkarten",
    "Eine E-Mail im Namen der Schulleitung bittet die Klassensprecherin, für ein Abschiedsgeschenk an eine "
    "Lehrkraft Gutscheinkarten zu kaufen und die Codes per Antwort-Mail zu schicken, da die Schulleitung „gerade "
    "in einer Konferenz“ sei.",
    {"A": "Die Karten kaufen und die Codes wie gewünscht per Mail schicken.",
     "B": "Die Anfrage im Sekretariat oder direkt bei der Schulleitung persönlich bestätigen lassen, bevor irgendetwas gekauft wird.",
     "C": "Erst in der Klasse fragen, ob das normal ist."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "„Dringend, aber gerade nicht erreichbar“ ist die Standardformel, um Rückfragen zu verhindern. Das "
    "Sekretariat kann die Anfrage in einer Minute persönlich bestätigen oder entkräften.",
    "Wer „gerade in einer Konferenz“ ist, kann trotzdem später bestätigen.",
    ["school-staff", "gift-card"]))

CARDS.append(card(24, "A", "Schulverwaltung", "Die Schulverwaltung braucht deine Zugangsdaten „zur Migration“",
    "Eine Mail im Design von IServ/Schulcloud kündigt eine „Systemmigration“ an und bittet alle Schüler, ihre "
    "Zugangsdaten über ein verlinktes Formular „zur Sicherung der Daten“ erneut einzugeben.",
    {"A": "Die Zugangsdaten über das Formular erneut eingeben, um die Daten zu sichern.",
     "B": "Das Formular ignorieren und sich wie gewohnt direkt im Schulportal einloggen; eine echte Migration verlangt keine externe Dateneingabe.",
     "C": "Ein neues, unbekanntes Passwort im Formular verwenden."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Eine echte Systemmigration läuft im Hintergrund — sie verlangt nie, dass alle Nutzer ihre Zugangsdaten über "
    "ein externes Formular neu eingeben. Das ist ein klassischer Massen-Phishing-Versuch.",
    "Migrationen passieren ohne dich — Zugangsdaten gibst du dafür nie erneut ein.",
    ["school-it", "mass-phishing"]))

# ---------------------------------------------------------------- C (25-36)
CARDS.append(card(25, "C", "Freunde", "Dein bester Freund braucht einen winzigen Gefallen",
    "Dein bester Freund schreibt dir auf Snapchat: „Kannst du mir kurz deinen Insta-Login geben, meiner ist "
    "gesperrt und ich muss was für die Schule posten, dauert nur 2 Minuten.“",
    {"A": "Den Login schicken, weil es dein bester Freund ist und es schnell gehen soll.",
     "B": "Anbieten, das gewünschte Ding selbst für ihn zu posten, statt den eigenen Login weiterzugeben.",
     "C": "Ihn anrufen, um zu verstehen, warum sein Account gesperrt ist, bevor du irgendetwas gibst."},
    {"A": 0, "B": 4, "C": 3}, ["B", "C"],
    "Ein enges Freundschaftsverhältnis ist kein Grund, Zugangsdaten weiterzugeben — dein Account bleibt deine "
    "Verantwortung, egal wer fragt. Und ein Account kann selbst gekapert worden sein.",
    "Ein guter Freund fragt nie nach deinem Passwort, nur nach Hilfe.",
    ["friends", "account-sharing"], diagnostic=True))

CARDS.append(card(26, "C", "Deepfakes", "Ist das ein Video von dir? Oder nicht?",
    "Ein Klassenkamerad schickt einen Link mit dem Text „Krass, ist das echt du in dem Video??“ und einem "
    "täuschend echten Vorschaubild. Der Link verlangt einen Instagram-Login, um das Video „anzusehen“.",
    {"A": "Sich einloggen, um zu sehen, ob es wirklich um dich geht.",
     "B": "Den Klassenkameraden über einen anderen Kanal fragen, ob er die Nachricht wirklich geschickt hat, und den Link nicht öffnen.",
     "C": "Den Link in einem Inkognito-Fenster ohne Login öffnen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "„Ist das du im Video“ ist eine der ältesten Neugier-Köder-Maschen und verbreitet sich über gekaperte Konten "
    "weiter. Neugier ist hier kein guter Ratgeber — eine Rückfrage schon.",
    "Neugier ist der Köder, eine Rückfrage ist der Haken, den du nicht schluckst.",
    ["deepfakes", "social-engineering"], diagnostic=True))

CARDS.append(card(27, "C", "Gaming-Freunde", "Dein Online-Teammate will sich deinen Login „leihen“",
    "Ein Teammate, mit dem du seit Monaten regelmäßig spielst, bittet, sich kurz in deinen Account einzuloggen, "
    "um „ein seltenes Item für dich abzuholen“, das nur er bekommen kann.",
    {"A": "Den Login teilen, weil ihr schon lange zusammen spielt und er vertrauenswürdig wirkt.",
     "B": "Ablehnen und ihn bitten, das Item direkt an dich zu schicken, statt sich einzuloggen.",
     "C": "Das Passwort für diese eine Aktion kurz ändern und danach wieder zurücksetzen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Lange gemeinsame Spielzeit ist kein Beweis für echte Identität oder Absicht — Accounts werden auch nach "
    "Monaten noch übernommen. Ein Item lässt sich immer direkt schicken, ohne Login-Weitergabe.",
    "Monate zusammen gespielt ersetzen keinen sicheren Übergabeweg.",
    ["gaming-friends", "account-sharing"]))

CARDS.append(card(28, "C", "Bildmissbrauch", "Eine Drohung mit einem privaten Foto",
    "Eine Person, mit der du online geschrieben hast, droht, ein peinliches Foto von dir in eurer Schulgruppe zu "
    "teilen, wenn du nicht sofort Geld per Gutscheinkarte schickst.",
    {"A": "Die Gutscheinkarte sofort schicken, um die Verbreitung zu verhindern.",
     "B": "Nicht zahlen, das Gespräch nicht löschen und dich einem Erwachsenen anvertrauen oder die Nummer 116 111 (Kinder- und Jugendtelefon) anrufen.",
     "C": "Die Person blockieren und hoffen, dass sich das Problem erledigt."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Zahlen beendet solche Drohungen fast nie — es zeigt nur, dass die Drohung funktioniert, und oft folgen "
    "weitere Forderungen. Das ist strafbar, und Hilfe holen ist der richtige, sichere Weg.",
    "Zahlen bestätigt der Person, dass die Drohung wirkt — hol dir stattdessen Hilfe.",
    ["image-abuse", "extortion"]))

CARDS.append(card(29, "C", "Gruppenchats", "Stimm für unsere Klasse ab — ein Login",
    "In eurer Klassen-WhatsApp-Gruppe bittet jemand, für einen Schulwettbewerb über einen Link „mit eurem "
    "Google-Account“ abzustimmen, damit die Klasse gewinnt.",
    {"A": "Über den Link mit dem eigenen Google-Account abstimmen, um der Klasse zu helfen.",
     "B": "Die offizielle Wettbewerbsseite unabhängig suchen und dort abstimmen, ohne dich über den Link einzuloggen.",
     "C": "Fragen, wer den Link ursprünglich geteilt hat."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Eine echte Abstimmung braucht nie deinen vollen Google-Login über einen fremden Link — das ist eine "
    "Login-Phishing-Masche, die sich Gruppendruck zunutze macht.",
    "Abstimmen geht ohne deinen Account-Login — such die echte Seite selbst.",
    ["group-chats", "credential-phishing"]))

CARDS.append(card(30, "C", "Influencer", "Ein Creator will dich im Team haben",
    "Ein bekannter Creator, dem du seit Jahren folgst, schreibt dir persönlich und bietet an, dich „ins Team“ zu "
    "holen — du müsstest dafür nur kurz seinen Zugangsdaten-Check auf einer verlinkten Seite bestätigen.",
    {"A": "Die Zugangsdaten bestätigen, weil es eine große Chance ist, vom Lieblings-Creator entdeckt zu werden.",
     "B": "Die verlinkte Seite ignorieren; echte Kooperationen laufen über offizielle Kanäle, nie über eine Login-Bestätigung.",
     "C": "Antworten und nach mehr Details zum Team fragen, bevor du etwas bestätigst."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Große, bekannte Creator holen niemanden über eine private Login-Bestätigungsseite ins Team — das ist "
    "Autoritäts-Camouflage über einen vertrauten Namen, der Account kann selbst gekapert sein.",
    "Eine große Chance, die einen Login-Check verlangt, ist keine echte Chance.",
    ["influencers", "credential-phishing"]))

CARDS.append(card(31, "C", "Team-Geld", "Dein Teamkollege braucht Gutscheinkarten",
    "Ein Mitspieler aus deinem Gaming-Team, den du seit einer Weile kennst, bittet dich, ihm schnell "
    "Gutscheinkarten für „den Server“ zu kaufen — er zahle es dir „nächste Woche zurück“.",
    {"A": "Die Karten kaufen, weil er ein bekanntes Team-Mitglied ist.",
     "B": "Ablehnen oder ihn bitten, einen anderen, nachvollziehbaren Zahlungsweg zu nutzen, statt Gutscheincodes.",
     "C": "Nur eine kleine Karte kaufen, um zu helfen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Gutscheincodes sind wie Bargeld — sobald sie weg sind, sind sie nicht rückholbar, egal wie bekannt die "
    "Person ist. Ein „zahl's dir zurück“ ändert daran nichts.",
    "Gutscheincodes sind Bargeld ohne Rückgabe — auch unter Teammitgliedern.",
    ["team-money", "gift-card"]))

CARDS.append(card(32, "C", "Accounts", "Kann ich dein Konto für einen Tag benutzen?",
    "Eine Mitschülerin bittet, für einen Tag deinen Netflix- oder Spotify-Account zu benutzen, weil ihr eigenes "
    "„gerade Probleme macht“ — sie brauche nur schnell dein Passwort.",
    {"A": "Das Passwort geben, weil es nur für einen Tag ist.",
     "B": "Ablehnen oder eine Familienfreigabe-Funktion des Dienstes nutzen, statt das eigene Passwort zu teilen.",
     "C": "Das Passwort geben, aber danach sofort ändern."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Ein geteiltes Passwort bleibt nicht „nur für einen Tag“ unter Kontrolle — viele Dienste haben eigene, "
    "sichere Freigabefunktionen, die genau dafür gemacht sind.",
    "„Nur für einen Tag“ ist keine Kontrolle über dein Passwort.",
    ["accounts", "account-sharing"]))

CARDS.append(card(33, "C", "Familie", "Mamas Stimme sagt: Abholzeit hat sich geändert",
    "Ein Anruf auf dem Schulhandy klingt wie deine Mutter: Sie könne dich heute nicht wie geplant abholen, ein "
    "„Freund der Familie“ komme stattdessen und warte am Seiteneingang.",
    {"A": "Zum Seiteneingang gehen und mit der fremden Person mitgehen, weil die Stimme wie Mama klang.",
     "B": "Deine Mutter über die gespeicherte Nummer zurückrufen und mit dem Sekretariat sprechen, bevor du mit irgendjemandem mitgehst.",
     "C": "Die Person am Seiteneingang nach ihrem Namen fragen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "KI-Stimmenklone werden immer überzeugender — eine geklonte Stimme ist kein Beweis. Ein Rückruf auf der "
    "bekannten Nummer und das Sekretariat der Schule klären es in Minuten, bevor du mit jemandem mitgehst.",
    "Bevor du mit jemand Fremdem mitgehst: die echte Person selbst zurückrufen.",
    ["family", "voice-clone"]))

CARDS.append(card(34, "C", "Lerngruppen", "Die geteilten Notizen brauchen „erweiterten Zugriff“",
    "Ein Mitglied deiner Lerngruppe teilt ein Google-Doc mit gemeinsamen Notizen und schreibt, du müsstest "
    "„erweiterten Zugriff“ über einen zusätzlichen Link gewähren, um alles sehen zu können.",
    {"A": "Den zusätzlichen Link öffnen und den erweiterten Zugriff gewähren, um die Notizen vollständig zu sehen.",
     "B": "In der Lerngruppe direkt nachfragen, ob dieser zusätzliche Link wirklich nötig und von jemandem aus der Gruppe kommt.",
     "C": "Nur den ursprünglichen Google-Doc-Link öffnen und den zusätzlichen ignorieren."},
    {"A": 0, "B": 3, "C": 4}, ["B", "C"],
    "Ein normales geteiltes Google-Doc braucht keinen „zusätzlichen Zugriffslink“ — das ist ein typischer Trick, "
    "um dich auf eine Phishing-Seite zu locken. Der ursprüngliche, direkt geteilte Link reicht.",
    "Ein echtes geteiltes Dokument braucht keinen zweiten „Zugriffs“-Link.",
    ["study-groups", "phishing"]))

CARDS.append(card(35, "C", "Messenger", "„Hallo, hier ist deine beste Freundin, neue Nummer“",
    "Eine unbekannte Nummer schreibt im WhatsApp-Klassenchat: „Hey, bin's, neue Nummer, mein altes Handy ist "
    "kaputt — kannst du mir 20 € für den Pausenkiosk schicken? Zahl's dir morgen zurück.“",
    {"A": "Das Geld schicken, weil der Schreibstil genauso klingt wie deine Freundin.",
     "B": "Über die alte, gespeicherte Nummer schreiben oder anrufen, bevor du irgendetwas schickst.",
     "C": "In der Klasse fragen, ob jemand die neue Nummer schon kennt."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Ein vertrauter Schreibstil lässt sich aus alten Nachrichten leicht kopieren, besonders bei einem gekaperten "
    "Konto im Klassenchat. Eine Nachricht an die alte, bekannte Nummer klärt es in Sekunden.",
    "Neue Nummer, alter Schreibstil — erst die alte Nummer fragen.",
    ["messaging", "account-takeover"]))

CARDS.append(card(36, "C", "Gruppenchats", "Alle machen bei der „Enthüllungs“-Umfrage mit",
    "In eurem Klassenchat verbreitet sich eine anonyme Umfrage-App, bei der man peinliche Fragen über "
    "Mitschüler beantworten kann — fast die ganze Klasse hat sich schon mit ihrem Instagram-Login angemeldet.",
    {"A": "Sich auch mit dem eigenen Instagram-Login anmelden, weil alle anderen es schon gemacht haben.",
     "B": "Nicht mitmachen; eine App, die für „anonyme“ Umfragen einen echten Social-Media-Login verlangt, ist ein Warnsignal, egal wie viele mitmachen.",
     "C": "Sich mit einem Fake-Account anmelden, um mitzumachen, ohne den echten Account zu riskieren."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Dass viele andere schon mitgemacht haben, macht eine unsichere App nicht sicherer — es erhöht nur den "
    "Druck, nicht die Sicherheit. Eine echte anonyme Umfrage braucht keinen Social-Media-Login.",
    "Viele Mitmacher sind kein Sicherheitscheck.",
    ["group-chats", "app-phishing"]))

# ---------------------------------------------------------------- K (37-48)
CARDS.append(card(37, "K", "QR-Codes", "Das Plakat verspricht kostenlose Pizza",
    "Ein Plakat am Schuleingang zeigt einen QR-Code: „Scan für kostenlose Pizza — nur heute!“ Der Code führt zu "
    "einer Seite, die nach deinem Namen, deiner Handynummer und einer App-Installation fragt.",
    {"A": "Den Code scannen und die App installieren, um die kostenlose Pizza zu bekommen.",
     "B": "Den Code nicht scannen und bei der Schulleitung fragen, ob das Plakat wirklich von der Schule oder einem bekannten Sponsor stammt.",
     "C": "Den Code scannen, aber die App nicht installieren."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Ein QR-Code an einem unbeaufsichtigten Plakat, der eine App-Installation und persönliche Daten verlangt, "
    "ist eine bekannte Masche („Quishing“) — die App kann Schadsoftware sein. Die Schulleitung kennt echte Aktionen.",
    "Kostenlose Pizza braucht keine App-Installation.",
    ["qr-codes", "quishing"], diagnostic=True))

CARDS.append(card(38, "K", "Account-Wiederherstellung", "Schick mir den Reset-Code",
    "Ein „Support-Mitarbeiter“ in einem Spiele-Chat sagt, er könne dein gesperrtes Konto entsperren, wenn du ihm "
    "den Reset-Code vorliest, den du gerade per SMS bekommst.",
    {"A": "Den Code vorlesen, damit das Konto entsperrt wird.",
     "B": "Den Code für niemanden vorlesen und die Sperrung ausschließlich über den offiziellen Support-Kanal des Spiels klären.",
     "C": "Nur einen Teil des Codes vorlesen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein gerade erhaltener Reset-Code ist für dich allein bestimmt — wer ihn vorliest, entsperrt in Wahrheit das "
    "Konto für die Angreifer, nicht für sich selbst.",
    "Ein Reset-Code, den du gerade bekommen hast, liest du niemandem vor.",
    ["account-recovery", "otp-phishing"], diagnostic=True))

CARDS.append(card(39, "K", "App-Berechtigungen", "Dieser Filter will deine ganze Fotobibliothek",
    "Eine angesagte Foto-Filter-App aus einem TikTok-Trend verlangt beim ersten Öffnen vollen Zugriff auf deine "
    "komplette Fotobibliothek, deine Kontakte und deinen Standort, um „bessere Filter“ anzubieten.",
    {"A": "Alle Berechtigungen erlauben, um den Trend-Filter nutzen zu können.",
     "B": "Nur den Zugriff auf die konkret ausgewählten Fotos erlauben und Kontakte/Standort verweigern; ein Filter braucht das nicht.",
     "C": "Alle Berechtigungen erlauben, sie aber nach der Nutzung wieder entziehen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Ein Fotofilter braucht kein volles Adressbuch und keinen Standort, um ein Bild zu bearbeiten. Übermäßige "
    "Berechtigungen sind oft der eigentliche Zweck solcher Trend-Apps.",
    "Ein Filter fürs Foto braucht nie dein ganzes Adressbuch.",
    ["app-permissions", "data-harvesting"]))

CARDS.append(card(40, "K", "Gaming-Trades", "Der Mittelsmann hat 10.000 Follower",
    "Bei einem Item-Tausch mit einer fremden Person schlägt diese einen „vertrauenswürdigen Mittelsmann“ mit "
    "10.000 Followern vor, der beide Items zuerst entgegennimmt und dann verteilt.",
    {"A": "Dem Mittelsmann beide Items schicken, weil er so viele Follower hat.",
     "B": "Nur über eine offizielle Trade-Funktion des Spiels tauschen, die beide Seiten gleichzeitig schützt — keinen Mittelsmann nutzen.",
     "C": "Nur das eigene, weniger wertvolle Item zuerst an den Mittelsmann schicken."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Viele Follower sind kein Sicherheitsnachweis — sie lassen sich kaufen oder durch Fake-Accounts erzeugen. "
    "Ein Mittelsmann, der Items „zuerst“ entgegennimmt, kann einfach damit verschwinden.",
    "Follower-Zahlen sind kein Treuhandkonto.",
    ["gaming-trades", "middleman-scam"]))

CARDS.append(card(41, "K", "Downloads", "Der „Cheat“ braucht Geräte-Admin-Rechte",
    "Ein herunterladbares „Cheat-Tool“ für dein Lieblingsspiel verlangt bei der Installation "
    "Geräte-Administrator-Rechte, „um die Erkennung zu umgehen“.",
    {"A": "Die Rechte erteilen, damit der Cheat richtig funktioniert.",
     "B": "Die Installation abbrechen und das Tool löschen; ein Programm, das Geräte-Admin-Rechte für ein Spiel verlangt, ist praktisch immer Schadsoftware.",
     "C": "Die Rechte erteilen, aber sie danach in den Einstellungen wieder entziehen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Geräte-Administrator-Rechte geben einer App nahezu vollständige Kontrolle über dein Gerät — kein "
    "Spiel-Cheat braucht das legitim. Das ist praktisch immer Malware.",
    "Kein Cheat braucht die Kontrolle über dein ganzes Gerät.",
    ["downloads", "malware"]))

CARDS.append(card(42, "K", "WLAN", "Das Klassenfahrt-WLAN will deinen Social-Login",
    "Im Hotel-WLAN während der Klassenfahrt musst du dich angeblich über deinen Instagram- oder Google-Login "
    "„anmelden“, statt nur ein einfaches Passwort einzugeben.",
    {"A": "Sich mit dem Social-Login anmelden, um Internet zu haben.",
     "B": "Die Lehrkraft fragen, ob das wirklich das offizielle Hotel-WLAN ist, und keinen Social-Login für ein öffentliches Netzwerk nutzen.",
     "C": "Ein Zweit-Account für die WLAN-Anmeldung nutzen."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Ein legitimes Gäste-WLAN braucht nie deinen echten Social-Media-Login — das ist ein Weg, Zugangsdaten "
    "abzugreifen, getarnt als harmlose Anmeldeseite.",
    "Ein WLAN-Login ist nie ein guter Grund für deinen echten Social-Login.",
    ["wifi", "credential-phishing"]))

CARDS.append(card(43, "K", "Bildschirmfreigabe", "„Support“ will dein Handy sehen",
    "Nach einem Problem mit einer App schlägt ein Chat-„Support“ vor, per Bildschirmfreigabe-App live "
    "mitzusehen, „um das Problem live zu lösen“ — inklusive eines kurzen Blicks in deine Banking-App.",
    {"A": "Die Bildschirmfreigabe erlauben und dem Support beim Banking-Check zusehen lassen.",
     "B": "Die Bildschirmfreigabe ablehnen; ein App-Problem hat nichts mit deiner Banking-App zu tun.",
     "C": "Die Freigabe erlauben, aber die Banking-App vorher schließen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Ein App-Problem braucht nie einen Blick in deine Banking-App — der Wunsch, „live mitzusehen“, ist der "
    "eigentliche Zweck des Anrufs. Bildschirmfreigabe gibt vollen Zugriff auf alles, was gerade offen ist.",
    "Ein App-Support braucht dein Banking nie zu sehen.",
    ["screen-sharing", "remote-access"]))

CARDS.append(card(44, "K", "Krypto & Trends", "Deine Skin kann eine „Investition“ werden",
    "Ein Trend auf TikTok zeigt, wie man seltene Gaming-Skins in eine Krypto-Plattform „investiert“, um sie "
    "angeblich zu vervielfachen — du musst dafür deinen Account mit der Plattform verknüpfen.",
    {"A": "Den Account verknüpfen und mitmachen, weil der Trend viele Klicks hat.",
     "B": "Nicht mitmachen; Skins „vervielfachen“ sich nicht über eine externe Plattform, und eine Verknüpfung gibt Fremden Zugriff auf deinen Account.",
     "C": "Nur einen unwichtigen Skin zum Testen verknüpfen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Viele Klicks bei einem Trend sind kein Sicherheitsbeweis. Eine Kontoverknüpfung mit einer fremden Plattform "
    "gibt Zugriff auf dein gesamtes Konto, nicht nur auf den einen Skin.",
    "Ein virtueller Gegenstand vervielfacht sich nicht durch eine fremde Plattform.",
    ["crypto", "account-takeover"]))

CARDS.append(card(45, "K", "Zahlungen", "Die Rechnung steckt in der DM",
    "Nach einem Gruppenkauf für ein Geschenk bekommst du eine private Nachricht mit einer „Rechnung“ und der "
    "Bitte, deinen Anteil sofort per Sofortüberweisung an ein neues Konto zu schicken.",
    {"A": "Sofort per Sofortüberweisung an das genannte Konto zahlen.",
     "B": "In der Gruppe nachfragen, ob das genannte Konto und der Betrag wirklich stimmen, bevor du zahlst.",
     "C": "Nur die Hälfte des genannten Betrags zahlen."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Eine private Nachricht mit einer „Rechnung“ und einem neuen Konto ist ein einfacher Weg, Zahlungen "
    "abzufangen. Eine kurze Rückfrage in der eigentlichen Gruppe klärt es sofort.",
    "Eine Rechnung per DM ist keine echte Rechnung.",
    ["payments", "invoice-scam"]))

CARDS.append(card(46, "K", "Wallet-Wiederherstellung", "Ein „Support-Bot“ fragt nach deinen Wiederherstellungswörtern",
    "Ein Chatbot auf einer Krypto-Wallet-Seite, die du zum ersten Mal benutzt, bittet dich, deine 12 "
    "Wiederherstellungswörter einzugeben, „um dein Konto zu verbinden“.",
    {"A": "Die Wörter eingeben, um das Konto zu verbinden.",
     "B": "Die Wörter für niemanden und keine Website eingeben; sie sind nur für die Wiederherstellung im eigenen Wallet gedacht.",
     "C": "Nur die ersten sechs Wörter eingeben."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Wiederherstellungswörter sind der Generalschlüssel zu einer Krypto-Wallet — keine echte Seite oder Bot "
    "braucht sie, um „zu verbinden“. Wer sie eingibt, übergibt die vollständige Kontrolle.",
    "Wiederherstellungswörter gehören nirgendwo hin außer in dein eigenes Wallet.",
    ["wallet-recovery", "crypto-phishing"]))

CARDS.append(card(47, "K", "Gaming", "Verifiziere dich menschlich für 10.000 V-Bucks",
    "Eine Werbung verspricht 10.000 V-Bucks kostenlos, wenn du eine „Menschlichkeitsprüfung“ bestehst — dabei "
    "musst du mehrere Apps installieren und persönliche Daten eingeben.",
    {"A": "Die Apps installieren und die Daten eingeben, um die V-Bucks zu bekommen.",
     "B": "Die Werbung ignorieren; V-Bucks bekommt man nur direkt im Spiel oder im offiziellen Epic-Store, nie über App-Installationen.",
     "C": "Nur eine der verlangten Apps installieren."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Eine „Menschlichkeitsprüfung“, die App-Installationen und persönliche Daten verlangt, ist keine echte "
    "Prüfung — sie sammelt Daten oder Provisionen für die Betreiber. Epic verschenkt V-Bucks nie so.",
    "V-Bucks gibt es nur im Spiel — nie über eine „Prüfung“ mit App-Installationen.",
    ["gaming", "app-install-scam"]))

CARDS.append(card(48, "K", "Influencer", "Werde bezahlt fürs Posten — installiere nur unsere Creator-App",
    "Eine angebliche Marketing-Agentur bietet dir Bezahlung fürs Teilen von Beiträgen an — du musst dafür nur "
    "ihre „Creator-App“ außerhalb des offiziellen App-Stores installieren.",
    {"A": "Die App installieren, um mit dem Bezahlt-Posten anzufangen.",
     "B": "Die App nicht außerhalb des offiziellen Stores installieren; eine seriöse Agentur arbeitet über die normalen Plattform-Funktionen.",
     "C": "Die App auf einem alten Zweitgerät installieren, um vorsichtig zu bleiben."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Eine App außerhalb des offiziellen Stores zu installieren, hebelt die Sicherheitsprüfung des Stores komplett "
    "aus. Seriöse Kooperationen brauchen das nie — sie laufen über die Plattform selbst.",
    "Eine App von außerhalb des Stores ist ein Risiko, kein Job-Angebot.",
    ["influencers", "malware"]))

assert len(CARDS) == 48, f"expected 48 scored cards, got {len(CARDS)}"
for key in ("H", "A", "C", "K"):
    n = sum(1 for c in CARDS if c["hackKey"] == key)
    assert n == 12, f"{key}: expected 12, got {n}"
    d = sum(1 for c in CARDS if c["hackKey"] == key and "diagnostic" in c["tags"])
    assert d == 2, f"{key} diagnostic: expected 2, got {d}"

for c in CARDS:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

WILD = [
    {
        "id": "school-de-wild-sch-w1",
        "lang": "de",
        "title": "Schul-Blitzrunde: Rote Flaggen",
        "edition": "school",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Schul-Onlinerunde: Jede Person hat 20 Sekunden, um ein Warnsignal aus der letzten "
                    "Schul-Karte zu nennen, ohne eine andere Person zu wiederholen.",
        "answers": {
            "A": "Die Runde ohne Wiederholung durchspielen.",
            "B": "Passen.",
            "C": "Eine schwache Antwort höflich infrage stellen.",
            "D": "Der Gastgeber verrät die Musterantwort.",
        },
        "scores": {"A": 4, "B": 0, "C": 2, "D": 0},
        "safeActions": ["A", "C"],
        "explanation": "Schul-Blitzrunde: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine genaue, konkrete sichere Handlung zählt mehr als "
                       "ein vager Ratschlag.",
        "proTip": "Nur direkt nach einer Szenariokarte einsetzen, nie als eigenständiges Minispiel.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["school", "online-play"],
        "active": True,
    },
    {
        "id": "school-de-wild-sch-w2",
        "lang": "de",
        "title": "Schul-Kanalwechsel",
        "edition": "school",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Schul-Onlinerunde: Ersetze den riskanten Kanal aus der letzten Schul-Karte durch den "
                    "sichersten passenden Prüfkanal.",
        "answers": {
            "A": "Einen konkreten, sichereren Kanal nennen.",
            "B": "Nur „sei vorsichtig“ sagen.",
            "C": "Den ursprünglichen riskanten Kanal wiederholen.",
            "D": "Den Gastgeber bitten, die Karte zu überspringen.",
        },
        "scores": {"A": 4, "B": 1, "C": 1, "D": 0},
        "safeActions": ["A"],
        "explanation": "Schul-Kanalwechsel: Ziel ist es, die letzte Szenariokarte in aktives Erinnern zu "
                       "verwandeln statt nur zu lesen. Eine gute Antwort nennt den konkreten Kanal.",
        "proTip": "Gute Antworten nennen den genauen Kanal: offizieller Store, App-Einstellungen, "
                  "Schulportal, ein Anruf bei der echten Person, Support-Hotline.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["school", "online-play"],
        "active": True,
    },
]
for c in WILD:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

print(f"Wrote {len(CARDS)} scored cards + {len(WILD)} wild cards to {OUT_DIR}")
