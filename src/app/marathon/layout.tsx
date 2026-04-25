import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NYC Marathon 2026 Training",
  description:
    "Personalized 24-week NYC Marathon training plan with workout tracking, progress visualization, and calendar export.",
  openGraph: {
    title: "NYC Marathon 2026 Training | Timeless Practice",
    description:
      "Personalized 24-week NYC Marathon training plan with workout tracking, progress visualization, and calendar export.",
  },
};

export default function MarathonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
