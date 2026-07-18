import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, organization, seatCount, message, topic } = body;

    // Validate required fields
    if (!name || !email || !organization || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For v1, just log the submission
    // In production, this would:
    // 1. Send email to business inbox
    // 2. Store in database
    // 3. Integrate with CRM
    console.log("Contact form submission:", {
      name,
      email,
      organization,
      seatCount,
      message,
      topic,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement email sending (Resend, Nodemailer, etc.)
    // Example with Resend (if available):
    // const emailResponse = await resend.emails.send({
    //   from: "hello@konfydence.com",
    //   to: "business@konfydence.com",
    //   subject: `New ${topic} inquiry from ${name}`,
    //   html: `...`,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
