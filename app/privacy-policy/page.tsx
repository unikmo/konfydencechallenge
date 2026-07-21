import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  // absolute: stops root layout's title template from double-appending " | Konfydence".
  title: { absolute: "Privacy Policy - Konfydence" },
  description: "Konfydence Privacy Policy - How we protect your data",
};

export default function PrivacyPolicyPage() {
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: tokens.bgCanvas,
    color: tokens.textOnDark,
    padding: "60px 20px 40px",
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: 800,
    margin: "0 auto",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 42,
    fontWeight: 900,
    marginBottom: 12,
  };

  const updateStyle: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textMuted,
    marginBottom: 32,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: 32,
  };

  const headingStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 12,
    marginTop: 24,
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.7,
    color: tokens.textMuted,
    marginBottom: 12,
  };

  const listStyle: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.7,
    color: tokens.textMuted,
    marginLeft: 20,
    marginBottom: 12,
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.accentAmber,
    textDecoration: "none",
    borderBottom: `1px solid ${tokens.accentAmber}`,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Privacy Policy</h1>
        <p style={updateStyle}>Last updated: July 18, 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Introduction</h2>
          <p style={paragraphStyle}>
            Konfydence ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you visit our website
            www.konfydence.com and use our services.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Information We Collect</h2>
          <p style={paragraphStyle}>We may collect information about you in a variety of ways:</p>
          <ul style={listStyle}>
            <li>
              <strong>Information you provide directly:</strong> Name, email address, organization name, seat count
              (when submitting contact forms)
            </li>
            <li>
              <strong>Challenge responses:</strong> Your answers to challenge questions and resulting Readiness Score
              (stored to provide results)
            </li>
            <li>
              <strong>Purchase information:</strong> Your email address and order information from Shopify
            </li>
            <li>
              <strong>Device and usage information:</strong> IP address, browser type, pages visited, time spent on
              pages
            </li>
            <li>
              <strong>Cookies and tracking:</strong> We use cookies and similar technologies to track your activity
            </li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. How We Use Your Information</h2>
          <p style={paragraphStyle}>We use the information we collect for purposes including:</p>
          <ul style={listStyle}>
            <li>Providing and improving our challenge games and services</li>
            <li>Processing your purchases through Shopify</li>
            <li>Sending you emails about your account or purchase</li>
            <li>Responding to your inquiries and customer service requests</li>
            <li>Analyzing usage patterns to improve the website</li>
            <li>Complying with legal obligations</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Legal Basis (GDPR)</h2>
          <p style={paragraphStyle}>
            If you are located in the European Union, we process your information based on:
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Consent:</strong> You have given us explicit consent (via cookie banner)
            </li>
            <li>
              <strong>Contract:</strong> Processing is necessary to fulfill a contract with you (purchase)
            </li>
            <li>
              <strong>Legal Obligation:</strong> We need to comply with applicable laws
            </li>
            <li>
              <strong>Legitimate Interests:</strong> We have a legitimate interest in improving our services
            </li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Data Retention</h2>
          <p style={paragraphStyle}>
            We retain your personal information only as long as necessary to provide our services and comply with legal
            obligations:
          </p>
          <ul style={listStyle}>
            <li>Challenge results: Kept until you delete your account or data</li>
            <li>Email contact: Retained for customer service purposes (12 months if no activity)</li>
            <li>Cookies: See our Cookie Policy for retention periods</li>
            <li>Purchase data: Retained for accounting/tax purposes (7 years)</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Sharing Your Information</h2>
          <p style={paragraphStyle}>We do not sell your personal information. We may share information with:</p>
          <ul style={listStyle}>
            <li>
              <strong>Shopify:</strong> For payment processing (subject to Shopify's privacy policy)
            </li>
            <li>
              <strong>Service providers:</strong> Companies that assist us in operating our website or conducting our
              business
            </li>
            <li>
              <strong>Legal requirements:</strong> When required by law or to protect our rights
            </li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Your Privacy Rights</h2>
          <p style={paragraphStyle}>
            <strong>If you are located in the EU (GDPR):</strong> You have the right to:
          </p>
          <ul style={listStyle}>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data (right to be forgotten)</li>
            <li>Restrict processing of your data</li>
            <li>Receive your data in a portable format</li>
            <li>Object to processing</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p style={paragraphStyle}>
            To exercise these rights, contact us at <strong>privacy@konfydence.com</strong>
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Cookies</h2>
          <p style={paragraphStyle}>
            We use cookies to enhance your experience. See our{" "}
            <Link href="/cookie-policy" style={linkStyle}>
              Cookie Policy
            </Link>{" "}
            for detailed information about the cookies we use.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Third-Party Links</h2>
          <p style={paragraphStyle}>
            Our website may contain links to third-party sites. We are not responsible for the privacy practices of
            external websites. Please review their privacy policies before providing personal information.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Security</h2>
          <p style={paragraphStyle}>
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
            internet is 100% secure.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>11. Changes to This Policy</h2>
          <p style={paragraphStyle}>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the
            updated policy on this page with a new "Last updated" date.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>12. Contact Us</h2>
          <p style={paragraphStyle}>
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p style={paragraphStyle}>
            <strong>Email:</strong> privacy@konfydence.com
            <br />
            <strong>Address:</strong> Konfydence Inc., contact form at{" "}
            <Link href="/contact" style={linkStyle}>
              /contact
            </Link>
          </p>
        </div>

        <div style={{ ...paragraphStyle, marginTop: 40, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20 }}>
          <Link href="/" style={linkStyle}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
