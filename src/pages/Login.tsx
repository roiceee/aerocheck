import { Button } from "@/components/ui/button";
import supabase from "@/supabase-client";

export default function Login() {
  const handleLogin = async () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SIGN_IN_REDIRECT_URL,
        queryParams: {
          prompt: "select_account"
        }
      },
    });
  };

  return (
    <main className="flex justify-center text-center lg:min-h-screen">
      <section className="flex flex-col lg:flex-row items-center justify-center w-full bg-white">
        {/* Background Image */}
        <div
          className="w-full lg:w-1/2 h-[45vh] lg:h-[60vh] bg-cover bg-center relative lg:rounded-lg"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-10" />
        </div>

        {/* Login Content */}
        <div className="flex flex-col items-center gap-4 p-6 lg:w-1/3  relative">
          <img src="/logo.png" alt="Logo" className="w-28 h-28" />
          <h2 className="text-2xl font-bold">Aerocheck</h2>
          <p>Pre-flight Inspection Checklist Application</p>
          <Button
            className="flex items-center gap-4"
            onClick={handleLogin}
          variant={"secondary"}
            size={"lg"}
          >
            <img
              src="/google-logo.png"
              alt="Google Logo"
              className="w-7 rounded-full"
            />
            <span className="text-lg">Continue with Google</span>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            For internal use by Adventure Flight Education and Sports Inc.,
            Davao City
          </p>
        </div>
      </section>
    </main>
  );
}
