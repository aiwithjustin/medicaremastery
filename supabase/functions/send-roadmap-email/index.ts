import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { firstName, email } = await req.json();

    if (!firstName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing firstName or email" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #DC143C 0%, #8B4789 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background: #ffffff;
              padding: 30px 20px;
              border: 1px solid #e5e7eb;
              border-top: none;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              border: 1px solid #e5e7eb;
              border-top: none;
              border-radius: 0 0 8px 8px;
              font-size: 14px;
              color: #6b7280;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #DC143C 0%, #8B4789 100%);
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Medicare Mastery</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            
            <p>Thanks for your interest in Medicare Mastery.</p>
            
            <p>Attached is your free <strong>Medicare Career Roadmap</strong>, which outlines the real path from zero experience to your first Medicare commission — including the delays, decisions, and skills that actually matter.</p>
            
            <p>We'll be in touch with additional resources soon.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>Medicare Mastery Team</strong></p>
          </div>
          <div class="footer">
            <p style="margin: 0;">You're receiving this email because you requested the Medicare Career Roadmap.</p>
          </div>
        </body>
      </html>
    `;

    const emailText = `Hi ${firstName},\n\nThanks for your interest in Medicare Mastery.\n\nAttached is your free Medicare Career Roadmap, which outlines the real path from zero experience to your first Medicare commission — including the delays, decisions, and skills that actually matter.\n\nWe'll be in touch with additional resources soon.\n\n— Medicare Mastery Team`;

    const pdfUrl = Deno.env.get("ROADMAP_PDF_URL");
    if (!pdfUrl) {
      throw new Error("ROADMAP_PDF_URL is not configured");
    }

    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error("Failed to fetch PDF file");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    const emailPayload = {
      from: "Medicare Mastery <onboarding@medicaremasteryprogram.com>",
      to: [email],
      subject: "Your Free Medicare Career Roadmap",
      html: emailHtml,
      text: emailText,
      attachments: [
        {
          filename: "Medicare Career Roadmap.pdf",
          content: pdfBase64,
        },
      ],
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    const result = await resendResponse.json();

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending roadmap email:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
