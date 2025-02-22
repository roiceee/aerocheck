import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="p-2 max-w-[900px] mx-auto mt-4">{children}</div>
      <Footer />
    </>
  );
}
