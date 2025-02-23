import { Button } from "@/components/ui/button";
import supabase from "@/supabase-client";
export default function Login() {
  const handleLogin = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SIGN_IN_REDIRECT_URL,
      },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center text-center">
      <section className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-28 h-28" />
        <h2 className="text-2xl font-bold">Aerocheck</h2>
        <p>Pre-flight Inspection Checklist Application</p>
        <Button
          className="flex items-center gap-4"
          onClick={handleLogin}
          variant={"outline"}
          size={"lg"}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-7 h-7 rounded-full"
          />
          <span className="text-lg">Continue with Google</span>
        </Button>
        <p className="text-sm text-muted-foreground fixed bottom-0 my-3">
          For internal use by Adventure Flight Education and Sports Inc., Davao
          City
        </p>
      </section>
    </main>
  );
}
