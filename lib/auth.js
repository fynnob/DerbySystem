/**
 * DerbySystem — auth.js
 * Scoutmaster authentication helpers using Supabase email OTP (6-digit code).
 * Import on any page that needs to know the current user.
 */

/** Get the current session (null if not signed in) */
async function getSession() {
  const { data: { session } } = await sb.auth.getSession();
  return session;
}

/** Require sign-in; redirect to auth.html if not */
async function requireSession() {
  const session = await getSession();
  if (!session) {
    location.href = `/DerbySystem/auth?next=${encodeURIComponent(location.href)}`;
    throw new Error("unauthenticated");
  }
  return session;
}

/**
 * Send a 6-digit OTP code to the given email.
 * Returns { error } — null error means email was sent.
 */
async function sendOtp(email) {
  try {
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    return { error: error ?? null };
  } catch (err) {
    return { error: { message: err.message || "Unknown error" } };
  }
}

/**
 * Verify the 6-digit code the user typed.
 * Returns { session, error }.
 */
async function verifyCode(email, token) {
  try {
    const { data, error } = await sb.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    return { session: data?.session ?? null, error: error ?? null };
  } catch (err) {
    return { session: null, error: { message: err.message || "Unknown error" } };
  }
}

/** Sign out and go to home */
async function signOut() {
  await sb.auth.signOut();
  location.href = "/DerbySystem/";
}

/** Return the scoutmaster's orgs list */
async function getMyOrgs(session) {
  const { data, error } = await sb
    .from("orgs")
    .select("*")
    .eq("owner_id", session.user.id)
    .order("created_at");
  return { data: data ?? [], error };
}

/** Return all events for an org */
async function getOrgEvents(orgId) {
  const { data, error } = await sb
    .from("events")
    .select("*")
    .eq("org_id", orgId)
    .order("event_date", { ascending: false });
  return { data: data ?? [], error };
}
