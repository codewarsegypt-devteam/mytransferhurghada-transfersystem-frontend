import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

/** ---- Config (brand colors) ---- */
const PRIMARY = "#F38B32";
const SECONDARY = "#0A4F7D";
const SECONDARY_LIGHT = "#2b57a1";

/** ---- Schema (exactly your 4 fields) ---- */
const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
  message: z.string().min(5, "Please add a short message"),
  source: z.enum(["contact", "bulk-purchase"]).optional().default("contact"),
});

/** ---- Body parser: JSON | multipart/form-data | x-www-form-urlencoded ---- */
async function parseBody(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await req.json();
  }
  if (ct.includes("multipart/form-data")) {
    const fd = await req.formData();
    // Only pick the fields we care about
    return {
      name: (fd.get("name") ?? "") as string,
      email: (fd.get("email") ?? "") as string,
      phone: (fd.get("phone") ?? "") as string,
      message: (fd.get("message") ?? "") as string,
      source: (fd.get("source") ?? "contact") as string,
    };
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    return {
      name: params.get("name") ?? "",
      email: params.get("email") ?? "",
      phone: params.get("phone") ?? "",
      message: params.get("message") ?? "",
      source: params.get("source") ?? "contact",
    };
  }
  // Unsupported media type
  return NextResponse.json({ ok: false, message: "Unsupported Content-Type" }, { status: 415 });
}

/** ---- Email template for regular contact ---- */
function emailHtmlContact(data: z.infer<typeof ContactSchema>) {
  const { name, email, phone, message } = data;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>New Contact - Abu Dabbab Beach</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      background: linear-gradient(135deg, #f0f4f8 0%, #e8f0f7 100%);
      color: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(10, 79, 125, 0.15);
    }
    .header {
      background: linear-gradient(135deg, ${SECONDARY} 0%, ${SECONDARY_LIGHT} 50%, ${PRIMARY} 100%);
      color: #ffffff;
      padding: 32px 28px;
      text-align: center;
    }
    .header-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .header-subtitle {
      font-size: 14px;
      opacity: 0.95;
      font-weight: 400;
    }
    .content {
      padding: 32px 28px;
      background: #ffffff;
    }
    .field {
      margin-bottom: 24px;
    }
    .field:last-child {
      margin-bottom: 0;
    }
    .field-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    }
    .field-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .message-field {
      padding: 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      white-space: pre-wrap;
      line-height: 1.7;
      font-size: 15px;
      color: #374151;
      min-height: 100px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      margin: 28px 0;
    }
    .footer {
      padding: 20px 28px;
      background: #f9fafb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer-brand {
      color: ${PRIMARY};
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      body { padding: 12px; }
      .email-container { border-radius: 16px; }
      .header { padding: 24px 20px; }
      .header-title { font-size: 20px; }
      .content { padding: 24px 20px; }
      .field-value, .message-field { font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-title">🌊 New Contact Message</div>
      <div class="header-subtitle">Abu Dabbab Beach</div>
    </div>
    <div class="content">
      <div class="field">
        <span class="field-label">Full Name</span>
        <div class="field-value">${esc(name)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Email Address</span>
        <div class="field-value">${esc(email)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Phone Number</span>
        <div class="field-value">${esc(phone)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Message</span>
        <div class="message-field">${esc(message)}</div>
      </div>
    </div>
    <div class="footer">
      <div>You received this message from your contact form</div>
      <div style="margin-top: 4px;">Powered by <span class="footer-brand">Uptrends</span></div>
    </div>
  </div>
</body>
</html>`;
}
/** ---- Email template for bulk purchase ---- */
function emailHtmlBulkPurchase(data: z.infer<typeof ContactSchema>) {
  const { name, email, phone, message } = data;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Bulk Purchase Inquiry - Abu Dabbab Beach</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      background: linear-gradient(135deg, #0050a5 0%, #0066cc 50%, #004080 100%);
      color: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 80, 165, 0.25);
    }
    .header {
      background: linear-gradient(135deg, #0050a5 0%, #0066cc 50%, #004080 100%);
      color: #ffffff;
      padding: 32px 28px;
      text-align: center;
    }
    .header-title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .header-subtitle {
      font-size: 14px;
      opacity: 0.95;
      font-weight: 400;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 28px;
      background: #ffffff;
    }
    .field {
      margin-bottom: 24px;
    }
    .field:last-child {
      margin-bottom: 0;
    }
    .field-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
    }
    .field-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
      padding: 12px 16px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }
    .message-field {
      padding: 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      white-space: pre-wrap;
      line-height: 1.7;
      font-size: 15px;
      color: #374151;
      min-height: 100px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
      margin: 28px 0;
    }
    .footer {
      padding: 20px 28px;
      background: #f9fafb;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer-brand {
      color: ${PRIMARY};
      font-weight: 600;
    }
    @media only screen and (max-width: 600px) {
      body { padding: 12px; }
      .email-container { border-radius: 16px; }
      .header { padding: 24px 20px; }
      .header-title { font-size: 20px; }
      .content { padding: 24px 20px; }
      .field-value, .message-field { font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-title">📦 Bulk Purchase Inquiry</div>
      <div class="header-subtitle">Abu Dabbab Beach</div>
      <div class="badge">Group Booking Request</div>
    </div>
    <div class="content">
      <div class="field">
        <span class="field-label">Full Name</span>
        <div class="field-value">${esc(name)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Email Address</span>
        <div class="field-value">${esc(email)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Phone Number</span>
        <div class="field-value">${esc(phone)}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <span class="field-label">Inquiry Details</span>
        <div class="message-field">${esc(message)}</div>
      </div>
    </div>
    <div class="footer">
      <div>This inquiry was submitted from the Bulk Purchase form</div>
      <div style="margin-top: 4px;">Powered by <span class="footer-brand">Uptrends</span></div>
    </div>
  </div>
</body>
</html>`;
}

function emailHtml(data: z.infer<typeof ContactSchema>) {
  return data.source === "bulk-purchase" 
    ? emailHtmlBulkPurchase(data) 
    : emailHtmlContact(data);
}

function emailText(d: z.infer<typeof ContactSchema>) {
  const prefix = d.source === "bulk-purchase" 
    ? "Bulk Purchase Inquiry - Abu Dabbab Beach" 
    : "New Contact Message - Abu Dabbab Beach";
  return `${prefix}\n\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\n\nMessage:\n${d.message}\n`;
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** ---- Route ---- */
export async function POST(req: NextRequest) {
  try {
    const raw = await parseBody(req);
    // If parseBody returned a Response (415), bubble it up
    if (raw instanceof Response) return raw;

    const data = ContactSchema.parse(raw);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    const subject = data.source === "bulk-purchase"
      ? `📦 Bulk Purchase Inquiry — ${data.name}`
      : `New Contact — ${data.name}`;

    await transporter.sendMail({
      from: `Abu Dabbab Beach <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, // your inbox
      subject,
      text: emailText(data),
      html: emailHtml(data),
      replyTo: data.email,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, errors: err.issues }, { status: 400 });
    }
    console.error("request-quote error:", err);
    return NextResponse.json({ ok: false, message: "Internal Server Error" }, { status: 500 });
  }
}