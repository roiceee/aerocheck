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
      <div className="p-2">{children}</div>
      <Footer />
    </>
  );
}
