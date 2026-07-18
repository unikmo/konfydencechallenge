import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  title: "Cookie Policy - Konfydence",
  description: "Konfydence Cookie Policy - Information about cookies we use",
};

export default function CookiePolicyPage() {
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

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
    fontSize: 13,
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px",
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
    textAlign: "left",
  };

  const thStyle: React.CSSProperties = {
    ...tdStyle,
    fontWeight: 800,
    backgroundColor: "rgba(255,255,255,0.04)",
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.accentAmber,
    textDecoration: "none",
    borderBottom: `1px solid ${tokens.accentAmber}`,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Cookie Policy</h1>
        <p style={updateStyle}>Last updated: July 18, 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. What Are Cookies?</h2>
          <p style={paragraphStyle}>
            Cookies are small text files stored on your device when you visit our website. They help us remember your
            preferences and understand how you use our site. Cookies can be persistent (stored until deleted) or
            session-based (deleted when you close your browser).
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Types of Cookies We Use</h2>

          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>
            Essential Cookies (Always Active)
          </h3>
          <p style={paragraphStyle}>
            These cookies are necessary for the website to function properly. They enable basic features like:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>User authentication (login sessions)</li>
            <li style={paragraphStyle}>Security (CSRF protection)</li>
            <li style={paragraphStyle}>Cookie consent preferences</li>
            <li style={paragraphStyle}>kf_uid (unique visitor identifier for Shopify integration)</li>
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>
            Analytical Cookies (Requires Consent)
          </h3>
          <p style={paragraphStyle}>
            These cookies help us understand how you use our website. They collect information about:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>Pages you visit</li>
            <li style={paragraphStyle}>Time spent on each page</li>
            <li style={paragraphStyle}>Clicks and interactions</li>
            <li style={paragraphStyle}>Device type and browser</li>
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 800, marginTop: 16, marginBottom: 8 }}>
            Marketing Cookies (Requires Consent)
          </h3>
          <p style={paragraphStyle}>
            These cookies track your behavior across websites to display targeted ads. You can opt-out via our cookie
            banner.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. Cookies Placed on Our Site</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Cookie Name</th>
                <th style={thStyle}>Purpose</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>
                  <strong>kf_uid</strong>
                </td>
                <td style={tdStyle}>User identifier for Shopify integration</td>
                <td style={tdStyle}>1 year</td>
                <td style={tdStyle}>Essential</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <strong>cookie-consent</strong>
                </td>
                <td style={tdStyle}>Remembers your cookie preferences</td>
                <td style={tdStyle}>1 year</td>
                <td style={tdStyle}>Essential</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <strong>analytics-consent</strong>
                </td>
                <td style={tdStyle}>Tracks if analytics are enabled</td>
                <td style={tdStyle}>1 year</td>
                <td style={tdStyle}>Essential</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <strong>_ga</strong>
                </td>
                <td style={tdStyle}>Google Analytics (if enabled)</td>
                <td style={tdStyle}>2 years</td>
                <td style={tdStyle}>Analytical</td>
              </tr>
              <tr>
                <td style={tdStyle}>
                  <strong>_gid</strong>
                </td>
                <td style={tdStyle}>Google Analytics session ID</td>
                <td style={tdStyle}>24 hours</td>
                <td style={tdStyle}>Analytical</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Third-Party Cookies</h2>
          <p style={paragraphStyle}>
            Our website may contain cookies from third parties including:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>
              <strong>Shopify:</strong> For payment processing and order management
            </li>
            <li style={paragraphStyle}>
              <strong>Google Analytics:</strong> For website traffic analysis (only if you consent)
            </li>
          </ul>
          <p style={paragraphStyle}>
            These third parties have their own privacy policies. We are not responsible for their use of cookies.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Your Cookie Choices</h2>
          <p style={paragraphStyle}>
            <strong>Cookie Consent Banner:</strong> When you first visit our site, a banner appears asking for your
            consent. You can:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>
              <strong>Accept All:</strong> Enable all cookies (essential, analytical, marketing)
            </li>
            <li style={paragraphStyle}>
              <strong>Reject All:</strong> Only essential cookies are used
            </li>
          </ul>

          <p style={paragraphStyle}>
            <strong>Browser Settings:</strong> You can also control cookies through your browser:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>
              Chrome: Settings → Privacy and security → Cookies and other site data
            </li>
            <li style={paragraphStyle}>
              Firefox: Preferences → Privacy & Security → Cookies and Site Data
            </li>
            <li style={paragraphStyle}>
              Safari: Preferences → Privacy → Cookies and website data
            </li>
            <li style={paragraphStyle}>
              Edge: Settings → Privacy, search, and services → Clear browsing data
            </li>
          </ul>

          <p style={paragraphStyle}>
            <strong>Note:</strong> Disabling cookies may affect website functionality.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Do Not Track (DNT)</h2>
          <p style={paragraphStyle}>
            Some browsers include a "Do Not Track" feature. Currently, there is no industry standard for recognizing DNT
            signals. We honor cookie consent choices regardless of DNT settings.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. GDPR Compliance</h2>
          <p style={paragraphStyle}>
            If you are in the European Union, we comply with GDPR requirements:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>We obtain explicit consent before setting non-essential cookies</li>
            <li style={paragraphStyle}>Our cookie banner allows you to accept or reject all cookies</li>
            <li style={paragraphStyle}>You can change your preferences at any time</li>
            <li style={paragraphStyle}>We provide clear information about each cookie's purpose</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Changes to This Policy</h2>
          <p style={paragraphStyle}>
            We may update this Cookie Policy to reflect changes in our practices or for other operational, legal, or
            regulatory reasons. The "Last updated" date above will reflect when changes were made.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Contact Us</h2>
          <p style={paragraphStyle}>
            If you have questions about our cookie practices, please contact us at:{" "}
            <strong>privacy@konfydence.com</strong>
          </p>
        </div>

        <div style={{ ...paragraphStyle, marginTop: 40, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20 }}>
          <Link href="/privacy-policy" style={linkStyle}>
            Privacy Policy
          </Link>
          <span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span>
          <Link href="/" style={linkStyle}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
