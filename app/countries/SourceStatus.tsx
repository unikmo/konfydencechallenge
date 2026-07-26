"use client";

import { useEffect, useState } from "react";
import styles from "./countries.module.css";

type SourceCheck = {
  live: boolean;
  statusCode: number | null;
};
type SourceStatusResponse = {
  checkedAt: string;
  sources: SourceCheck[];
};

export default function SourceStatus({ country }: { country: string }) {
  const [state, setState] = useState<"checking" | "ready" | "warning">("checking");
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    fetch("/api/countries/" + country + "/sources", {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => (response.ok ? response.json() as Promise<SourceStatusResponse> : null))
      .then((value) => {
        if (!value) {
          setState("warning");
          return;
        }
        setCheckedAt(value.checkedAt);
        setState(value.sources.every((source) => source.live) ? "ready" : "warning");
      })
      .catch(() => setState("warning"))
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [country]);

  if (state === "checking") {
    return <p className={styles.sourceStatus}>Checking official source links...</p>;
  }

  const checkedLabel = checkedAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(checkedAt))
    : null;

  return (
    <p className={styles.sourceStatus}>
      <span className={state === "ready" ? styles.statusDotLive : styles.statusDotWarning} aria-hidden="true" />
      {state === "ready"
        ? "Official source links checked live"
        : "One or more official source links could not be checked just now"}
      {checkedLabel ? " · " + checkedLabel : ""}
    </p>
  );
}
