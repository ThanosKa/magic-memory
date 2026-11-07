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
) {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your ${packageName} pack is ready — ${credits} credits added`,
      html: buildPurchaseHtml(name, packageName, credits),
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

// Email clients cannot read the CSS variables in app/globals.css, so these are
// the dark "Darkroom" tokens as literals. Keep them in step with that file.
const SITE_URL = "https://magic-memory.dev";
const INK = "#0d0b09";
const PAPER = "#f1eadf";
const PRINT = "#ebe2d2";
const EMBER = "#ff5a36";
const MUTED = "#a69d90";
const LINE = "#282623";
const PRINT_LINE = "#d3cbbd";
const PRINT_MUTED = "#5c544a";

// Many clients (Gmail included) drop web fonts, so the fallbacks must read well too.
const SANS = "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";
const SERIF = "'Instrument Serif',Georgia,'Times New Roman',serif";
const MONO = "'JetBrains Mono',Menlo,Consolas,monospace";

/** Names come from the sign-up form, so escape them before they reach the HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function firstNameOf(name: string | null): string | null {
  const firstName = name?.split(" ")[0];
  return firstName ? escapeHtml(firstName) : null;
}

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Magic Memory</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono&display=swap" rel="stylesheet" />
</head>
<body bgcolor="${INK}" style="margin:0;padding:0;background-color:${INK};font-family:${SANS};color:${PAPER};-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${INK}" style="background-color:${INK};">
    <tr>
      <td align="center" style="padding:32px 20px 40px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
          <tr>
            <td style="padding:0 0 22px;border-bottom:1px solid ${LINE};">
              <img src="${SITE_URL}/icon.png" alt="" width="28" height="28" style="display:inline-block;vertical-align:middle;border:0;border-radius:7px;" />
              <span style="margin-left:8px;font-family:${SERIF};font-size:21px;line-height:28px;color:${PAPER};vertical-align:middle;">Magic Memory</span>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 0;">${content}</td>
          </tr>
          <tr>
            <td style="padding:22px 0 0;border-top:1px solid ${LINE};font-size:13px;line-height:20px;color:${MUTED};">
              Magic Memory, AI photo restoration<br />
              <a href="${SITE_URL}" style="color:${PAPER};text-decoration:underline;">magic-memory.dev</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function label(text: string) {
  return `<p style="margin:0 0 18px;font-family:${MONO};font-size:11px;line-height:16px;letter-spacing:0.2em;text-transform:uppercase;color:${MUTED};"><span style="color:${EMBER};">&#9679;</span>&nbsp;&nbsp;${text}</p>`;
}

function heading(html: string) {
  return `<h1 style="margin:0 0 20px;font-family:${SERIF};font-size:44px;font-weight:400;line-height:48px;letter-spacing:-0.02em;color:${PAPER};">${html}</h1>`;
}

function paragraph(html: string) {
  return `<p style="margin:0 0 28px;font-size:15px;line-height:24px;color:${MUTED};">${html}</p>`;
}

function button(text: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
  <tr>
    <td bgcolor="${PAPER}" style="background-color:${PAPER};border-radius:999px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:15px;font-weight:500;line-height:20px;color:${INK};text-decoration:none;">${text}&nbsp;&rarr;</a>
    </td>
  </tr>
</table>`;
}

function step(number: string, text: string) {
  return `<tr>
    <td width="44" valign="top" style="padding:14px 0;border-top:1px solid ${LINE};font-family:${MONO};font-size:12px;line-height:22px;color:${EMBER};">${number}</td>
    <td valign="top" style="padding:14px 0;border-top:1px solid ${LINE};font-size:15px;line-height:22px;color:${PAPER};">${text}</td>
  </tr>`;
}

function receiptRow(name: string, value: string, isLast: boolean) {
  const border = isLast ? "" : `border-bottom:1px solid ${PRINT_LINE};`;
  return `<tr>
    <td style="padding:12px 0;${border}font-size:14px;line-height:20px;color:${PRINT_MUTED};">${name}</td>
    <td align="right" style="padding:12px 0;${border}font-size:14px;font-weight:500;line-height:20px;color:${INK};">${value}</td>
  </tr>`;
}

function buildWelcomeHtml(name: string | null): string {
  const firstName = firstNameOf(name);
  const title = firstName ? `Welcome, <em>${firstName}.</em>` : "Welcome to <em>Magic Memory.</em>";

  return layout(`
    ${label("AI photo restoration")}
    ${heading(title)}
    ${paragraph("We're excited to have you. Magic Memory uses AI to restore your old, blurry or damaged photos, bringing your memories back to life in seconds.")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border-bottom:1px solid ${LINE};">
      ${step("01", "Upload your old or blurry photo")}
      ${step("02", "Our AI restores it in seconds")}
      ${step("03", "Download your restored memory")}
    </table>
    ${paragraph(`You've got <strong style="font-weight:500;color:${PAPER};">1 free credit</strong> to try it out right now.`)}
    ${button("Restore your first photo", `${SITE_URL}/restore`)}
  `);
}

function buildPurchaseHtml(
  name: string | null,
  packageName: string,
  credits: number,
): string {
  const firstName = firstNameOf(name);
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  return layout(`
    ${label("Receipt")}
    ${heading("Payment <em>confirmed.</em>")}
    ${paragraph(`${greeting} thanks for your purchase! Your credits have been added to your account and are ready to use.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${PRINT}" style="margin:0 0 28px;background-color:${PRINT};border-radius:12px;">
      <tr>
        <td style="padding:10px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${receiptRow("Pack", escapeHtml(packageName), false)}
            ${receiptRow("Credits added", `${credits} restorations`, true)}
          </table>
        </td>
      </tr>
    </table>
    ${paragraph("Your credits never expire, so use them whenever you're ready.")}
    ${button("Start restoring photos", `${SITE_URL}/restore`)}
  `);
}

export { buildWelcomeHtml, buildPurchaseHtml };
