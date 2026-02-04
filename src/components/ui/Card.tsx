import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
}

const variantStyles = {
  default: "bg-[var(--color-bg-secondary)]",
  elevated: "bg-[var(--color-bg-primary)] shadow-[var(--shadow-soft)]",
  outlined: "bg-transparent border border-[var(--color-bg-secondary)]",
};

export function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <div
      className={`rounded-lg p-6 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}

export function CardTitle({
  children,
  className = "",
  as: Component = "h3",
}: CardTitleProps) {
  return (
    <Component
      className={`font-[family-name:var(--font-cormorant)] text-xl font-medium text-[var(--color-text-primary)] ${className}`}
    >
      {children}
    </Component>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`text-[var(--color-text-secondary)] ${className}`}>
      {children}
    </div>
  );
}
