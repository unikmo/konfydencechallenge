import Link from "next/link";
import { tokens } from "@/lib/theme/tokens";

export const metadata = {
  alternates: { canonical: "/privacy-policy" },
  title: { absolute: "Privacy Policy - Konfydence" },
  description: "Konfydence Privacy Policy - How we protect your data",
};

export default function PrivacyPolicyPage() {
  const containerStyle: React.CSSProperties = { minHeight: "100vh", background: tokens.bgCanvas, color: tokens.textOnDark, padding: "60px 20px 40px", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' };
  const contentStyle: React.CSSProperties = { maxWidth: 800, margin: "0 auto" };
  const titleStyle: React.CSSProperties = { fontSize: 42, fontWeight: 900, marginBottom: 12 };
  const updateStyle: React.CSSProperties = { fontSize: 13, color: "#B8C6D8", marginBottom: 32 };
  const sectionStyle: React.CSSProperties = { marginBottom: 32 };
  const headingStyle: React.CSSProperties = { fontSize: 20, fontWeight: 900, marginBottom: 12, marginTop: 24 };
  const paragraphStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#B8C6D8", marginBottom: 12 };
  const listStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#B8C6D8", marginLeft: 20, marginBottom: 12 };
  const linkStyle: React.CSSProperties = { color: tokens.accentAmber, textDecoration: "none", borderBottom: `1px solid ${tokens.accentAmber}` };

  return (
    <div style={containerStyle}><div style={contentStyle}>
      <h1 style={titleStyle}>Privacy Policy</h1>
      <p style={updateStyle}>Last updated: November 2, 2026</p>

      <div style={sectionStyle}><h2 style={headingStyle}>1. Introduction</h2><p style={paragraphStyle}>Konfydence is operated by PlanetHike OÜ ("we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit konfydence.com and use Konfydence or CoMaSy services.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>2. Information We Collect</h2><p style={paragraphStyle}>We may collect information about you in a variety of ways:</p><ul style={listStyle}>
        <li><strong>Information you provide directly:</strong> Name, email address, organisation name and other details submitted through contact or pilot-request forms.</li>
        <li><strong>Free-resource requests:</strong> Email address, the scam-safety resources selected, source page and whether you separately requested occasional marketing communications.</li>
        <li><strong>CoMaSy pilot-request information:</strong> Role, organisation size, primary objective, current awareness platform, notes, consent and campaign/source attribution where supplied.</li>
        <li><strong>Challenge and programme responses:</strong> Answers to challenge or simulation scenarios and resulting training signals where the relevant service requires them.</li>
        <li><strong>Purchase information:</strong> Email address, billing details and order information processed by Stripe for consumer purchases.</li>
        <li><strong>Device and usage information:</strong> Technical information such as IP address, browser type and pages visited where collected by the service.</li>
        <li><strong>Cookies and analytics:</strong> Analytics cookies are subject to the consent choices described in our Cookie Policy.</li>
      </ul></div>

      <div style={sectionStyle}><h2 style={headingStyle}>3. How We Use Your Information</h2><p style={paragraphStyle}>We use information we collect for purposes including:</p><ul style={listStyle}>
        <li>Providing and improving Konfydence challenge and CoMaSy services.</li>
        <li>Delivering free scam-safety resources that you request.</li>
        <li>Sending scam-safety tips or other marketing communications only where you separately opt in.</li>
        <li>Responding to contact and CoMaSy pilot requests.</li>
        <li>Configuring and administering agreed pilots or customer programmes.</li>
        <li>Processing consumer purchases, invoices and subscriptions through Stripe.</li>
        <li>Sending account, purchase, pilot or service-related communications.</li>
        <li>Analyzing usage where analytics consent has been granted.</li>
        <li>Complying with legal obligations and protecting the service.</li>
      </ul></div>

      <div style={sectionStyle}><h2 style={headingStyle}>4. Legal Basis (GDPR)</h2><p style={paragraphStyle}>Where the GDPR applies, the legal basis depends on the purpose and may include consent, performance of a contract or steps requested before entering a contract, legal obligations, and legitimate interests where appropriate. A request to receive a free resource is handled separately from optional marketing consent. Enterprise pilot processing may also be governed by a separate customer agreement and data-processing arrangement where required.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>5. Data Retention</h2><p style={paragraphStyle}>We retain personal information only for as long as necessary for the relevant service, legal obligation or agreed customer programme. Retention for enterprise pilots should be defined in the pilot scope or customer agreement where it differs from the general service. Existing consumer records may be retained for customer-service and statutory accounting/tax purposes as applicable.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>6. Sharing Your Information</h2><p style={paragraphStyle}>We do not sell personal information. We may share information with service providers that help us operate the website, deliver communications, host application data, process consumer payments, provide analytics after consent, or meet legal requirements. Brevo may process email addresses and delivery data for requested resource emails and, where separately opted in, marketing communications. Google Drive may host the downloadable resource files you choose. Pilot-specific subprocessors and deployment details should be confirmed for the agreed enterprise environment.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>7. Your Privacy Rights</h2><p style={paragraphStyle}>Where applicable, you may have rights to access, correct, delete, restrict or object to processing, receive portable data, and withdraw consent. To exercise a privacy right, contact <strong>privacy@konfydence.com</strong>.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>8. CoMaSy Enterprise Pilots</h2><p style={paragraphStyle}>A CoMaSy pilot may involve participant scenario responses and derived training signals. Before participant data is used, the customer and Konfydence should agree the required identifiers, reporting granularity, access model, retention/deletion expectations and any additional privacy or employee-representation requirements. See our <Link href="/comasy/security" style={linkStyle}>CoMaSy Security & Privacy</Link> page for the current procurement-review framework.</p></div>

      <div id="children" style={sectionStyle}><h2 style={headingStyle}>9. Children and Schools</h2>
        <p style={paragraphStyle}>Some Konfydence challenge editions are written for students aged 12 to 18. We want children's information to be handled with extra care, so please read this section if a child will use the service.</p>
        <ul style={listStyle}>
          <li><strong>Age question:</strong> Before the free-round sign-up asks for an email address, it asks for a month and year of birth. We use the answer once to choose an age group, keep only the group in a cookie for 24 hours, and do not store the date of birth. Under 13, no email address is collected. From 13 to 15, only a parent or guardian's email address can be entered, and they confirm they are the parent or guardian. From 16, you enter your own. Under 16s are not asked for an email address to see their result: it is shown on screen. This is a self-declared answer and not a check of age. Under the GDPR the age of digital consent is set nationally between 13 and 16, and we apply the higher age (16) for using a child's own email address.</li>
          <li><strong>Deletion for parents and guardians:</strong> Parents and guardians can contact us at privacy@konfydence.com to ask us to delete a child's information.</li>
          <li><strong>What we ask of children:</strong> The free readiness check does not require an account. An email address is requested only to unlock further free rounds and to send a progress link, and it is used for nothing else. We do not send marketing to children.</li>
          <li><strong>School pilots:</strong> When a school runs a Konfydence pilot, the school (or its authority) decides why and how student data is used and Konfydence processes it on the school's behalf under a written data-processing agreement. The school is responsible for the lawful basis and for the information it gives to parents and guardians. Students take part through numbered aliases created by their teacher, so we do not receive student names or email addresses. The school keeps the key that links an alias to a student, and can disable an alias or delete its data at any time. Before any student takes part, the school and Konfydence also agree the level of reporting (cohort-level by default), access and retention. Student responses are deleted automatically once the agreed retention period after the last activity has passed. We do not ask for student information in pilot request forms, and we do not use student data for advertising or marketing.</li>
          <li><strong>Reporting a concern:</strong> If you believe a child's information has been provided without the authorisation that applies, contact privacy@konfydence.com and we will review it promptly.</li>
        </ul>
        <p style={paragraphStyle}>See <Link href="/comasy/security#schools" style={linkStyle}>Schools &amp; student data</Link> for the conditions we agree before a school pilot.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>10. Cookies</h2><p style={paragraphStyle}>See our <Link href="/cookie-policy" style={linkStyle}>Cookie Policy</Link> for information about cookies and analytics consent.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>11. Third-Party Links</h2><p style={paragraphStyle}>Our website may contain links to third-party sites, including resource downloads hosted through Google Drive. We are not responsible for the privacy practices of external websites. Please review their policies before providing personal information.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>12. Security</h2><p style={paragraphStyle}>We use technical and organisational safeguards appropriate to the service. No internet transmission or storage method can be guaranteed to be completely secure. Enterprise customers should review deployment-specific safeguards and requirements before a pilot.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>13. Changes to This Policy</h2><p style={paragraphStyle}>We may update this Privacy Policy periodically. Material changes will be reflected on this page with an updated date.</p></div>

      <div style={sectionStyle}><h2 style={headingStyle}>14. Contact Us</h2><p style={paragraphStyle}>For privacy questions or requests:</p><p style={paragraphStyle}><strong>Operator:</strong> PlanetHike OÜ<br/><strong>Email:</strong> privacy@konfydence.com<br/><strong>Registered office:</strong> Järvevana tee 9, Tallinn, 11314, Estonia<br/><strong>Registration number:</strong> 80656111<br/>See the <Link href="/imprint" style={linkStyle}>Imprint</Link> for current legal and contact information.</p></div>

      <div style={{ ...paragraphStyle, marginTop: 40, borderTop: `1px solid rgba(255,255,255,0.1)`, paddingTop: 20 }}><Link href="/" style={linkStyle}>← Back to Home</Link></div>
    </div></div>
  );
}
