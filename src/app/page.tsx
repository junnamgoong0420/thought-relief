import { redirect } from "next/navigation";
import { GlowOrb } from "~/components/glow-orb";
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
    <div className="min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <GlowOrb className="-left-1/4 -top-1/4 h-[750px] w-[750px] opacity-70 blur-[100px]" />
        <GlowOrb className="right-[-15%] top-[20%] h-[650px] w-[650px] opacity-60 blur-[100px]" />
        <GlowOrb className="bottom-[-20%] left-[10%] h-[600px] w-[600px] opacity-55 blur-[100px]" />
        <GlowOrb className="left-[30%] top-[15%] h-[380px] w-[380px] opacity-50 blur-[80px]" />
      </div>
      <Navbar />
      <LandingSections />
    </div>
  );
}
