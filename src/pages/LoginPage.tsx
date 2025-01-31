import { Button } from "@/components/ui/button";
import supabase from "@/supabase-client";
export default function LoginPage() {
  const handleLogin = async () => {
    supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="flex flex-col items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-24 h-24" />
        <h2 className="text-xl font-bold">Aerocheck</h2>
        <Button
          className="flex items-center gap-2"
          variant={"outline"}
          onClick={handleLogin}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </Button>
      </section>
    </main>
  );
}
