import AppSheet from "./AppSheet";

export default function Navbar() {
  return (
    <nav className="flex items-center px-6 py-3 border-b ">
      <img src="/logo.png" alt="Aerocheck Logo" className="w-8 h-8 mr-2" />
      <span className="text-lg font-semibold text-gray-700">Aerocheck</span>
      <div className="flex justify-end w-full">
        <AppSheet />
      </div>
    </nav>
  );
}
