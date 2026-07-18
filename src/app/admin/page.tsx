import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "~/lib/constants";
import { createAdminClient } from "~/lib/supabase/admin";
import { createClient } from "~/lib/supabase/server";

const SUPPORT_LABELS: Record<string, string> = {
  practical: "Practical",
  emotional: "Emotional",
  balanced: "Balanced",
};

const TONE_LABELS: Record<string, string> = {
  gentle: "Gentle",
  balanced: "Balanced",
  direct: "Direct",
};

const EMPTY = "N/A";

type UserPrefs = {
  user_id: string;
  support_style: string;
  response_tone: string;
};

async function listAllUsers(admin: ReturnType<typeof createAdminClient>) {
  const perPage = 1000;
  let page = 1;
  const all: User[] = [];
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (error) throw error;
    all.push(...data.users);
    if (data.users.length < perPage) break;
    page++;
  }
  return all;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email !== ADMIN_EMAIL) redirect("/");

  let users: User[] = [];
  let setupError = false;
  let prefsMap = new Map<string, UserPrefs>();

  try {
    const admin = createAdminClient();
    const [allUsers, prefsResult] = await Promise.all([
      listAllUsers(admin),
      admin
        .from("user_preferences")
        .select("user_id, support_style, response_tone"),
    ]);
    users = allUsers;
    const prefsData = (prefsResult.data ?? []) as UserPrefs[];
    prefsMap = new Map(prefsData.map((p) => [p.user_id, p]));
  } catch {
    setupError = true;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-5">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href="/start"
            className="font-display text-lg font-bold text-foreground transition-opacity hover:opacity-70"
          >
            Thought<span className="text-primary">Relief</span>
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-1 text-2xl font-bold text-foreground">Admin</h1>
        {setupError ? (
          <div className="rounded-xl border border-border bg-card px-6 py-8 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              Service role key not configured.
            </p>
            <p className="mt-1">
              Add{" "}
              <code className="rounded bg-border/50 px-1 py-0.5 font-mono text-xs">
                SUPABASE_SERVICE_ROLE_KEY
              </code>{" "}
              to{" "}
              <code className="rounded bg-border/50 px-1 py-0.5 font-mono text-xs">
                .env.local
              </code>{" "}
              and restart the dev server.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex gap-6">
              <div className="rounded-xl border border-border bg-card px-6 py-4">
                <p className="text-2xl font-bold text-foreground">
                  {users.length}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  registered user{users.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-card">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Provider
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Support
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Tone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const provider =
                      u.app_metadata?.provider ??
                      u.identities?.[0]?.provider ??
                      EMPTY;
                    const prefs = prefsMap.get(u.id);
                    const supportLabel = prefs
                      ? (SUPPORT_LABELS[prefs.support_style] ??
                        prefs.support_style)
                      : EMPTY;
                    const toneLabel = prefs
                      ? (TONE_LABELS[prefs.response_tone] ??
                        prefs.response_tone)
                      : EMPTY;
                    const rowClass =
                      i % 2 === 0
                        ? "border-b border-border/50"
                        : "border-b border-border/50 bg-card/50";

                    return (
                      <tr key={u.id} className={rowClass}>
                        <td className="px-4 py-3 text-foreground">
                          {u.email ?? EMPTY}
                          {u.email === ADMIN_EMAIL && (
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              admin
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">
                          {provider}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {supportLabel}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {toneLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
