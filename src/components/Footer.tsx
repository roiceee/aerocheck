export function Footer() {
  return (
    <footer className="flex items-center justify-center px-6 py-3 text-muted-foreground">
      <span className="text-sm">
        © {new Date().getFullYear()} Aerocheck. All rights reserved.
      </span>
    </footer>
  );
}
