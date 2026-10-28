const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "concierge@konfydence.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "The Konfydence Team";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Send one transactional email via Brevo. Returns false (and logs) if not configured or on failure. */
export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  tags?: string[];
}): Promise<boolean> {
  const gateway=process.env.TRANSACTIONAL_EMAIL_GATEWAY_URL;
  const privateDeployment=process.env.NEXT_PUBLIC_CUSTOMER_HOSTED === "1";
  if(gateway) {
    try {
      const url=new URL(gateway);
      const localTest=process.env.NODE_ENV!=="production"&&["localhost","127.0.0.1"].includes(url.hostname)&&url.protocol==="http:";
      if(url.protocol!=="https:"&&!localTest)return false;
      if(privateDeployment&&(url.hostname==="konfydence.com"||url.hostname.endsWith(".konfydence.com")))return false;
      const response=await fetch(gateway,{method:"POST",headers:{"Content-Type":"application/json",...(process.env.TRANSACTIONAL_EMAIL_GATEWAY_TOKEN?{Authorization:"Bearer "+process.env.TRANSACTIONAL_EMAIL_GATEWAY_TOKEN}:{})},body:JSON.stringify(input),redirect:"error",signal:AbortSignal.timeout(10000)});
      return response.ok;
    }catch{return false;}
  }
  if(privateDeployment)return false;
  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY not configured; email not sent");
    return false;
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email: input.to }],
        ...(input.replyTo ? { replyTo: { email: input.replyTo } } : {}),
        subject: input.subject,
        htmlContent: input.html,
        tags: input.tags || ["konfydence"],
      }),
    });
    if (!response.ok) {
      console.error("Brevo transactional email failed:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Brevo transactional email error:", error);
    return false;
  }
}
