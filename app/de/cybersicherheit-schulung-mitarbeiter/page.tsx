import type { Metadata } from "next";
import { ComasyIntentPage } from "@/components/ComasyIntentPage";

export const metadata: Metadata = {
  title: { absolute: "Cybersicherheitstraining für Mitarbeitende | CoMaSy" },
  description: "Kurze, realistische Entscheidungsübungen zur Cybersicherheit für Mitarbeitende — ergänzt bestehende Sicherheitsschulungen und misst Überprüfungsverhalten.",
  alternates: {
    canonical: "/de/cybersicherheit-schulung-mitarbeiter",
    languages: { en: "https://konfydence.com/cybersecurity-awareness-training-for-employees", de: "https://konfydence.com/de/cybersicherheit-schulung-mitarbeiter" },
  },
};

export default function Page() {
  return <ComasyIntentPage
    lang="de"
    eyebrow="CYBERSICHERHEIT FÜR MITARBEITENDE"
    title="Cybersicherheit trainieren – für die Entscheidungen im Arbeitsalltag."
    intro="CoMaSy stellt Mitarbeitende vor realistische Entscheidungen zu Zahlungsanweisungen, Chef-Betrug, Lieferantenwechseln, übernommenen Benutzerkonten und anderen Betrugsversuchen unter Zeitdruck. Ziel ist eine verlässliche Routine: Innehalten, unabhängig prüfen, bei Bedarf die zuständige Stelle einschalten."
    problemTitle="Mitarbeitende brauchen Übung genau dort, wo Vertrauen, Druck und Betriebsablauf aufeinandertreffen."
    problemCopy="Einen Betrugsversuch erkennt man nicht immer auf den ersten Blick. Eine Nachricht kann von einem echten Account stammen. Ein Anrufer kann interne Details kennen. Eine Ausnahme im Prozess kann plausibel wirken. Entscheidungstraining übt den Schritt zur unabhängigen Überprüfung, bevor der Druck echt wird."
    sections={[
      { title: "Kurze Übungen", copy: "Kurze, konkrete Übungen statt langer Schulungsmodule." },
      { title: "Übungen für typische Aufgaben", copy: "Priorisiere Szenarien, die zu den tatsächlichen Arbeitsabläufen der Teilnehmergruppe passen — Zahlungen, Lohnbuchhaltung, Lieferantenwechsel oder privilegierte Handlungen." },
      { title: "Direkte Rückmeldung", copy: "Erklärt, warum eine Antwort stärker ist, und verankert das wiederverwendbare Überprüfungsprinzip dahinter." },
    ]}
    proofTitle="Nicht nur Teilnahme zählen. Entscheidungen vergleichen."
    proofCopy="Das Pilotreporting kann definierte Entscheidungssignale vor und nach gezieltem Training anhand deutlich unterschiedlicher Szenarien vergleichen."
    faq={[
      { question: "Wie lange dauert eine CoMaSy-Übung?", answer: "Das Pilotprojekt besteht aus kurzen Übungen. Wie lange eine Runde dauert, hängt von den vereinbarten Situationen ab." },
      { question: "Können Szenarien rollenspezifisch sein?", answer: "Ja. Wir legen vorher fest, welche Arbeitsabläufe und Betrugsmaschen für eure Gruppe wichtig sind." },
      { question: "Werden Mitarbeitende individuell bewertet?", answer: "Welche Daten ausgewertet werden und wer sie sehen darf, wird vor dem Pilotprojekt festgelegt. Eine Auswertung auf Gruppenebene ist möglich." },
      { question: "Ersetzt das Richtlinien oder technische Kontrollen?", answer: "Nein. CoMaSy ergänzt technische Schutzmaßnahmen, interne Richtlinien und die Reaktion auf Sicherheitsvorfälle." },
    ]}
  />;
}
