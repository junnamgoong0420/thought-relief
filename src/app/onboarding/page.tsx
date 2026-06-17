import { redirect } from "next/navigation";
import { createClient } from "~/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signup");

  const { data: prefs } = await supabase
    .from("user_preferences")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (prefs) redirect("/start");

  return <OnboardingForm userId={user.id} />;
}
