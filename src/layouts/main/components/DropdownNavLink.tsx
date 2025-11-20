import type { ComponentType, ReactNode } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

type DropdownNavLinkProps = {
  to: string;
  children: ReactNode;
  icon: ComponentType<{ size?: number | string; className?: string; }>;
};

/**
 * Reusable dropdown navigation link component
 */
export function DropdownNavLink({ to, children, icon: Icon }: DropdownNavLinkProps) {
  return (
    <RouterNavLink className="dropdown-item d-flex align-items-center gap-2" to={to}>
      <Icon size={16} />
      <span>{children}</span>
    </RouterNavLink>
  );
}
