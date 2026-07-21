import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  // absolute: stops root layout's title template from double-appending " | Konfydence".
  title: { absolute: "Terms of Service - Konfydence" },
  description: "Konfydence Terms of Service",
};

export default function TermsOfServicePage() {
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

  const linkStyle: React.CSSProperties = {
    color: tokens.accentAmber,
    textDecoration: "none",
    borderBottom: `1px solid ${tokens.accentAmber}`,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Terms of Service</h1>
        <p style={updateStyle}>Last updated: July 18, 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Agreement to Terms</h2>
          <p style={paragraphStyle}>
            By accessing and using the Konfydence website and services, you accept and agree to be bound by and comply
            with these Terms of Service. If you do not agree to abide by these terms, please do not use this service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Use License</h2>
          <p style={paragraphStyle}>
            Konfydence grants you a limited, non-exclusive, revocable license to access and use our website and
            challenge games for personal, educational purposes only. This license does not include:
          </p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>Selling or modifying content</li>
            <li style={paragraphStyle}>Using content for commercial purposes</li>
            <li style={paragraphStyle}>Transferring content to another person or "mirroring" on another server</li>
            <li style={paragraphStyle}>Removing copyright, trademark, or other proprietary notices</li>
            <li style={paragraphStyle}>Accessing or searching the site by automated means (e.g., bots, scrapers)</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. Challenges & Scoring</h2>
          <p style={paragraphStyle}>
            <strong>Educational Purpose:</strong> Konfydence challenges are designed for educational purposes to build
            scam awareness and readiness. They are not a guarantee of protection from fraud or financial loss.
          </p>
          <p style={paragraphStyle}>
            <strong>Accuracy:</strong> While we strive for accuracy in our scenarios and scoring, Konfydence makes no
            warranties regarding the accuracy or completeness of information provided.
          </p>
          <p style={paragraphStyle}>
            <strong>Scores:</strong> Readiness Scores are based on your responses and are intended for educational
            feedback only, not as a professional assessment.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Purchases & Refunds</h2>
          <p style={paragraphStyle}>
            <strong>Payments:</strong> All purchases are processed through Shopify. By making a purchase, you agree to
            Shopify's terms and payment processing practices.
          </p>
          <p style={paragraphStyle}>
            <strong>Digital Products:</strong> Challenge access is digital and non-refundable once delivered. You
            receive immediate access upon purchase completion.
          </p>
          <p style={paragraphStyle}>
            <strong>Physical Products:</strong> Wallet Cards and Fridge Magnets are subject to Shopify's standard
            refund policy for physical goods.
          </p>
          <p style={paragraphStyle}>
            <strong>Refund Disputes:</strong> Contact us at support@konfydence.com for refund inquiries within 30 days
            of purchase.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Disclaimer of Warranties</h2>
          <p style={paragraphStyle}>
            <strong>
              THE WEBSITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. KONFYDENCE MAKES NO
              WARRANTIES, EXPRESSED OR IMPLIED, REGARDING THE WEBSITE OR SERVICES.
            </strong>
          </p>
          <p style={paragraphStyle}>
            Konfydence specifically disclaims all implied warranties including, without limitation, warranties of
            merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p style={paragraphStyle}>
            <strong>Important:</strong> Konfydence is an educational scam-readiness game. It does not guarantee
            protection from fraud or financial loss.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Limitation of Liability</h2>
          <p style={paragraphStyle}>
            In no event shall Konfydence, its directors, employees, or agents be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption) arising out of
            the use or inability to use the services, even if we have been notified of the possibility of such
            damages.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Acceptable Use</h2>
          <p style={paragraphStyle}>You agree not to use the website for:</p>
          <ul style={{ marginLeft: 20, marginBottom: 12 }}>
            <li style={paragraphStyle}>Illegal activities or violating any laws</li>
            <li style={paragraphStyle}>Harassment, abuse, or threatening behavior</li>
            <li style={paragraphStyle}>Transmitting viruses, malware, or harmful code</li>
            <li style={paragraphStyle}>Interfering with site functionality</li>
            <li style={paragraphStyle}>Unauthorized access or attempted unauthorized access</li>
            <li style={paragraphStyle}>Violating intellectual property rights</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Intellectual Property Rights</h2>
          <p style={paragraphStyle}>
            All content on the Konfydence website, including text, graphics, logos, images, and software, is the
            property of Konfydence or its content suppliers and is protected by international copyright laws.
          </p>
          <p style={paragraphStyle}>
            You may not reproduce, distribute, or transmit content without our prior written permission.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Third-Party Links</h2>
          <p style={paragraphStyle}>
            The website may contain links to third-party websites. Konfydence is not responsible for the content,
            accuracy, or practices of external sites. Your use of third-party sites is governed by their terms of
            service.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Privacy</h2>
          <p style={paragraphStyle}>
            Your use of the website is also governed by our{" "}
            <Link href="/privacy-policy" style={linkStyle}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/cookie-policy" style={linkStyle}>
              Cookie Policy
            </Link>
            .
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>11. Indemnification</h2>
          <p style={paragraphStyle}>
            You agree to indemnify and hold harmless Konfydence and its officers, directors, employees, and agents
            from any claims, damages, or expenses (including attorney's fees) arising from your use of the website or
            violation of these terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>12. Termination</h2>
          <p style={paragraphStyle}>
            Konfydence reserves the right to terminate or suspend your access to the website at any time for any
            reason, including violation of these terms, without notice or liability.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>13. Changes to Terms</h2>
          <p style={paragraphStyle}>
            We may modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your
            continued use of the website constitutes acceptance of updated terms.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>14. Governing Law</h2>
          <p style={paragraphStyle}>
            These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in
            which Konfydence operates, without regard to its conflict of law provisions.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>15. Contact Information</h2>
          <p style={paragraphStyle}>
            If you have questions about these Terms of Service, please contact us at:
          </p>
          <p style={paragraphStyle}>
            <strong>Email:</strong> support@konfydence.com
          </p>
        </div>

        <div style={{ ...paragraphStyle, marginTop: 40, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20 }}>
          <Link href="/privacy-policy" style={linkStyle}>
            Privacy Policy
          </Link>
          <span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span>
          <Link href="/cookie-policy" style={linkStyle}>
            Cookie Policy
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
