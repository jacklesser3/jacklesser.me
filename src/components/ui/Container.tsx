import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "narrow" | "default" | "wide";
}

const sizeStyles = {
  narrow: "max-w-2xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

export function Container({
  children,
  className = "",
  size = "default",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto px-6 md:px-8 ${sizeStyles[size]} ${className}`}
    >
      {children}
    </div>
  );
}
