import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

/** ---- Config (Fox Travel Egypt brand colors) ---- */
const PRIMARY_ORANGE = "#F3722A";
const ACCENT_ORANGE = "#F15A22";

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


/** ---- Unified Email Template - Fox Travel Egypt (New Brand Design) ---- */
export function emailHtmlTemplate(data: z.infer<typeof ContactSchema>) {
  const { name, email, phone, message, source } = data;

  const PRIMARY_ORANGE = "#F3722A";
  const ACCENT_ORANGE = "#F15A22";
  const TEXT_DARK = "#333333";
  const TEXT_LIGHT = "#666666";
  const BG_LIGHT = "#F9F9F9";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry - Fox Travel Egypt</title>
  <style>
    /* Reset styles for email clients */
    body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; }
    img { -ms-interpolation-mode: bicubic; }
    
    /* Mobile responsive overrides */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .padding { padding: 20px !important; }
      .stack-column { display: block !important; width: 100% !important; box-sizing: border-box; }
    }
  </style>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${BG_LIGHT}; margin: 0; padding: 20px 0;">

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BG_LIGHT};">
    <tr>
      <td align="center">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <tr>
            <td align="center" style="background-color: ${PRIMARY_ORANGE}; padding: 30px 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                FOX TRAVEL EGYPT
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                New Website Inquiry
              </p>
            </td>
          </tr>

          <tr>
            <td class="padding" style="padding: 40px 40px 20px 40px;">
              <h2 style="color: ${TEXT_DARK}; margin: 0 0 20px 0; font-size: 20px;">
                Hello Team,
              </h2>
              <p style="color: ${TEXT_LIGHT}; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                You have received a new message from the <strong>${source || 'Website'}</strong> contact form. Here are the details:
              </p>

              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #eeeeee; border-radius: 6px;">
                
                <tr>
                  <td width="30%" style="padding: 15px; border-bottom: 1px solid #eeeeee; background-color: #fafafa; font-weight: bold; color: ${TEXT_DARK}; font-size: 14px;">
                    Name
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; color: ${TEXT_DARK}; font-size: 15px;">
                    ${name}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; background-color: #fafafa; font-weight: bold; color: ${TEXT_DARK}; font-size: 14px;">
                    Email
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; color: ${TEXT_DARK}; font-size: 15px;">
                    <a href="mailto:${email}" style="color: ${ACCENT_ORANGE}; text-decoration: none;">${email}</a>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; background-color: #fafafa; font-weight: bold; color: ${TEXT_DARK}; font-size: 14px;">
                    Phone
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; color: ${TEXT_DARK}; font-size: 15px;">
                    <a href="tel:${phone}" style="color: ${TEXT_DARK}; text-decoration: none;">${phone}</a>
                  </td>
                </tr>

                 ${source ? `
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; background-color: #fafafa; font-weight: bold; color: ${TEXT_DARK}; font-size: 14px;">
                    Source
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #eeeeee; color: ${TEXT_DARK}; font-size: 15px;">
                    ${source}
                  </td>
                </tr>
                ` : ''}

              </table>

              <div style="margin-top: 30px;">
                <p style="font-weight: bold; color: ${TEXT_DARK}; margin-bottom: 10px; font-size: 14px;">Message:</p>
                <div style="background-color: #fff8f5; border-left: 4px solid ${PRIMARY_ORANGE}; padding: 15px; color: ${TEXT_DARK}; font-size: 15px; line-height: 1.6; border-radius: 4px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>

            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 30px; background-color: ${BG_LIGHT}; border-top: 1px solid #eeeeee;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Fox Travel Egypt. All rights reserved.<br>
                Automated notification system.
              </p>
            </td>
          </tr>

        </table>
        </td>
    </tr>
  </table>

</body>
</html>
  `;
}

function emailHtml(data: z.infer<typeof ContactSchema>) {
  return emailHtmlTemplate(data);
}

function emailText(d: z.infer<typeof ContactSchema>) {
  const prefix = d.source === "bulk-purchase"
    ? "Bulk Purchase Inquiry - Fox Travel Egypt"
    : "New Contact Message - Fox Travel Egypt";
  return `${prefix}\n\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\n\nMessage:\n${d.message}\n\n---\nFox Travel Egypt - Hurghada, Egypt`;
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
      : `✉️ New Contact from ${data.name}`;

    await transporter.sendMail({
      from: `Fox Travel Egypt <${process.env.EMAIL_USER}>`,
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