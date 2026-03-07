/**
 * DerbySystem — router.js
 * Parses the hash-based URL context used by /event/ and /admin/ pages.
 *
 * URL pattern:  /event/index.html#/troop/42/1
 *               /admin/inspection.html#/pack/152/2
 *
 * Segments: {orgType}/{orgNumber}/{eventSeq}
 *   orgType  — "troop", "pack", or "other"
 *   orgNumber — e.g. "42" or "BSA-452" for type "other"
 *   eventSeq  — 1 or 2 (at most 2 events per org)
 *
 * Usage:
 *   const ctx = getEventContext();
 *   // ctx → { orgType, orgNumber, eventSeq } or null if URL is malformed
 */

function getEventContext() {
  const hash  = location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts.length < 3) return null;
  const [orgType, orgNumber, eventSeqStr] = parts;
  const validTypes = ["pack", "troop", "other"];
  if (!validTypes.includes(orgType)) return null;
  if (!orgNumber) return null;
  const eventSeq = parseInt(eventSeqStr, 10);
  if (eventSeq !== 1 && eventSeq !== 2) return null;
  return { orgType, orgNumber, eventSeq };
}

/**
 * Build a URL for an admin sub-page preserving the current event context.
 */
function buildAdminUrl(page, ctx) {
  ctx = ctx || getEventContext();
  if (!ctx) return null;
  return `/DerbySystem/admin/${page}.html#/${ctx.orgType}/${ctx.orgNumber}/${ctx.eventSeq}`;
}

function buildEventUrl(ctx) {
  ctx = ctx || getEventContext();
  if (!ctx) return null;
  return `/DerbySystem/event/index.html#/${ctx.orgType}/${ctx.orgNumber}/${ctx.eventSeq}`;
}

/**
 * die(msg) — show a full-screen error and stop execution.
 * Used when the URL is missing or event not found.
 */
function die(msg) {
  document.body.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:16px;
      background:#f0f2f5; font-family:system-ui,sans-serif; padding:24px;">
      <div style="font-size:3rem;">🏁</div>
      <h2 style="margin:0; color:#111;">${msg}</h2>
      <p style="margin:0; color:#6b7280; text-align:center; max-width:340px;">
        Check the link you were given and try again, or contact your race organiser.
      </p>
      <a href="/" style="color:#2563eb; font-size:0.9rem;">← DerbySystem home</a>
    </div>`;
  throw new Error(msg);
}

/**
 * die(msg) — show a full-screen error and stop execution.
 * Used when the URL is missing or event not found.
 */
function die(msg) {
  document.body.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:16px;
      background:#f0f2f5; font-family:system-ui,sans-serif; padding:24px;">
      <div style="font-size:3rem;">🏁</div>
      <h2 style="margin:0; color:#111;">${msg}</h2>
      <p style="margin:0; color:#6b7280; text-align:center; max-width:340px;">
        Check the link you were given and try again, or contact your race organiser.
      </p>
      <a href="/" style="color:#2563eb; font-size:0.9rem;">← DerbySystem home</a>
    </div>`;
  throw new Error(msg);
}
