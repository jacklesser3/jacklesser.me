// Layout for week detail pages - handles static export requirements
export async function generateStaticParams() {
  // For static export - this enables client-side dynamic routes
  // Return empty array since weeks are user-specific
  return [];
}

export default function WeekLayout({ children }: { children: React.ReactNode }) {
  return children;
}
