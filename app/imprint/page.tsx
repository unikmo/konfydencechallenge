import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  // absolute: stops root layout's title template from double-appending " | Konfydence".
  title: { absolute: "Imprint - Konfydence" },
  description: "Konfydence Imprint - Company and legal information",
};

export default function ImprintPage() {
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

  const infoBoxStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.04)",
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  };

  const linkStyle: React.CSSProperties = {
    color: tokens.accentAmber,
    textDecoration: "none",
    borderBottom: `1px solid ${tokens.accentAmber}`,
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>Imprint</h1>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. Operator Information</h2>
          <div style={infoBoxStyle}>
            <p style={paragraphStyle}>
              <strong>Company Name:</strong> PlanetHike OÜ
              <br />
              <strong>Product:</strong> Konfydence Challenge
              <br />
              <strong>Registered Office Address:</strong> Järvevana tee 9, Tallinn, 11314, Estonia
              <br />
              <strong>Registration Number:</strong> 80656111
              <br />
              <strong>Legal Representative / Founder:</strong> Tichi Mbanwie
              <br />
              <strong>Email:</strong>{" "}
              <a href="mailto:hello@planethike.org" style={linkStyle}>
                hello@planethike.org
              </a>
              <br />
              <strong>Phone:</strong> +49 (0)1634668380
              <br />
              <strong>Responsible for Content:</strong> Tichi Mbanwie
            </p>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Service Information</h2>
          <p style={paragraphStyle}>
            Konfydence Challenge is an educational game designed to build scam awareness and readiness. The service
            provides interactive scenario-based training with Readiness Score rating and optional paid challenge access
            through Shopify.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. External Links Disclaimer</h2>
          <p style={paragraphStyle}>
            This website may contain links to external websites operated by third parties. We have carefully reviewed
            these links at the time of their placement. However, PlanetHike OÜ has no continuous influence over the
            future content or design of such external websites. Therefore, we cannot guarantee the content, accuracy,
            legality, or safety of any linked external sites.
          </p>
          <p style={paragraphStyle}>
            PlanetHike OÜ expressly dissociates itself from all content of all linked external pages that have been
            changed after the link was set. The responsibility for the content and lawfulness of external links lies
            solely with their operators. Users access external links at their own risk. PlanetHike OÜ accepts no
            liability for any damages or losses arising from the use of external links.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Copyright & Intellectual Property</h2>
          <p style={paragraphStyle}>
            Unless otherwise explicitly stated, all content published on this website, including but not limited to text,
            graphics, images, logos, designs, audio, video, software, the "Konfydence Readiness Score" concept, and any
            underlying technology, is the intellectual property of PlanetHike OÜ or its licensors and is protected by
            copyright, trademark, and other intellectual property laws worldwide.
          </p>
          <p style={paragraphStyle}>
            Stock images, fonts, and other third-party materials used on this site are licensed from their respective
            providers and remain the intellectual property of their owners. Unauthorized use or reproduction of these
            materials may violate copyright laws and is strictly prohibited.
          </p>
          <p style={paragraphStyle}>
            Any use of Konfydence's original materials beyond personal, non-commercial viewing and participation in the
            challenges—such as reproduction, distribution, modification, public display, or commercial exploitation—requires
            the express prior written consent of PlanetHike OÜ. For permission requests, please contact{" "}
            <a href="mailto:hello@planethike.org" style={linkStyle}>
              hello@planethike.org
            </a>
            .
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Liability Disclaimer</h2>
          <p style={paragraphStyle}>
            <strong>Disclaimer of Content:</strong> The information and challenges provided on this website are for
            general informational and educational purposes only and do not constitute legal, security, or professional
            advice. While we strive to ensure accuracy, PlanetHike OÜ makes no representations or warranties of any kind
            about the completeness, accuracy, reliability, or suitability of the website or any challenges provided.
          </p>
          <p style={paragraphStyle}>
            <strong>Educational Use Only:</strong> Konfydence Challenge is an educational game designed to build
            awareness of scam pressure patterns. It is not a guarantee of protection from fraud, scams, or financial loss.
            Real-world security depends on many factors beyond game-based training.
          </p>
          <p style={paragraphStyle}>
            <strong>Reliance on Information:</strong> Any reliance you place on information from this website is strictly
            at your own risk. PlanetHike OÜ assumes no liability for the topicality, correctness, completeness, or
            quality of the information or challenges provided.
          </p>
          <p style={paragraphStyle}>
            <strong>Exclusion of Liability:</strong> Claims for liability against PlanetHike OÜ which refer to material or
            immaterial damages caused by the use or non-use of the information or challenges provided are fundamentally
            excluded, unless demonstrable intentional or grossly negligent fault exists on the part of PlanetHike OÜ.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Accuracy of Information</h2>
          <p style={paragraphStyle}>
            While we make every effort to ensure that the challenges and information on this website are accurate and
            timely, we cannot guarantee their accuracy. Scam tactics and pressure patterns evolve, and our content
            reflects training principles rather than a complete catalog of all possible scams.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Third-Party Services</h2>
          <p style={paragraphStyle}>
            This website integrates with third-party services including Shopify for payment processing. These services
            have their own terms of service and privacy policies. PlanetHike OÜ is not responsible for the practices of
            these third parties.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Changes to Terms</h2>
          <p style={paragraphStyle}>
            PlanetHike OÜ reserves the right to modify this Imprint at any time. Changes are effective immediately upon
            posting to the website.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Governing Law</h2>
          <p style={paragraphStyle}>
            This website and all matters arising from it are governed by the laws of Estonia, without regard to its
            conflict of laws principles.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact for Legal Matters</h2>
          <p style={paragraphStyle}>
            For any legal inquiries or concerns regarding this website, please contact:
          </p>
          <div style={infoBoxStyle}>
            <p style={paragraphStyle}>
              <strong>Email:</strong>{" "}
              <a href="mailto:hello@planethike.org" style={linkStyle}>
                hello@planethike.org
              </a>
              <br />
              <strong>Phone:</strong> +49 (0)1634668380
              <br />
              <strong>Address:</strong> Järvevana tee 9, Tallinn, 11314, Estonia
            </p>
          </div>
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
          <Link href="/terms-of-service" style={linkStyle}>
            Terms of Service
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
