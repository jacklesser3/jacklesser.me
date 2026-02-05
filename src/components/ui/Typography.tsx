import { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: HeadingProps) {
  return (
    <h1
      className={`font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-medium text-[var(--color-text-primary)] leading-tight ${className}`}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: HeadingProps) {
  return (
    <h2
      className={`font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-medium text-[var(--color-text-primary)] leading-tight ${className}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: HeadingProps) {
  return (
    <h3
      className={`font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-medium text-[var(--color-text-primary)] leading-tight ${className}`}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className = "" }: HeadingProps) {
  return (
    <h4
      className={`font-[family-name:var(--font-cormorant)] text-xl md:text-2xl font-medium text-[var(--color-text-primary)] leading-snug ${className}`}
    >
      {children}
    </h4>
  );
}

interface TextProps {
  children: ReactNode;
  className?: string;
  variant?: "body" | "lead" | "small" | "muted";
}

const textVariants = {
  body: "text-base text-[var(--color-text-primary)]",
  lead: "text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed",
  small: "text-sm text-[var(--color-text-secondary)]",
  muted: "text-base text-[var(--color-text-muted)]",
};

export function Text({ children, className = "", variant = "body" }: TextProps) {
  return <p className={`${textVariants[variant]} ${className}`}>{children}</p>;
}

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({
  children,
  subtitle,
  className = "",
}: SectionTitleProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <H2>{children}</H2>
      {subtitle && (
        <Text variant="lead" className="mt-4">
          {subtitle}
        </Text>
      )}
    </div>
  );
}
