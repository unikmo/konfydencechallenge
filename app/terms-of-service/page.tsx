import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  title: { absolute: "Terms of Service - Konfydence" },
  description: "Konfydence Terms of Service",
};

export default function TermsOfServicePage() {
  const containerStyle: React.CSSProperties = { minHeight: "100vh", background: tokens.bgCanvas, color: tokens.textOnDark, padding: "60px 20px 40px", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' };
  const contentStyle: React.CSSProperties = { maxWidth: 800, margin: "0 auto" };
  const titleStyle: React.CSSProperties = { fontSize: 42, fontWeight: 900, marginBottom: 12 };
  const updateStyle: React.CSSProperties = { fontSize: 13, color: tokens.textMuted, marginBottom: 32 };
  const sectionStyle: React.CSSProperties = { marginBottom: 32 };
  const headingStyle: React.CSSProperties = { fontSize: 20, fontWeight: 900, marginBottom: 12, marginTop: 24 };
  const paragraphStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: tokens.textMuted, marginBottom: 12 };
  const listStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: tokens.textMuted, marginLeft: 20, marginBottom: 12 };
  const linkStyle: React.CSSProperties = { color: tokens.accentAmber, textDecoration: "none", borderBottom: `1px solid ${tokens.accentAmber}` };

  return (
    <div style={containerStyle}><div style={contentStyle}>
      <h1 style={titleStyle}>Terms of Service</h1>
      <p style={updateStyle}>Last updated: August 25, 2026</p>

      <div style={sectionStyle}><h2 style={headingStyle}>1. Agreement to Terms</h2><p style={paragraphStyle}>By accessing and using the Konfydence website and consumer services, you agree to these Terms of Service. Konfydence is operated by PlanetHike OÜ. If you do not agree, do not use the service.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>2. Consumer Use License</h2><p style={paragraphStyle}>Unless a separate written agreement applies, Konfydence grants you a limited, non-exclusive, revocable license to access and use consumer challenge content for personal and educational purposes. You may not sell, reproduce, modify, redistribute, mirror or commercially exploit the content without written permission.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>3. CoMaSy and Organisational Use</h2><p style={paragraphStyle}>CoMaSy pilots, organisational deployments and other business use are not licensed for enterprise use solely by these public consumer Terms. They require an agreed pilot scope, order form, statement of work or other written commercial agreement as applicable. Where a separate written agreement conflicts with these public Terms for that organisational use, the separate agreement controls.</p><p style={paragraphStyle}>CoMaSy metrics are training signals derived from simulated decisions. They are not guarantees of real-world security performance, professional assessments or proof of regulatory compliance by themselves.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>4. Challenges & Scoring</h2><p style={paragraphStyle}><strong>Educational purpose:</strong> Konfydence challenges are designed to build scam and security-decision awareness. They do not guarantee protection from fraud, cyber incidents or financial loss.</p><p style={paragraphStyle}><strong>Scores:</strong> Readiness Scores and other training signals are based on participant responses and are intended for educational feedback and programme review, subject to the limits described in the relevant methodology.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>5. Consumer Purchases & Refunds</h2><p style={paragraphStyle}>Consumer purchases are processed through Shopify. Digital challenge access is provided after purchase and refund eligibility may depend on the type of product and applicable law. For consumer refund inquiries, contact support@konfydence.com.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>6. Disclaimer of Warranties</h2><p style={paragraphStyle}>The website and services are provided on an "as is" and "as available" basis to the extent permitted by applicable law. Konfydence does not guarantee that challenge content, scoring or service availability will be error-free or suitable for every use case.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>7. Limitation of Liability</h2><p style={paragraphStyle}>To the extent permitted by applicable law, PlanetHike OÜ and Konfydence are not liable for indirect or consequential losses arising from use of the public consumer service. Any enterprise-specific liability terms are governed by the separate written agreement for that engagement.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>8. Acceptable Use</h2><p style={paragraphStyle}>You agree not to use the website or services to:</p><ul style={listStyle}><li>violate applicable law;</li><li>harass, abuse or threaten others;</li><li>transmit malware or harmful code;</li><li>interfere with service operation;</li><li>gain unauthorised access;</li><li>violate intellectual-property or privacy rights.</li></ul></div>

      <div style={sectionStyle}><h2 style={headingStyle}>9. Intellectual Property</h2><p style={paragraphStyle}>Unless otherwise stated, Konfydence content, designs, challenge materials, scoring concepts and software are owned by PlanetHike OÜ or its licensors and are protected by applicable intellectual-property laws.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>10. Third-Party Services</h2><p style={paragraphStyle}>The service may use third-party providers for hosting, communications, analytics, payments or other functions. Those providers may have their own terms and privacy policies. Enterprise-specific subprocessors should be confirmed for the relevant pilot or customer environment.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>11. Privacy</h2><p style={paragraphStyle}>Use of the website is also governed by our <Link href="/privacy-policy" style={linkStyle}>Privacy Policy</Link> and <Link href="/cookie-policy" style={linkStyle}>Cookie Policy</Link>. CoMaSy enterprise review information is available at <Link href="/comasy/security" style={linkStyle}>Security & Privacy</Link>.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>12. Changes and Termination</h2><p style={paragraphStyle}>We may update these public Terms and may suspend or terminate access where necessary to protect the service, enforce these Terms or comply with law. Material changes will be reflected on this page.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>13. Governing Law and Jurisdiction</h2><p style={paragraphStyle}>The governing law and jurisdiction applicable to a consumer transaction may depend on mandatory law and the relevant circumstances. Any enterprise agreement for CoMaSy should state its governing-law and jurisdiction provisions expressly.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>14. Contact Information</h2><p style={paragraphStyle}><strong>Operator:</strong> PlanetHike OÜ<br/><strong>Email:</strong> support@konfydence.com<br/>See the <Link href="/imprint" style={linkStyle}>Imprint</Link> for registered company and contact information.</p></div>

      <div style={{ ...paragraphStyle, marginTop: 40, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20 }}><Link href="/privacy-policy" style={linkStyle}>Privacy Policy</Link><span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span><Link href="/cookie-policy" style={linkStyle}>Cookie Policy</Link><span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span><Link href="/imprint" style={linkStyle}>Imprint</Link><span style={{ margin: "0 12px", color: tokens.textMuted }}>•</span><Link href="/" style={linkStyle}>Back to Home</Link></div>
    </div></div>
  );
}
