import { Resend } from "resend";
import logger from "@/lib/logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Magic Memory <hello@notifications.app-whisper.com>";

export async function sendWelcomeEmail(to: string, name: string | null) {
  try {
    const firstName = name?.split(" ")[0] || null;
    const greeting = firstName
      ? `Welcome to Magic Memory, ${firstName}!`
      : "Welcome to Magic Memory!";

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: greeting,
      html: buildWelcomeHtml(name),
    });

    if (error) {
      logger.error({ error, to }, "Failed to send welcome email");
      return false;
    }

    logger.info({ to }, "Welcome email sent");
    return true;
  } catch (err) {
    logger.error({ error: err instanceof Error ? err.message : err, to }, "Exception sending welcome email");
    return false;
  }
}

export async function sendPurchaseEmail(
  to: string,
  name: string | null,
  packageName: string,
  credits: number,
  amountDisplay: string,
) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your ${packageName} plan is ready — ${credits} credits added`,
      html: buildPurchaseHtml(name, packageName, credits, amountDisplay),
    });

    if (error) {
      logger.error({ error, to }, "Failed to send purchase email");
      return false;
    }

    logger.info({ to, packageName, credits }, "Purchase email sent");
    return true;
  } catch (err) {
    logger.error({ error: err instanceof Error ? err.message : err, to }, "Exception sending purchase email");
    return false;
  }
}

// ---------- HTML builders ----------

const BRAND_COLOR = "#7c3aed";
const BG_COLOR = "#f9fafb";
const CARD_BG = "#ffffff";
const TEXT_COLOR = "#1a1a1a";
const MUTED_COLOR = "#6b7280";
const BORDER_COLOR = "#e5e7eb";
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:${FONT};color:${TEXT_COLOR};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG_COLOR};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:${CARD_BG};border-radius:12px;border:1px solid ${BORDER_COLOR};overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:28px 40px;text-align:center;">
              <img src="https://magic-memory.dev/icon.png" alt="Magic Memory" width="48" height="48" style="display:inline-block;vertical-align:middle;border-radius:10px;margin-right:12px;" />
              <span style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;vertical-align:middle;">Magic Memory</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${BORDER_COLOR};text-align:center;">
              <p style="margin:0;font-size:13px;color:${MUTED_COLOR};line-height:1.5;">
                Magic Memory — AI Photo Restoration<br />
                <a href="https://magic-memory.dev" style="color:${BRAND_COLOR};text-decoration:none;">magic-memory.dev</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px auto 0;">
  <tr>
    <td style="background-color:${BRAND_COLOR};border-radius:8px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.2px;">${text}</a>
    </td>
  </tr>
</table>`;
}

function buildWelcomeHtml(name: string | null): string {
  const displayName = name || null;
  const heading = displayName
    ? `Welcome, ${displayName}!`
    : "Welcome to Magic Memory!";

  return layout(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${TEXT_COLOR};letter-spacing:-0.3px;">${heading}</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
      We're excited to have you. Magic Memory uses AI to restore your old, blurry, or damaged photos — bringing your memories back to life in seconds.
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
      Here's how it works:
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 16px;">
      <tr>
        <td style="padding:6px 0;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
          <span style="display:inline-block;width:28px;height:28px;background-color:${BRAND_COLOR};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:600;margin-right:12px;vertical-align:middle;">1</span>
          Upload your old or blurry photo
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
          <span style="display:inline-block;width:28px;height:28px;background-color:${BRAND_COLOR};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:600;margin-right:12px;vertical-align:middle;">2</span>
          Our AI restores it in seconds
        </td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
          <span style="display:inline-block;width:28px;height:28px;background-color:${BRAND_COLOR};color:#fff;border-radius:50%;text-align:center;line-height:28px;font-size:13px;font-weight:600;margin-right:12px;vertical-align:middle;">3</span>
          Download your restored memory
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
      You've got <strong>1 free credit</strong> to try it out right now.
    </p>
    ${button("Restore Your First Photo", "https://magic-memory.dev/restore")}
  `);
}

function buildPurchaseHtml(
  name: string | null,
  packageName: string,
  credits: number,
  amountDisplay: string,
): string {
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";

  return layout(`
    <h1 style="margin:0 0 16px;font-size:22px;font-weight:700;color:${TEXT_COLOR};letter-spacing:-0.3px;">Payment Confirmed</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
      ${greeting} thanks for your purchase! Your credits have been added to your account and are ready to use.
    </p>
    <!-- Receipt card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BG_COLOR};border-radius:8px;border:1px solid ${BORDER_COLOR};margin-bottom:24px;">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding:4px 0;font-size:14px;color:${MUTED_COLOR};">Plan</td>
              <td style="padding:4px 0;font-size:14px;font-weight:600;color:${TEXT_COLOR};text-align:right;">${packageName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:14px;color:${MUTED_COLOR};">Credits added</td>
              <td style="padding:4px 0;font-size:14px;font-weight:600;color:${TEXT_COLOR};text-align:right;">${credits} restorations</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0;"><hr style="border:none;border-top:1px solid ${BORDER_COLOR};margin:0;" /></td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:14px;color:${MUTED_COLOR};">Amount paid</td>
              <td style="padding:4px 0;font-size:16px;font-weight:700;color:${TEXT_COLOR};text-align:right;">${amountDisplay}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:${TEXT_COLOR};">
      Your credits never expire — use them whenever you're ready.
    </p>
    ${button("Start Restoring Photos", "https://magic-memory.dev/restore")}
  `);
}

export { buildWelcomeHtml, buildPurchaseHtml };
