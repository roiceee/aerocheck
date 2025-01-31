import { useEffect } from "react";
import "./App.css";
import supabase from "./supabase-client";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";

// import ReloadPrompt from "./components/reloadprompt/ReloadPrompt";
function App() {
  // useEffect(() => {
  //   const signin = async () => {
  //     const sup = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //     });
  //   };
  //   signin();
  // }, []);

  //check if user is logged in, if not, redirect to login page

  useEffect(() => {
    const checkUser = async () => {
      const userResponse = await supabase.auth.getUser();
      if (!userResponse.data.user) {
        window.location.href = "/login";
      }
    };
    checkUser();
  }, []);

  return (
    <>
      <Navbar />
      <main>{/* <ReloadPrompt /> */}</main>
      <Footer />
    </>
  );
}

export default App;
