# -*- coding: utf-8 -*-
# Generates the German (de) Familie edition draft deck — Stage 4 content,
# NOT wired into any seed/app code yet. Output: data/scenarios-de-draft/family/.
# Culturally adapted (not translated) German scam patterns, approved voice:
# "du", H.A.C.K. kept as a brand term with German trigger glosses
# (H-Hetze, A-Autoritaet, C-Vertrautheit, K-Notbremse).
import json
import os

OUT_DIR = os.path.join("data", "scenarios-de-draft", "family")
os.makedirs(OUT_DIR, exist_ok=True)

TRIGGER_LABEL = {"H": "Hetze", "A": "Autorität", "C": "Vertrautheit", "K": "Notbremse"}


def card(num, hack_key, category, title, scenario, answers, scores, safe, explanation,
         pro_tip, tags, diagnostic=False):
    cid = f"family-de-fam-{num:02d}"
    all_tags = ["family", hack_key.lower()] + tags + (["diagnostic"] if diagnostic else [])
    return {
        "id": cid,
        "lang": "de",
        "title": title,
        "edition": "family",
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
CARDS.append(card(1, "H", "Bankbetrug", "Deine Bank meldet: sofort verschieben",
    "Eine SMS im Namen deiner Sparkasse meldet eine „nicht autorisierte Überweisung über 2.340 €“. "
    "Sekunden später ruft jemand an, kennt deinen Namen und sagt, du müsstest dein Guthaben sofort "
    "per push-TAN auf ein „Sicherheitskonto“ freigeben, bevor die Abbuchung durchläuft.",
    {"A": "Auflegen und die Bank über die Nummer aus der App oder von der Rückseite deiner Karte "
          "anrufen; auf Zuruf am Telefon kein Geld bewegen und keine TAN freigeben.",
     "B": "In der Banking-App zuerst die Karte sperren, dann die Bank über einen bekannten Weg kontaktieren.",
     "C": "Eine push-TAN nur für die eine „Sicherheitsüberweisung“ freigeben und den Rest danach in Ruhe prüfen."},
    {"A": 4, "B": 3, "C": 0}, ["A", "B"],
    "Echte Betrugsabteilungen arbeiten manchmal schnell — aber sie brauchen nie, dass du dein eigenes "
    "Geld überweist oder eine TAN freigibst, damit es „sicher“ ist. Jede TAN bestätigt genau die "
    "Überweisung, die auf deinem Display steht.",
    "Ein „Sicherheitskonto“, das dir jemand am Telefon nennt, ist kein sicheres Konto.",
    ["bank-impostor", "push-tan"], diagnostic=True))

CARDS.append(card(2, "H", "Energieversorger", "In 30 Minuten ist der Strom weg",
    "Ein Anruf sagt, dein Stromkonto sei überfällig und werde in 30 Minuten abgeklemmt. Der Betrag "
    "klingt realistisch. Man bietet an, die Sperre „aufzuhalten“, wenn du sofort per Überweisung oder "
    "Guthabenkarte zahlst.",
    {"A": "Nach Kundennummer und offenem Betrag fragen und beides mit deiner letzten Rechnung "
          "abgleichen, bevor du irgendetwas tust.",
     "B": "Zahlen, wenn der Betrag zu deinem üblichen Monatsabschlag passt, und notfalls später widersprechen.",
     "C": "Auflegen und im Kundenkonto oder über die Nummer auf deiner Rechnung selbst nachsehen."},
    {"A": 3, "B": 0, "C": 4}, ["A", "C"],
    "Zeitdruck plus ein glaubwürdiger Betrag erzeugt falsche Sicherheit. Ein echter Grundversorger "
    "sperrt nicht binnen 30 Minuten und verlangt keine Guthabenkarten. Prüfe die Forderung unabhängig, "
    "bevor du zahlst.",
    "Ein vertrauter Rechnungsbetrag ist kein Beweis für einen echten Anrufer.",
    ["utility", "vishing"], diagnostic=True))

CARDS.append(card(3, "H", "Schulzahlungen", "Der Kita-Ausflug: Zahlung heute Abend",
    "Eine Nachricht der Kita-Leitung im Eltern-Chat sagt, die Zahlung für den morgigen Ausflug müsse "
    "heute Abend bis 20 Uhr per Sofortüberweisung an ein neues Konto gehen, sonst falle der Platz weg. "
    "Der Name der Erzieherin stimmt, das Konto ist neu.",
    {"A": "Sofort überweisen, damit der Platz für dein Kind nicht verloren geht.",
     "B": "In der Elternschaft nachfragen, ob noch jemand die Nachricht bekommen hat.",
     "C": "Die Erzieherin über die bekannte Kita-Nummer oder persönlich anrufen und die neue "
          "Kontoverbindung bestätigen lassen, bevor du zahlst."},
    {"A": 0, "B": 2, "C": 4}, ["C"],
    "Ein gehacktes Chat-Konto sieht aus wie die echte Person, nur die Kontoverbindung ist neu. Eine "
    "kurze Rückfrage über einen zweiten Kanal deckt das sofort auf.",
    "Neue Kontoverbindung, altes Vertrauen — erst anrufen, dann zahlen.",
    ["school", "account-takeover"]))

CARDS.append(card(4, "H", "Paketzustellung", "Dein Paket braucht 1,99 €",
    "Eine SMS im Namen von DHL sagt, dein Paket könne wegen einer offenen Zollgebühr von 1,99 € nicht "
    "zugestellt werden. Der Link führt zu einer Seite, die wie die DHL-App aussieht und nach "
    "Kartennummer und Adresse fragt.",
    {"A": "Die SMS ignorieren und die Sendung direkt in der echten DHL-App oder auf dhl.de mit der "
          "Sendungsnummer verfolgen.",
     "B": "Den Link öffnen, aber nur die Adresse bestätigen, keine Kartendaten eingeben.",
     "C": "Die 1,99 € zahlen — der Betrag ist zu klein, um ein Risiko zu sein."},
    {"A": 4, "B": 1, "C": 0}, ["A"],
    "Zollgebühren werden nicht per SMS-Link mit Kartennummer eingezogen. Der winzige Betrag soll dich "
    "glauben lassen, das Risiko sei vernachlässigbar — genau deshalb klicken so viele.",
    "Ein Paket, das eine Kartennummer will, ist kein Paket.",
    ["delivery", "smishing"]))

CARDS.append(card(5, "H", "Verkehr", "Die Vignette verdoppelt sich morgen",
    "Eine E-Mail warnt, die digitale Autobahnvignette für dein Auto sei „noch nicht aktiviert“ und der "
    "Preis verdopple sich ab morgen. Ein Link führt zu einer täuschend echten Bezahlseite außerhalb "
    "der offiziellen Seite.",
    {"A": "Sofort über den Link bezahlen, um den höheren Preis zu vermeiden.",
     "B": "Die E-Mail löschen und beim nächsten Bedarf direkt über die offizielle Vignetten-Seite oder App kaufen.",
     "C": "Den Link öffnen, aber die Seite erst genau ansehen, bevor du zahlst."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Offizielle Vignetten- und Mautstellen erzeugen keinen künstlichen Preisdruck per E-Mail. Ein Blick "
    "auf eine gut gefälschte Seite reicht oft nicht, um den Unterschied zu erkennen — der sichere Weg "
    "ist, die bekannte Adresse selbst einzutippen.",
    "Kauf direkt bei der Quelle, nie über einen Link aus der Mail.",
    ["driving", "phishing"]))

CARDS.append(card(6, "H", "Steuern", "Die Steuererstattung läuft heute Nacht ab",
    "Eine SMS behauptet, deine Steuererstattung von 412 € verfalle um Mitternacht, wenn du nicht "
    "sofort über einen Link deine Bankdaten bestätigst. Der Absendername zeigt „ELSTER“.",
    {"A": "Abwarten und morgen im ELSTER-Portal nachsehen, ob wirklich etwas offen ist.",
     "B": "Anrufen bei der Nummer aus der SMS, um nachzufragen.",
     "C": "Die Bankdaten sofort über den Link eingeben, um die Frist nicht zu verpassen."},
    {"A": 4, "B": 0, "C": 0}, ["A"],
    "Steuererstattungen verfallen nicht über Nacht, und ELSTER verschickt keine Zahlungslinks per SMS. "
    "Sowohl der Link als auch eine Nummer aus derselben SMS führen zu den Tätern.",
    "Eine Frist, die nur bis Mitternacht gilt, ist gemacht, damit du nicht nachdenkst.",
    ["taxes", "smishing"]))

CARDS.append(card(7, "H", "Technischer Support", "Dein PC hat noch 4 Minuten",
    "Ein lautes Pop-up auf dem Bildschirm deiner Mutter meldet einen Virus und zählt rückwärts: "
    "„Ihr PC wird in 4 Minuten gesperrt.“ Eine Telefonnummer für „Microsoft-Support“ wird angezeigt.",
    {"A": "Die Nummer anrufen, um den Computer noch rechtzeitig retten zu lassen.",
     "B": "Auf der Seite nach einer anderen Kontaktmöglichkeit suchen, die seriöser wirkt.",
     "C": "Den Computer einfach ausschalten und neu starten; ein Countdown auf einer Webseite kann "
          "nichts sperren."},
    {"A": 0, "B": 0, "C": 4}, ["C"],
    "Microsoft ruft niemanden an oder lässt anrufen wegen eines Virus, und eine Webseite kann deinen "
    "Computer nicht wirklich sperren. Ein Neustart beendet die Anzeige.",
    "Ein Countdown im Browser ist Theater, kein technisches Problem.",
    ["tech-support", "pop-up"]))

CARDS.append(card(8, "H", "Tickets", "Heute Abend ausverkauft, sofortige Rückerstattung",
    "In einer Facebook-Gruppe bietet jemand zwei Tickets für das heutige Konzert zum Originalpreis an, "
    "weil er „kurzfristig verhindert“ sei. Er verlangt Zahlung per PayPal „Familie und Freunde“, da "
    "das schneller gehe.",
    {"A": "Sofort per „Familie und Freunde“ zahlen, um die Tickets vor jemand anderem zu sichern.",
     "B": "Zahlung nur über den regulären PayPal-Warenkauf mit Käuferschutz anbieten — oder ganz "
          "ablehnen, wenn der Verkäufer das nicht akzeptiert.",
     "C": "Die Hälfte anzahlen und den Rest bei Übergabe zahlen."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "„Familie und Freunde“ hat keinen Käuferschutz — genau deshalb bestehen Betrüger darauf. Ein "
    "Verkäufer, der das ablehnt, ist ein Warnsignal, kein Grund zur Eile.",
    "Kein Käuferschutz, kein Geld — egal wie knapp die Zeit ist.",
    ["tickets", "payment-app"]))

CARDS.append(card(9, "H", "Versicherung", "Deine Versicherung zahlt heute aus",
    "Ein Anruf im Namen deiner Kfz-Versicherung sagt, die Auszahlung für einen alten Schaden "
    "„schließt heute“, und du müsstest deine IBAN sofort bestätigen, damit das Geld nicht verfällt.",
    {"A": "Die IBAN am Telefon bestätigen, damit die Auszahlung nicht verfällt.",
     "B": "Auflegen und im Kundenportal der Versicherung oder über die bekannte Servicenummer "
          "nachfragen, ob wirklich eine Zahlung offen ist.",
     "C": "Nach dem Namen des Mitarbeiters fragen und dann entscheiden."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Versicherungsauszahlungen haben keine Tagesfrist, die am Telefon verhandelt wird. Die eigene "
    "IBAN bestätigst du nie auf Zuruf.",
    "Eine Auszahlung, die „heute“ verfällt, verfällt nie wirklich.",
    ["insurance", "vishing"]))

CARDS.append(card(10, "H", "Arztrechnungen", "Zahl heute, spar 35 % auf die Arztrechnung",
    "Ein Brief einer unbekannten „Abrechnungsstelle“ bietet 35 % Rabatt auf eine offene Arztrechnung, "
    "wenn du innerhalb von 48 Stunden per Überweisung an ein privates Konto zahlst statt über die Praxis.",
    {"A": "Nur die Hälfte des Rabattbetrags überweisen, um vorsichtig zu bleiben.",
     "B": "Sofort zahlen, um den Rabatt zu sichern.",
     "C": "Bei der Arztpraxis direkt nachfragen, ob diese Abrechnungsstelle bekannt ist und ob "
          "überhaupt eine Rechnung offen ist."},
    {"A": 0, "B": 0, "C": 4}, ["C"],
    "Echte Praxen und Abrechnungsstellen bieten keine Rabatte fürs schnelle Zahlen an ein privates "
    "Konto. Die Praxis selbst kann die Rechnung in einem Anruf bestätigen oder entkräften.",
    "Ein Rabatt fürs schnelle Zahlen ist ein Grund, langsamer zu werden.",
    ["medical-bills", "invoice-fraud"]))

CARDS.append(card(11, "H", "Online-Shopping", "Amazon meldet: 749 € Abbuchung läuft",
    "Eine automatisierte Anrufstimme meldet eine Abbuchung von 749 € für ein Amazon-Prime-Abo und "
    "bittet, „1“ zu drücken, um mit einem Mitarbeiter verbunden zu werden und die Zahlung zu stoppen.",
    {"A": "Auflegen und direkt in der Amazon-App unter „Meine Bestellungen“ und den Zahlungen "
          "nachsehen, ob wirklich etwas abgebucht wurde.",
     "B": "Zurückrufen unter der angezeigten Nummer, um sicherzugehen.",
     "C": "„1“ drücken und dem Mitarbeiter die gewünschten Daten geben, um die Abbuchung zu stoppen."},
    {"A": 4, "B": 0, "C": 0}, ["A"],
    "Amazon ruft nicht mit automatisierten Warnungen über angebliche Abbuchungen an. Die App zeigt "
    "jede echte Zahlung sofort und zuverlässig.",
    "Prüfe in der App, nicht am Telefon, das dich anruft.",
    ["online-shopping", "robocall"]))

CARDS.append(card(12, "H", "Fahrzeuggarantie", "Deine Auto-Garantie läuft heute ab",
    "Ein Anruf sagt, die Herstellergarantie für dein Auto laufe heute ab, und du könntest sie "
    "„ein letztes Mal“ für 399 € per Karte am Telefon verlängern, sonst zahlst du künftig jede "
    "Reparatur selbst.",
    {"A": "Um schriftliche Unterlagen per Post bitten, bevor du zahlst.",
     "B": "Die 399 € am Telefon zahlen, um die Garantie zu sichern.",
     "C": "Auflegen und bei deinem Autohändler oder Hersteller direkt nachfragen, welche Garantie "
          "tatsächlich besteht."},
    {"A": 2, "B": 0, "C": 4}, ["C"],
    "Herstellergarantien laufen nicht plötzlich „heute“ ab und werden nicht per Karte am Telefon "
    "verkauft. Der Händler oder Hersteller kennt den echten Garantiestatus sofort.",
    "Der Hersteller kennt deine Garantie besser als ein Kaltanrufer.",
    ["car-warranty", "cold-call"]))

# ---------------------------------------------------------------- A (13-24)
CARDS.append(card(13, "A", "Amtspersonen", "Falsche Polizei am Telefon",
    "Ein Anrufer gibt sich als Kriminalpolizei aus. In deiner Nachbarschaft sei eingebrochen worden, "
    "auf einer Liste der Täter stehe dein Name — dein Bargeld und dein Schmuck seien zu Hause nicht "
    "mehr sicher. Ein Kollege in Zivil komme vorbei und nehme die Wertsachen „zur Sicherung“ in Verwahrung.",
    {"A": "Nichts übergeben. Auflegen und selbst die 110 wählen oder die örtliche Wache über eine "
          "offizielle Nummer anrufen und den Anruf schildern.",
     "B": "Die Wertsachen übergeben, aber auf einer schriftlichen Quittung mit Dienstausweisnummer bestehen.",
     "C": "Am Telefon bleiben und nach Name und Dienststelle fragen, um die Geschichte zu prüfen."},
    {"A": 4, "B": 0, "C": 1}, ["A"],
    "Die echte Polizei ruft nicht an, um Bargeld oder Schmuck abzuholen, und nennt am Telefon nie die "
    "„110“ als Rückrufnummer. Autorität und eine bedrohliche Geschichte sollen dich davon abhalten, "
    "selbst nachzufragen. Wer auflegt und neu wählt, erreicht die echte Wache.",
    "Kein echter Beamter holt deine Wertsachen zur „Sicherung“ ab.",
    ["government-impostor", "shock-call"], diagnostic=True))

CARDS.append(card(14, "A", "Behörden / Steuer", "E-Mail vom Finanzamt",
    "Eine E-Mail im Design des Bundeszentralamts für Steuern kündigt eine Steuererstattung von "
    "328,50 € an. Du müsstest nur über den Link deine Kontodaten „zur Auszahlung bestätigen“. "
    "Absendername und Logo wirken echt.",
    {"A": "Die Kontodaten über den Link eingeben, weil Absenderadresse und Logo stimmen.",
     "B": "Den Link ignorieren und im ELSTER-Portal oder telefonisch bei deinem Finanzamt nachfragen, "
          "ob wirklich etwas offen ist.",
     "C": "Die E-Mail an einen Bekannten weiterleiten und fragen, ob sie echt aussieht."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Finanzämter kündigen Erstattungen per Post oder über ELSTER an, nie per E-Mail-Link mit "
    "Dateneingabe. Die kleine, plausible Summe soll dich zum schnellen Klick bewegen. Deine "
    "Bankverbindung liegt dem Finanzamt längst vor.",
    "Das Finanzamt schreibt dir — es verlinkt dich nicht auf ein Formular.",
    ["taxes", "phishing"], diagnostic=True))

CARDS.append(card(15, "A", "Bankbetrug", "Anrufer-ID zeigt deine Bank",
    "Dein Handy zeigt beim eingehenden Anruf den echten Namen deiner Sparkasse an. Der Anrufer sagt, "
    "es gebe verdächtige Abbuchungen, und bittet dich, dich mit deiner Banking-PIN in einer "
    "„Sicherheitsleitung“ zu identifizieren.",
    {"A": "Auflegen und die Bank selbst über die Nummer aus der App anrufen — eine angezeigte Nummer "
          "ist kein Beweis.",
     "B": "Die PIN nennen, weil die Anzeige eindeutig die Bank zeigt.",
     "C": "Nach dem Namen des Mitarbeiters fragen und ihn dann zurückrufen lassen."},
    {"A": 4, "B": 0, "C": 1}, ["A"],
    "Die angezeigte Anrufer-ID lässt sich technisch fälschen (Call-ID-Spoofing) und beweist nichts. "
    "Deine PIN gibst du niemals am Telefon weiter, auch nicht an „die Bank“.",
    "Die Anzeige auf dem Display kann lügen, deine PIN nie preisgeben.",
    ["banking", "caller-id-spoofing"]))

CARDS.append(card(16, "A", "Behörden", "Haftbefehl, zahlbar am Kiosk",
    "Ein Anrufer gibt sich als Mitarbeiter der Staatsanwaltschaft aus und sagt, wegen einer "
    "angeblichen Geldwäsche liege ein Haftbefehl vor. Die Sache lasse sich sofort erledigen, wenn du "
    "am nächsten Kiosk oder Zahlungsautomaten einen Betrag über einen Zahlschein-Code begleichst.",
    {"A": "Zum Kiosk gehen und wie beschrieben zahlen, um die Verhaftung abzuwenden.",
     "B": "Auflegen und über die offizielle Nummer der Staatsanwaltschaft oder Polizei nachfragen, ob "
          "es das Verfahren wirklich gibt.",
     "C": "Fragen, ob eine Ratenzahlung möglich ist."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Deutsche Behörden ziehen keine Geldbußen oder Kautionen über Zahlungsautomaten oder Codes ein. "
    "Diese Zahlwege sind für Betrüger attraktiv, weil sie sofort und kaum rückverfolgbar sind.",
    "Kein Amt kassiert am Kiosk.",
    ["government", "payment-kiosk"]))

CARDS.append(card(17, "A", "Schule/Kita", "Die Kita will Gutscheinkarten für die Spendenaktion",
    "Eine E-Mail im Namen der Kita-Leitung bittet dich, für eine „Abschiedsspende“ an eine "
    "ausscheidende Erzieherin Gutscheinkarten im Wert von 50 € zu kaufen und die Codes per E-Mail "
    "zurückzuschicken, da sie „gerade in einer Besprechung“ sei.",
    {"A": "Die Karten kaufen und die Codes wie gewünscht per E-Mail schicken.",
     "B": "Die Anfrage über die bekannte Kita-Nummer oder persönlich bei der Leitung bestätigen "
          "lassen, bevor du etwas kaufst.",
     "C": "Erst im Elternbeirat nachfragen, ob andere die Mail auch bekommen haben."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Die Kombination „dringend, aber gerade nicht erreichbar“ soll verhindern, dass du nachfragst. "
    "Ein Anruf bei der Kita klärt es in einer Minute.",
    "Wer „gerade in einer Besprechung“ ist, kann trotzdem später ans Telefon.",
    ["school", "gift-card"]))

CARDS.append(card(18, "A", "Gesundheit", "Deine Krankenkasse braucht deinen Login",
    "Eine SMS im Namen deiner Krankenkasse verspricht einen Bonus von 60 € für „aktive Mitglieder“, "
    "wenn du dich innerhalb von 24 Stunden über einen Link mit deinen Zugangsdaten zur Kassen-App anmeldest.",
    {"A": "Sich über den Link anmelden, um den Bonus nicht zu verpassen.",
     "B": "Den Link ignorieren und sich nur über die offizielle App oder Webseite der Krankenkasse "
          "einloggen, um nachzusehen.",
     "C": "Den Link öffnen, aber ein anderes Passwort als sonst eingeben."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Ein Bonusprogramm braucht keinen Login über einen SMS-Link — die echte App zeigt dir jeden Bonus "
    "direkt an. Ein „anderes Passwort“ schützt nicht, wenn die Seite gefälscht ist.",
    "Bonus hin oder her — Logins gehen nur über die eigene App.",
    ["healthcare", "credentials"]))

CARDS.append(card(19, "A", "Hauskauf", "Die Notaranweisungen haben sich geändert",
    "Kurz vor der Beurkundung meldet sich eine E-Mail „vom Notariat“: Die Bankverbindung für die "
    "Kaufpreiszahlung habe sich geändert, die neuen Daten seien angehängt. Ton und Signatur wirken "
    "identisch zu bisherigen Mails.",
    {"A": "Die neue Kontoverbindung wie angewiesen für die Überweisung nutzen.",
     "B": "Nur einen kleinen Teilbetrag an das neue Konto schicken, um zu testen, ob es funktioniert.",
     "C": "Das Notariat unter der bekannten, bisher genutzten Telefonnummer anrufen und die Änderung "
          "mündlich bestätigen lassen, bevor irgendetwas überwiesen wird."},
    {"A": 0, "B": 0, "C": 4}, ["C"],
    "E-Mail-Konten von Notariaten werden gezielt kompromittiert, gerade weil hohe Summen fließen. Eine "
    "geänderte Kontoverbindung wird ausschließlich telefonisch über eine unabhängig bekannte Nummer "
    "bestätigt — nie per Antwort auf dieselbe E-Mail.",
    "Bei großen Summen zählt nur ein Anruf auf einer Nummer, die du schon vorher hattest.",
    ["home-buying", "business-email-compromise"]))

CARDS.append(card(20, "A", "Steuern", "Steuerschuld, sonst Vollstreckung",
    "Ein Anruf behauptet, du schuldest dem Finanzamt 1.850 € aus einer alten Veranlagung, und ohne "
    "sofortige Zahlung per Überweisung werde noch heute die Vollstreckung eingeleitet.",
    {"A": "Sofort überweisen, um die Vollstreckung zu vermeiden.",
     "B": "Auflegen und im ELSTER-Portal oder direkt beim zuständigen Finanzamt nachfragen, ob "
          "wirklich eine Forderung besteht.",
     "C": "Um einen schriftlichen Bescheid per Post bitten und dann entscheiden."},
    {"A": 0, "B": 4, "C": 3}, ["B", "C"],
    "Vollstreckungen werden nicht am selben Tag per Telefonanruf angedroht und eingezogen — es gibt "
    "immer einen schriftlichen, förmlichen Weg davor. Das Finanzamt kann jede echte Forderung sofort "
    "bestätigen.",
    "Echte Steuerschulden kommen immer zuerst auf Papier, nie zuerst per Anruf.",
    ["taxes", "vishing"]))

CARDS.append(card(21, "A", "Gerichte", "Ladung: Nichterscheinen kostet",
    "Ein Brief mit Gerichtssiegel-Optik droht ein Bußgeld von 500 €, weil du angeblich eine "
    "Zeugenladung ignoriert hast. Eine beigelegte Nummer soll die Sache „außergerichtlich“ gegen "
    "sofortige Zahlung klären.",
    {"A": "Beim zuständigen Amtsgericht über die im Telefonbuch oder online verifizierte Nummer "
          "nachfragen, ob eine solche Ladung existiert.",
     "B": "Einen Anwalt aus der eigenen Familie um Rat fragen, bevor du reagierst.",
     "C": "Die Nummer aus dem Brief anrufen und die 500 € zahlen, um ein Gerichtsverfahren zu vermeiden."},
    {"A": 4, "B": 2, "C": 0}, ["A"],
    "Gerichte klären Bußgelder nicht „außergerichtlich“ gegen eine Zahlung an eine im Brief genannte "
    "Nummer. Das Amtsgericht selbst kann sofort sagen, ob überhaupt eine Ladung existiert.",
    "Ein Gericht schickt dich nie zu einer Zahlnummer im selben Brief.",
    ["courts", "fake-summons"]))

CARDS.append(card(22, "A", "Rente", "Dein Rentenkonto ist „eingefroren“",
    "Ein Anruf im Namen der Deutschen Rentenversicherung sagt, dein Konto sei wegen eines "
    "„Datenabgleichs“ eingefroren, und deine nächste Rentenzahlung gehe verloren, wenn du nicht "
    "sofort deine Versicherungsnummer und Kontodaten bestätigst.",
    {"A": "Nur die Versicherungsnummer bestätigen, aber keine Kontodaten.",
     "B": "Die Daten am Telefon bestätigen, damit die Zahlung nicht verloren geht.",
     "C": "Auflegen und über die offizielle Servicenummer der Deutschen Rentenversicherung selbst nachfragen."},
    {"A": 1, "B": 0, "C": 4}, ["C"],
    "Die Rentenversicherung „friert“ Konten nicht per Anruf ein und braucht keine telefonische "
    "Bestätigung von Daten, die ihr bereits vorliegen. Ein Rückruf über die bekannte Nummer klärt es "
    "in Minuten.",
    "Eine Behörde, die deine eigenen Daten von dir „bestätigt“ haben will, hat sie meist schon.",
    ["benefits", "vishing"]))

CARDS.append(card(23, "A", "Wohnen", "Die Hausverwaltung hat das Konto gewechselt",
    "Eine E-Mail „von der Hausverwaltung“ informiert alle Mieter, dass die Miete ab sofort auf ein "
    "neues Konto überwiesen werden soll — angeblich wegen eines Bankwechsels. Absenderadresse und "
    "Layout sehen gewohnt aus.",
    {"A": "Ab sofort auf das neue Konto überweisen, wie in der Mail beschrieben.",
     "B": "Die Hausverwaltung über die bekannte Telefonnummer oder persönlich im Büro nach dem "
          "angeblichen Bankwechsel fragen, bevor du die erste Miete auf das neue Konto schickst.",
     "C": "Erst mit den Nachbarn sprechen, ob sie dieselbe Mail bekommen haben."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "E-Mail-Konten von Hausverwaltungen werden ebenso gezielt übernommen wie die von Notariaten. Eine "
    "geänderte Kontoverbindung wird immer telefonisch über eine unabhängig bekannte Nummer bestätigt.",
    "Miete geht nur auf ein Konto, das dir am Telefon bestätigt wurde — nie nur per Mail.",
    ["housing", "business-email-compromise"]))

CARDS.append(card(24, "A", "Mobilfunk", "Der Mobilfunk-Support rettet deine Nummer",
    "Ein Anrufer gibt sich als Support deines Mobilfunkanbieters aus und sagt, deine Nummer solle in "
    "wenigen Minuten „aus Sicherheitsgründen“ zu einem anderen Anbieter portiert werden — außer du "
    "bestätigst sofort den PIN-Code, den du gerade per SMS bekommst, um das zu verhindern.",
    {"A": "Auflegen, die eigene SIM-Karte nicht anfassen und den Anbieter über die offizielle Hotline "
          "oder App kontaktieren.",
     "B": "Den Code notieren, aber erst später weitergeben.",
     "C": "Den PIN-Code sofort am Telefon vorlesen, um die Portierung zu stoppen."},
    {"A": 4, "B": 1, "C": 0}, ["A"],
    "Wer den per SMS gesendeten Code vorliest, bestätigt in Wahrheit selbst eine SIM-Portierung an die "
    "Täter — das Gegenteil von „schützen“. Anbieter-Support fragt nie nach einem SMS-Code, den du "
    "gerade erhalten hast.",
    "Ein Code, der gerade erst ankam, gehört nur dir — auch nicht dem „Support“.",
    ["mobile-service", "sim-swap"]))

# ---------------------------------------------------------------- C (25-36)
CARDS.append(card(25, "C", "Messenger-Betrug", "Hallo Mama, neue Nummer",
    "Eine unbekannte Nummer schreibt dir auf WhatsApp: „Hallo Mama, mein Handy ist kaputt, das ist "
    "meine neue Nummer.“ Kurz darauf: „Kannst du mir schnell eine Rechnung über 980 € überweisen? Ich "
    "komme gerade nicht ans Online-Banking, ich zahl's dir morgen zurück.“ Der Ton klingt wie dein Kind.",
    {"A": "Eine kleine Kontrollfrage stellen, die nur dein Kind beantworten kann, und bei richtiger "
          "Antwort überweisen.",
     "B": "Überweisen, weil die Formulierungen und Emojis genau wie bei deinem Kind klingen.",
     "C": "Über die alte, gespeicherte Nummer anrufen oder eine Sprachnachricht verlangen, bevor du "
          "irgendetwas überweist."},
    {"A": 2, "B": 0, "C": 4}, ["C"],
    "Betrüger übernehmen Tonfall und Familienrolle mühelos — der vertraute Stil ist kein Nachweis. "
    "Eine Kontrollfrage lässt sich oft erraten oder ergoogeln; ein kurzer Anruf auf der bekannten "
    "Nummer klärt in Sekunden, wer da wirklich schreibt.",
    "Neue Nummer, alte Stimme im Kopf — erst hören, dann handeln.",
    ["messaging", "smishing"], diagnostic=True))

CARDS.append(card(26, "C", "Online-Marktplatz", "Sicher bezahlen bei Kleinanzeigen",
    "Du verkaufst einen Kinderwagen auf Kleinanzeigen. Ein Käufer mit jahrelangem Profil und guten "
    "Bewertungen will sofort kaufen und schickt dir einen Link zu „Kleinanzeigen — Sichere "
    "Bezahlung“, wo du zur „Bestätigung des Verkäufers“ deine Bankdaten und eine TAN eingeben sollst.",
    {"A": "Die Bezahlung ausschließlich über die offizielle Funktion in der Kleinanzeigen-App "
          "abwickeln und den externen Link ignorieren.",
     "B": "Nur die Kontonummer eingeben, aber keine TAN.",
     "C": "Über den Link gehen und die Daten eingeben, weil das Profil alt und gut bewertet ist."},
    {"A": 4, "B": 0, "C": 0}, ["A"],
    "Auch alte, gut bewertete Konten werden übernommen oder gekauft. Die echte „Sichere Bezahlung“ "
    "läuft komplett in der App — sie fragt nie über einen externen Link nach TANs. Wer als Verkäufer "
    "eine TAN eingibt, gibt eine Abbuchung frei, keine Gutschrift.",
    "Als Verkäufer gibst du nie eine TAN ein — TANs geben Geld weg, nicht her.",
    ["marketplace", "phishing"], diagnostic=True))

CARDS.append(card(27, "C", "Familiennotfall", "Mama, ich brauch dich, sag's nicht Papa",
    "Eine SMS von einer unbekannten Nummer schreibt: „Mama, ich hab richtig Stress, brauch dringend "
    "Geld, aber bitte sag's Papa nicht, er flippt aus.“ Der Ton trifft genau die Art, wie dein Kind "
    "manchmal schreibt.",
    {"A": "Genau wie gewünscht reagieren und niemandem sonst davon erzählen.",
     "B": "Über die gespeicherte Nummer deines Kindes anrufen oder es persönlich fragen, bevor du "
          "etwas unternimmst — die Bitte um Geheimhaltung ändert daran nichts.",
     "C": "Erst mal fragen, wie viel Geld es genau sein soll."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "„Sag es niemandem“ ist selbst ein Warnsignal — echte Familienmitglieder wollen normalerweise "
    "nicht, dass du allein mit einem Problem bleibst. Ein Anruf auf der bekannten Nummer klärt es sofort.",
    "Eine Bitte um Geheimhaltung ist der Moment, gerade jemanden einzuweihen.",
    ["family-emergency", "smishing"]))

CARDS.append(card(28, "C", "Enkeltrick", "Der Enkel mit dem kaputten Akku",
    "Ein Anruf beginnt mit „Rate mal, wer dran ist“ — eine jüngere männliche Stimme, ähnlich wie dein "
    "Enkel, aber undeutlich, „weil das Handy kaum noch Akku hat“. Er erzählt von einem Unfall mit "
    "einem Mietwagen im Ausland und braucht dringend Geld für die Reparatur.",
    {"A": "Auflegen und den Enkel über die gespeicherte Nummer zurückrufen, um zu prüfen, ob er "
          "wirklich im Ausland ist.",
     "B": "Nach Details zum Unfall fragen, die nur der echte Enkel wissen kann.",
     "C": "Mitspielen und den Namen selbst nennen, um das Gespräch nicht unhöflich abzubrechen."},
    {"A": 4, "B": 2, "C": 0}, ["A"],
    "Der Trick lebt davon, dass DU den Namen zuerst nennst — dann übernimmt der Anrufer ihn. "
    "Kontrollfragen lassen sich oft erraten oder umgehen; ein Rückruf auf der eigenen, gespeicherten "
    "Nummer nicht.",
    "Nenn nie zuerst den Namen — lass den Anrufer sagen, wer er ist.",
    ["grandparent-scam", "vishing"]))

CARDS.append(card(29, "C", "Messenger-Betrug", "Papa hat eine neue Nummer, bitte PayPal",
    "Eine SMS von unbekannter Nummer: „Hey, bin's, altes Handy kaputt. Kannst du mir 250 € per "
    "PayPal an diese Mail-Adresse schicken? Bin gerade unterwegs, erklär's dir später.“ Die Wortwahl "
    "klingt wie dein Vater.",
    {"A": "Das Geld per PayPal schicken, weil die Formulierung genau passt.",
     "B": "Nach etwas fragen, das nur dein Vater wissen kann, und danach entscheiden.",
     "C": "Über die alte, gespeicherte Nummer anrufen oder eine Sprachnachricht verlangen, bevor du "
          "irgendetwas schickst."},
    {"A": 0, "B": 2, "C": 4}, ["C"],
    "Wortwahl und Tonfall lassen sich aus alten Nachrichten oder gehackten Konten leicht kopieren. "
    "Ein kurzer Anruf auf der alten Nummer zeigt sofort, ob die Person überhaupt eine neue Nummer hat.",
    "Neues Handy, alte Bitte um Geld — erst die alte Nummer anrufen.",
    ["messaging", "smishing"]))

CARDS.append(card(30, "C", "Romance-Betrug", "Die Beziehung wird zum Investment-Club",
    "Seit Monaten schreibst du täglich mit jemandem, den du online kennengelernt hast. Er erzählt "
    "jetzt begeistert von einer Krypto-Plattform, auf der er „richtig gutes Geld“ macht, und schickt "
    "dir einen Einladungslink mit Screenshots seiner angeblichen Gewinne.",
    {"A": "Einen kleinen Betrag investieren, um zu sehen, ob es wirklich funktioniert.",
     "B": "Nach den Kontodaten fragen, damit du das Geld direkt an ihn statt an die Plattform schickst.",
     "C": "Die Plattform unabhängig recherchieren (Name plus „Betrug“ suchen, bei der BaFin prüfen) "
          "und mit niemandem, den du nur online kennst, über eine Geldanlage entscheiden."},
    {"A": 0, "B": 0, "C": 4}, ["C"],
    "Screenshots von „Gewinnen“ lassen sich beliebig fälschen, und echte Investment-Plattformen "
    "werben nicht über Liebesbriefe. Eine Suche nach Namen plus „Betrug“ oder eine Prüfung bei der "
    "BaFin zeigt die Masche meist sofort.",
    "Wer dich zuerst verliebt und dann investieren lässt, will dein Geld, nicht dein Herz.",
    ["romance-scam", "crypto"]))

CARDS.append(card(31, "C", "Soziale Medien", "Dein Freund schickt einen „Stimm für mich“-Link",
    "Der Instagram-Account eines Freundes bittet dich, für ihn bei einem Gewinnspiel abzustimmen. "
    "Der Link führt zu einer Login-Seite, und er schreibt dazu: „Bitte schnell, die Abstimmung endet "
    "gleich.“ Der Schreibstil klingt genau wie er.",
    {"A": "Deinen Freund über einen anderen Kanal fragen, ob er wirklich bei diesem Gewinnspiel "
          "mitmacht, und keine Zugangsdaten auf der verlinkten Seite eingeben.",
     "B": "Die Gewinnspiel-Seite unabhängig suchen und selbst nachsehen, ob dein Freund dort wirklich "
          "gelistet ist.",
     "C": "Über die Login-Seite abstimmen, weil der Nachrichtenstil zu deinem Freund passt."},
    {"A": 4, "B": 3, "C": 0}, ["A", "B"],
    "Übernommene Konten erben den echten Schreibstil und die Kontakthistorie ihres Opfers. Eine "
    "Rückfrage über einen zweiten Kanal zeigt, ob dein Freund noch selbst am Drücker ist.",
    "Ein vertrautes Konto kann eine unbekannte Person dahinter haben.",
    ["social-media", "account-takeover"]))

CARDS.append(card(32, "C", "Spenden", "Der Spendenaufruf in der Familien-Chatgruppe",
    "In der Familien-WhatsApp-Gruppe taucht eine Nachricht auf, angeblich von einer Cousine: Eine "
    "Nachbarsfamilie habe einen Hausbrand erlitten, es werde für Spenden über einen Zahlungslink "
    "gesammelt. Mehrere Familienmitglieder haben schon „geliked“.",
    {"A": "Über den Link spenden, weil es aus der eigenen Familiengruppe kommt und andere schon "
          "reagiert haben.",
     "B": "Einen kleinen Betrag spenden, um auf Nummer sicher zu gehen.",
     "C": "Die Cousine direkt persönlich oder telefonisch fragen, ob sie diese Nachricht wirklich "
          "geschickt hat, bevor du über den Link zahlst."},
    {"A": 0, "B": 0, "C": 4}, ["C"],
    "Ein gehacktes Konto in der eigenen Familiengruppe wirkt besonders glaubwürdig, gerade weil andere "
    "schon reagiert haben. Eine echte Person kann die Bitte in einem kurzen Anruf bestätigen.",
    "Auch in der eigenen Familiengruppe gilt: erst fragen, dann zahlen.",
    ["charity", "account-takeover"]))

CARDS.append(card(33, "C", "Pflege", "Die neue Pflegekraft braucht Kontozugang",
    "Die neue ambulante Pflegekraft deiner Mutter ist bisher freundlich und zuverlässig gewesen. Nach "
    "zwei Wochen bittet sie, damit sie „Einkäufe erledigen kann, ohne dich jedes Mal stören zu "
    "müssen“, um die Zugangsdaten zum Online-Banking deiner Mutter.",
    {"A": "Stattdessen eine Vollmacht über einen begrenzten Betrag oder eine Prepaid-Karte für "
          "Einkäufe einrichten, ohne die eigentlichen Bankzugangsdaten weiterzugeben.",
     "B": "Der Pflegekraft eine Liste mit Einkäufen geben und das Geld bar mitgeben.",
     "C": "Die Zugangsdaten geben, weil die Pflegekraft bisher zuverlässig war."},
    {"A": 4, "B": 3, "C": 0}, ["A", "B"],
    "Zuverlässigkeit bisher ist kein Grund, vollen Kontozugang zu teilen — auch gute Absicht kann "
    "später ausgenutzt oder das Konto kompromittiert werden. Eine begrenzte, kontrollierbare Lösung "
    "schützt beide Seiten.",
    "Vertrauen in eine Person heißt nicht, ihr die Bank-PIN zu geben.",
    ["caregiving", "account-access"]))

CARDS.append(card(34, "C", "Reisenotfall", "Deine Cousine sitzt im Ausland fest",
    "Eine Nachricht über Facebook Messenger von deiner Cousine, die gerade in Thailand Urlaub macht, "
    "sagt, ihr sei die Handtasche gestohlen worden und sie brauche sofort 300 € für ein Hotel und den "
    "Rückflug, bis ihre Bank das Problem löst.",
    {"A": "Das Geld über den im Chat genannten Weg schicken, damit sie nicht mittellos dasteht.",
     "B": "In der Familiengruppe fragen, ob jemand schon mit ihr gesprochen hat.",
     "C": "Sie über eine andere, dir bekannte Nummer per Anruf oder Videoanruf erreichen, bevor du "
          "irgendetwas schickst."},
    {"A": 0, "B": 2, "C": 4}, ["C"],
    "Reisenotfälle über einen Chat, der plötzlich nur noch Text erlaubt, sind ein klassisches Zeichen "
    "für ein übernommenes Konto. Ein Videoanruf zeigt sofort, ob wirklich deine Cousine am anderen "
    "Ende ist.",
    "Wer wirklich im Ausland festsitzt, kann fast immer telefonieren oder sich per Video zeigen.",
    ["travel-emergency", "account-takeover"]))

CARDS.append(card(35, "C", "Gemeinschaft", "Der Tierschutzverein kennt deinen Hund",
    "Eine Nachricht eines lokalen Tierschutzvereins, dem du früher gespendet hast, zeigt ein Foto, "
    "das deinem eigenen Hund verblüffend ähnlich sieht, angeblich „heute entlaufen aufgefunden“. Für "
    "die „Rückgabegebühr“ von 80 € solle über einen Link gezahlt werden.",
    {"A": "Sofort selbst nachsehen, ob dein Hund überhaupt zu Hause ist, und den Verein über die "
          "bekannte Nummer anrufen statt über den Link zu zahlen.",
     "B": "Um ein aktuelles Foto mit Zeitstempel bitten, bevor du zahlst.",
     "C": "Sofort über den Link zahlen, um deinen Hund zurückzubekommen."},
    {"A": 4, "B": 2, "C": 0}, ["A"],
    "Öffentlich geteilte Fotos früherer Spenden lassen sich leicht wiederverwenden, um Panik zu "
    "erzeugen. Der erste, einfachste Check — ist der eigene Hund gerade zu Hause — entlarvt die "
    "Masche sofort.",
    "Bevor du zahlst, schau nach, ob das Problem überhaupt existiert.",
    ["community", "fake-charity"]))

CARDS.append(card(36, "C", "Soziale Medien", "Bist du das in diesem Video?",
    "Eine Nachricht von einem Bekannten schickt einen Link mit dem Text „Bist du das in diesem "
    "Video?? 😳“ und einem Vorschaubild, das täuschend echt aussieht. Der Link führt zu einer Seite, "
    "die nach deinem Social-Media-Login fragt, um das Video „anzusehen“.",
    {"A": "Sich einloggen, um zu sehen, worum es geht.",
     "B": "Den Link in einem anderen Browser ohne Login öffnen, um nur zu schauen.",
     "C": "Den Bekannten über einen anderen Kanal fragen, ob er die Nachricht wirklich geschickt hat, "
          "und den Link nicht öffnen."},
    {"A": 0, "B": 1, "C": 4}, ["C"],
    "„Bist du das im Video“ ist eine der ältesten Neugier-Fallen und verbreitet sich über gekaperte "
    "Konten weiter, sobald jemand sich „einloggt“. Neugier ist hier kein guter Ratgeber, eine "
    "Rückfrage schon.",
    "Neugier ist der Köder — eine Rückfrage ist der Haken, den du nicht schluckst.",
    ["social-media", "phishing"]))

# ---------------------------------------------------------------- K (37-48)
CARDS.append(card(37, "K", "Enkeltrick / Übergabe", "Der Bote steht gleich vor der Tür",
    "Am Telefon weint eine Stimme, es klinge wie deine Tochter: Sie habe einen schweren Unfall "
    "verursacht, jemand liege im Krankenhaus. Dann übernimmt ein „Staatsanwalt“: Nur eine Kaution von "
    "15.000 € in bar verhindere die Untersuchungshaft. Ein Gerichtsbote sei schon unterwegs zu deiner "
    "Adresse und hole das Geld in 20 Minuten ab.",
    {"A": "Das Geld zusammensuchen und dem Boten übergeben — die Tochter geht vor, den Rest klärt man später.",
     "B": "Dich nicht am Telefon halten lassen, von einem zweiten Telefon deine Tochter direkt "
          "anrufen — und der Übergabe erst zustimmen, wenn du sie selbst gesprochen hast.",
     "C": "Einen Teilbetrag übergeben und den Rest zusagen, sobald du die Tochter erreicht hast."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Gerichte und Staatsanwaltschaften nehmen keine Kautionen in bar an der Haustür entgegen. Sobald "
    "das Geld beim Boten ist, ist es weg. Der Moment vor der Übergabe ist deine Notbremse — ein "
    "einziger echter Anruf bei deiner Tochter beendet den Betrug.",
    "Bevor Bargeld die Hand verlässt: die echte Person selbst anrufen.",
    ["family-emergency", "cash-pickup"], diagnostic=True))

CARDS.append(card(38, "K", "Fernzugriff / Banking", "Bitte installieren Sie kurz AnyDesk",
    "Nach einer angeblichen Abbuchung meldet sich die „Betrugsabteilung deiner Bank“. Um die Zahlung "
    "zu stoppen, sollst du ein Fernwartungsprogramm (AnyDesk oder TeamViewer) installieren, damit ein "
    "Mitarbeiter „das gesperrte Konto entsperrt“. Anschließend sollst du eine „Testüberweisung“ per "
    "Echtzeitüberweisung bestätigen.",
    {"A": "Installieren und die Testüberweisung bestätigen — der Mitarbeiter braucht das, um die "
          "Sperre aufzuheben.",
     "B": "Das Programm installieren, aber die Testüberweisung erst nach einem Rückruf bei der Bank "
          "bestätigen.",
     "C": "Sofort auflegen, nichts installieren, keine Überweisung bestätigen — und die Bank über die "
          "Nummer auf der Karte anrufen."},
    {"A": 0, "B": 1, "C": 4}, ["C"],
    "Keine Bank lässt sich per Fernwartung auf deinen Rechner. Wer das Programm installiert, gibt "
    "Tastatur und Bildschirm ab; eine bestätigte Echtzeitüberweisung ist in Sekunden weg und nicht "
    "rückholbar. Die „Testüberweisung“ ist die echte Überweisung.",
    "Deine Bank fragt nie nach Fernzugriff — und eine „Testüberweisung“ gibt es nicht.",
    ["remote-access", "banking"], diagnostic=True))

CARDS.append(card(39, "K", "Fernzugriff", "Support will „das Problem sehen“",
    "Nach einem Anruf beim Kundenservice deines Internetanbieters wegen einer langsamen Verbindung "
    "bittet der „Techniker“, per Fernwartungssoftware auf deinen Rechner zuzugreifen, um „das Problem "
    "live zu sehen“ — inklusive eines kurzen Blicks ins Online-Banking, „um zu prüfen, ob die "
    "Verbindung dort auch stabil ist“.",
    {"A": "Die Software installieren, aber das Online-Banking-Fenster vorher schließen.",
     "B": "Die Software installieren und dem Techniker beim Banking-Test zusehen lassen.",
     "C": "Auflegen; ein Internetproblem wird nie durch einen Blick ins Online-Banking gelöst — "
          "nötigenfalls über die offizielle Hotline neu anfragen."},
    {"A": 1, "B": 0, "C": 4}, ["C"],
    "Ein Internetproblem hat nichts mit deinem Bankkonto zu tun — der Wunsch, „kurz reinzuschauen“, "
    "ist der eigentliche Zweck des Anrufs. Fernwartungssoftware gibt vollen Zugriff auf alles, was "
    "gerade offen ist.",
    "Ein Internet-Techniker braucht dein Online-Banking nie zu sehen.",
    ["remote-access", "tech-support"]))

CARDS.append(card(40, "K", "MFA-Phishing", "Lies mir den Code vor, dann ist es storniert",
    "Ein Anruf im Namen eines Streamingdienstes sagt, dein Abo werde morgen um 89 € verlängert; um "
    "das „sofort zu stornieren“, müsse nur der 6-stellige Code bestätigt werden, den du gleich per "
    "SMS bekommst.",
    {"A": "Die App des Streamingdienstes selbst öffnen und das Abo dort kündigen; keinen SMS-Code am "
          "Telefon weitergeben.",
     "B": "Den Code notieren und erst zurückrufen, wenn du sicher bist.",
     "C": "Den Code vorlesen, sobald er ankommt, um die Abbuchung zu stoppen."},
    {"A": 4, "B": 1, "C": 0}, ["A"],
    "Ein per SMS gesendeter Code bestätigt fast immer etwas anderes als eine Stornierung — meist "
    "einen Login oder eine Passwortänderung auf einem echten Konto. Kündigen kannst du jedes Abo "
    "direkt in der App.",
    "Ein Code, den du gerade bekommen hast, liest du niemandem vor — auch nicht zum „Stornieren“.",
    ["mfa", "vishing"]))

CARDS.append(card(41, "K", "Brushing / QR-Codes", "Ein mysteriöses Paket mit QR-Karte",
    "Ein Paket, das du nicht bestellt hast, liegt vor der Tür. Eine beigelegte Karte bittet, per "
    "QR-Code „die Lieferung zu bestätigen“ oder eine „Rücksendung zu veranlassen“, da sonst "
    "automatisch eine Rechnung folge.",
    {"A": "Den QR-Code scannen, um die Rücksendung zu veranlassen und keine Rechnung zu riskieren.",
     "B": "Das Paket ungeöffnet oder ohne den QR-Code zu scannen behalten oder wegwerfen; für "
          "unbestellte Ware entsteht ohnehin keine Zahlungspflicht.",
     "C": "Beim Absender auf dem Paket telefonisch nachfragen."},
    {"A": 0, "B": 4, "C": 2}, ["B"],
    "Für unbestellte Ware besteht in Deutschland gesetzlich keine Zahlungspflicht („Brushing“). Der "
    "QR-Code führt oft zu einer Phishing-Seite oder installiert Schadsoftware — ihn zu scannen ist der "
    "eigentliche Angriff.",
    "Unbestellte Ware bezahlst du nie — und ihren QR-Code scannst du erst recht nicht.",
    ["qr-codes", "brushing"]))

CARDS.append(card(42, "K", "Smart-Geräte", "Der Fernseher will einen Kopplungscode",
    "Beim Einrichten eines neuen Streaming-Kontos auf dem Fernseher erscheint ein Anruf angeblich vom "
    "Streaminganbieter: Man müsse den gerade angezeigten 6-stelligen Kopplungscode am Telefon "
    "durchgeben, um „ein Sicherheitsproblem mit dem Konto zu beheben“.",
    {"A": "Auflegen, den Code für niemanden vorlesen, und das Konto direkt über die offizielle App "
          "oder Webseite prüfen.",
     "B": "Den Fernseher ausschalten und es später erneut versuchen.",
     "C": "Den Code vorlesen, damit das Konto wieder funktioniert."},
    {"A": 4, "B": 2, "C": 0}, ["A"],
    "Ein Kopplungscode auf dem Bildschirm dient dazu, ein Gerät mit einem Konto zu verbinden — wer "
    "ihn vorliest, verknüpft das Konto mit dem Gerät der Täter. Streaminganbieter rufen dafür nie an.",
    "Ein Code auf deinem Bildschirm ist für dein Gerät bestimmt, für niemandes Ohr.",
    ["smart-devices", "account-takeover"]))

CARDS.append(card(43, "K", "Passwörter", "Ein Familienmitglied braucht deinen Reset-Link",
    "Dein Bruder schreibt dir, sein E-Mail-Konto sei gesperrt, und bittet dich, den Link "
    "weiterzuleiten, den du „gleich für ihn“ als Passwort-Reset bekommst, weil eure Konten „aus "
    "Versehen verknüpft“ seien.",
    {"A": "Den Reset-Link weiterleiten, sobald er ankommt, um deinem Bruder zu helfen.",
     "B": "Deinen Bruder über einen anderen Kanal (Anruf, persönlich) erreichen und ihm sagen, dass "
          "Konten sich nicht „aus Versehen verknüpfen“ — einen Reset-Link gibst du nie weiter.",
     "C": "Ihm nur einen Teil des Codes aus dem Link durchgeben."},
    {"A": 0, "B": 4, "C": 0}, ["B"],
    "Konten „verknüpfen“ sich nicht zufällig so, dass dein Reset-Link fremde Konten entsperrt — das "
    "ist eine erfundene Erklärung, damit du einen echten Sicherheitscode weitergibst. Ein Reset-Link "
    "oder -Code ist ausschließlich für dich bestimmt.",
    "Ein Reset-Link, der bei dir ankommt, ist für dein Konto — für kein anderes.",
    ["passwords", "account-takeover"]))

CARDS.append(card(44, "K", "Bankbetrug", "Die „sichere“ Kontoüberweisung",
    "Nachdem ein Anrufer dich von einem „Betrugsversuch“ auf deinem Konto überzeugt hat, sagt er, das "
    "Geld müsse jetzt auf ein „geschütztes Übergangskonto der Bank“ überwiesen werden, während die "
    "Ermittlung läuft. Er bleibt am Telefon und leitet dich Schritt für Schritt durch die Überweisung.",
    {"A": "Auflegen — egal, wie überzeugend das Gespräch bisher war — und die Bank über die Nummer "
          "auf der Karte anrufen, bevor irgendeine Überweisung bestätigt wird.",
     "B": "Nur einen Teilbetrag überweisen, um zu sehen, was passiert.",
     "C": "Die Überweisung wie angeleitet ausführen, weil er dich schon lange am Telefon überzeugt hat."},
    {"A": 4, "B": 0, "C": 0}, ["A"],
    "Der Moment direkt vor dem Bestätigen der Überweisung ist deine letzte und wichtigste Gelegenheit "
    "zum Stopp — egal, wie lange und überzeugend das Gespräch vorher war. Keine Bank hat ein "
    "„Übergangskonto“ für Kunden.",
    "Je länger das Gespräch, desto wichtiger, genau vor der Bestätigung aufzulegen.",
    ["banking", "safe-account"]))

CARDS.append(card(45, "K", "Gutscheinkarten", "Der Code ist die Bezahlung",
    "Ein Anrufer, der sich als Mitarbeiter deines Stromanbieters ausgibt, sagt, eine Nachzahlung von "
    "340 € könne nur noch heute per Guthabenkarten aus dem Supermarkt beglichen werden — du sollst "
    "die Codes von der Rückseite der Karten am Telefon vorlesen.",
    {"A": "Die Karten kaufen und die Codes wie gewünscht vorlesen.",
     "B": "Die Karten kaufen, aber erst beim Stromanbieter direkt nachfragen, bevor du die Codes durchgibst.",
     "C": "Auflegen — kein Energieversorger lässt sich mit Guthabenkarten bezahlen — und die Rechnung "
          "über den bekannten Kundenweg prüfen."},
    {"A": 0, "B": 2, "C": 4}, ["C"],
    "Sobald der Code von der Karte vorgelesen ist, ist das Geld wie Bargeld weg und nicht rückholbar. "
    "Kein Energieversorger, keine Behörde und keine Bank akzeptiert Guthabenkarten als Zahlungsmittel.",
    "Wenn die „Rechnung“ eine Kartennummer zum Vorlesen ist, ist es keine Rechnung.",
    ["gift-cards", "utility"]))

CARDS.append(card(46, "K", "Krypto-ATM", "Der Krypto-Automat mit QR-Code",
    "Ein Anrufer, angeblich von der „Bundespolizei“, sagt, dein Name tauche in einem "
    "Geldwäscheverfahren auf. Um dein Vermögen „unter staatlichen Schutz“ zu stellen, sollst du "
    "Bargeld abheben, zu einem Krypto-Geldautomaten fahren und einen QR-Code einscannen, den er dir "
    "schickt.",
    {"A": "Bargeld abheben und einen Teilbetrag am Automaten einzahlen, während du die Fallnummer prüfst.",
     "B": "Zum Automaten fahren, aber vorher bei der echten Polizei über die 110 nachfragen.",
     "C": "Auflegen, kein Bargeld abheben, keinen QR-Code scannen — und die Polizei über die 110 oder "
          "eine örtliche Wache selbst kontaktieren, um den Anruf zu melden."},
    {"A": 0, "B": 2, "C": 4}, ["C"],
    "Keine Behörde „schützt“ Vermögen, indem sie es über einen von einem Anrufer verschickten QR-Code "
    "in eine Kryptowährung umwandeln lässt. Der QR-Code ist schlicht die Zahlungsadresse der Täter.",
    "Ein QR-Code am Geldautomaten ist eine Adresse für Täter, kein staatlicher Schutz.",
    ["crypto-atm", "government-impostor"]))

CARDS.append(card(47, "K", "Marktplatz", "Der Käufer hat „zu viel“ überwiesen",
    "Du verkaufst ein Sofa online. Der Käufer schickt einen Screenshot einer Überweisung über 200 € "
    "mehr als vereinbart und bittet, die Differenz per Sofortüberweisung zurückzuschicken, bevor er "
    "das Sofa abholen kommt.",
    {"A": "Erst im eigenen Konto prüfen, ob das Geld tatsächlich eingegangen ist, bevor irgendetwas "
          "zurücküberwiesen wird — ein Screenshot ist kein Zahlungseingang.",
     "B": "Die Hälfte der Differenz zurücküberweisen, um entgegenzukommen.",
     "C": "Die Differenz zurücküberweisen, sobald der Screenshot da ist, damit die Abholung klappt."},
    {"A": 4, "B": 0, "C": 0}, ["A"],
    "Ein Screenshot lässt sich beliebig fälschen, oder die ursprüngliche Zahlung wird später "
    "storniert, sobald du die „Rückerstattung“ bereits geschickt hast. Nur der eigene Kontostand ist "
    "ein Beweis für einen echten Zahlungseingang.",
    "Ein Screenshot ist kein Geldeingang — schau in dein eigenes Konto, nicht auf sein Bild.",
    ["marketplace", "overpayment"]))

CARDS.append(card(48, "K", "Zahlungen (Quishing)", "Ein mysteriöser QR-Code am Parkautomaten",
    "Am Parkautomaten klebt ein Aufkleber mit QR-Code und der Aufschrift „Jetzt bequem per App "
    "bezahlen“ — leicht schräg über dem echten Aufkleber des Betreibers angebracht. Der Code führt zu "
    "einer Seite, die nach Kartendaten fragt.",
    {"A": "Über den QR-Code zahlen, weil es bequemer ist als am Automaten selbst.",
     "B": "Den QR-Code ignorieren und direkt am Automaten oder über die offizielle Parkapp der Stadt bezahlen.",
     "C": "Den QR-Code scannen, aber nur schauen, ohne Daten einzugeben."},
    {"A": 0, "B": 4, "C": 1}, ["B"],
    "Aufgeklebte QR-Codes an Parkautomaten sind eine bekannte Betrugsmasche („Quishing“) — sie führen "
    "zu gefälschten Zahlungsseiten. Der Automat selbst oder die offizielle App der Stadt sind immer "
    "der sichere Weg.",
    "Ein Aufkleber mit QR-Code auf einem Automaten ist nie die offizielle Zahlmethode.",
    ["qr-codes", "parking"]))

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

# ---------------------------------------------------------------- Wild cards
WILD = [
    {
        "id": "family-de-wild-fam-w1",
        "lang": "de",
        "title": "Familien-Blitzrunde: Rote Flaggen",
        "edition": "family",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Familien-Onlinerunde: Jede Person hat 20 Sekunden, um ein Warnsignal aus der "
                    "letzten Familien-Karte zu nennen, ohne eine andere Person zu wiederholen.",
        "answers": {
            "A": "Die Runde ohne Wiederholung durchspielen.",
            "B": "Passen.",
            "C": "Eine schwache Antwort höflich infrage stellen.",
            "D": "Der Gastgeber verrät die Musterantwort.",
        },
        "scores": {"A": 4, "B": 0, "C": 2, "D": 0},
        "safeActions": ["A", "C"],
        "explanation": "Familien-Blitzrunde: Ziel ist es, die letzte Szenariokarte in aktives "
                       "Erinnern zu verwandeln statt nur zu lesen. Eine genaue, konkrete sichere "
                       "Handlung zählt mehr als ein vager Ratschlag.",
        "proTip": "Nur direkt nach einer Szenariokarte einsetzen, nie als eigenständiges Minispiel.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["family", "online-play"],
        "active": True,
    },
    {
        "id": "family-de-wild-fam-w2",
        "lang": "de",
        "title": "Familien-Kanalwechsel",
        "edition": "family",
        "cardType": "wild",
        "scored": False,
        "category": "Online-Spiel",
        "scenario": "Familien-Onlinerunde: Ersetze den riskanten Kanal aus der letzten Familien-Karte "
                    "durch den sichersten passenden Prüfkanal.",
        "answers": {
            "A": "Einen konkreten, sichereren Kanal nennen.",
            "B": "Nur „sei vorsichtig“ sagen.",
            "C": "Den ursprünglichen riskanten Kanal wiederholen.",
            "D": "Den Gastgeber bitten, die Karte zu überspringen.",
        },
        "scores": {"A": 4, "B": 1, "C": 1, "D": 0},
        "safeActions": ["A"],
        "explanation": "Familien-Kanalwechsel: Ziel ist es, die letzte Szenariokarte in aktives "
                       "Erinnern zu verwandeln statt nur zu lesen. Eine gute Antwort nennt den "
                       "konkreten Kanal.",
        "proTip": "Gute Antworten nennen den genauen Kanal: App, Bankportal, gespeicherte Nummer, "
                  "offizielle Stelle, Familienmitglied direkt, Anbieter-Hotline.",
        "hackKey": None,
        "hackTrigger": None,
        "tags": ["family", "online-play"],
        "active": True,
    },
]
for c in WILD:
    with open(os.path.join(OUT_DIR, f"{c['id']}.json"), "w", encoding="utf-8") as f:
        json.dump(c, f, ensure_ascii=False, indent=2)
        f.write("\n")

print(f"Wrote {len(CARDS)} scored cards + {len(WILD)} wild cards to {OUT_DIR}")
