"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}

function ContactForm() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "general";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    seatCount: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const isSchoolsTeams = topic === "schools-teams";
  const isTravelCheckIn = topic === "travel-check-in";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          topic,
          consent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit form");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", organization: "", seatCount: "", message: "" });
      setConsent(false);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    padding: "60px 20px",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  };

  const shellStyle: React.CSSProperties = {
    maxWidth: 600,
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: 40,
    textAlign: "center",
  };

  const logoStyle: React.CSSProperties = {
    height: 40,
    width: "auto",
    marginBottom: 24,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(28px, 5vw, 42px)",
    fontWeight: 900,
    margin: "0 0 12px",
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 16,
    color: tokens.textMuted,
    margin: 0,
    lineHeight: 1.6,
  };

  const successStyle: React.CSSProperties = {
    padding: 24,
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
    borderRadius: 12,
    marginBottom: 24,
  };

  const successTitleStyle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 800,
    color: "#22c55e",
    margin: "0 0 8px",
  };

  const successTextStyle: React.CSSProperties = {
    fontSize: 14,
    color: tokens.textMuted,
    margin: 0,
    lineHeight: 1.6,
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  };

  const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 800,
    margin: 0,
  };

  const inputStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    background: "rgba(255, 255, 255, 0.04)",
    color: tokens.textOnDark,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 120,
    resize: "vertical",
  };

  const submitStyle: React.CSSProperties = {
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 900,
    border: "none",
    background: tokens.accentAmber,
    color: tokens.textOnLight,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    transition: "opacity 0.15s",
  };

  const errorStyle: React.CSSProperties = {
    padding: 12,
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: 8,
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 16,
  };

  const backLinkStyle: React.CSSProperties = {
    display: "inline-block",
    marginTop: 32,
    padding: "8px 12px",
    color: tokens.accentAmber,
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 800,
    borderBottom: `2px solid ${tokens.accentAmber}`,
  };

  return (
    <div style={containerStyle}>
      <div style={shellStyle}>
        <div style={headerStyle}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/LOGO-05.png" alt="Konfydence" style={logoStyle} />
          <h1 style={titleStyle}>
            {isTravelCheckIn ? "Travel Check-In interest list" : isSchoolsTeams ? "Bring Konfydence to Your School or Organization" : "Get in Touch"}
          </h1>
          <p style={subtitleStyle}>
            {isSchoolsTeams
              ? "Tell us about your institution and we'll discuss how to bring scam-readiness training to your students and staff."
              : "We'd love to hear from you. Send us a message."}
          </p>
        </div>

        {submitted ? (
          <>
            <div style={successStyle}>
              <h2 style={successTitleStyle}>âœ“ Message received</h2>
              <p style={successTextStyle}>
                Thank you for reaching out! We'll review your message and get back to you within 1-2 business days.
              </p>
            </div>
            <Link href="/" style={backLinkStyle}>
              â† Back to home
            </Link>
          </>
        ) : (
          <>
            {error && <div style={errorStyle}>{error}</div>}

            <form style={formStyle} onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="organization">
                  {isTravelCheckIn ? "Travel context (optional)" : "Organization"}
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder={isSchoolsTeams ? "School or company name" : "Organization name"}
                  required
                  style={inputStyle}
                />
              </div>

              {isSchoolsTeams && (
                <div style={formGroupStyle}>
                  <label style={labelStyle} htmlFor="seatCount">
                    Number of students/employees
                  </label>
                  <input
                    type="number"
                    id="seatCount"
                    name="seatCount"
                    value={formData.seatCount}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    style={inputStyle}
                  />
                </div>
              )}

              <div style={formGroupStyle}>
                <label style={labelStyle} htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    isSchoolsTeams
                      ? "Tell us about your school/organization and what you're looking for..."
                      : "Your message..."
                  }
                  required
                  style={textareaStyle}
                />
              </div>

              <button type="submit" style={submitStyle} disabled={loading}>
                {loading ? "Sending..." : "Send message"}
              </button>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, color: tokens.textMuted, fontSize: 13, lineHeight: 1.45 }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  required
                  style={{ marginTop: 3, accentColor: tokens.accentAmber }}
                />
                <span>
                  I agree to be contacted about this enquiry and have read the{" "}
                  <Link href="/privacy-policy" style={{ color: tokens.accentAmber }}>Privacy Policy</Link>.
                </span>
              </label>            </form>

            <Link href="/" style={backLinkStyle}>
              â† Back to home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
