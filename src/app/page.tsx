import { redirect } from "next/navigation";
import { LandingSections } from "~/components/landing-sections";
import { Navbar } from "~/components/navbar";
import { createClient } from "~/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    redirect(prefs ? "/start" : "/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LandingSections />
    </div>
  );
}
