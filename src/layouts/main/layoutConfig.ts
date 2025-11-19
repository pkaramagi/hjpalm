import type { ComponentType } from "react";
import {
  IconHome,
  IconIdBadge2,
  IconSearch,
  IconUsers,
  IconLogin,
  IconLockBolt,
  IconPasswordUser,
  IconSettings,
} from "@tabler/icons-react";

import { SITE_CONFIG } from "@/shared/constants/site";

export interface SiteLinks {
  docs: string;
  github: string;
  privacy: string;
  contact: string;
}

export type SidebarIcon = ComponentType<{
  size?: number;
  className?: string;
  stroke?: number;
}>;

export type SidebarLink =
  | { key: string; label: string; to: string; icon: SidebarIcon }
  | {
      key: string;
      label: string;
      href: string;
      external?: boolean;
      icon: SidebarIcon;
    };

export const sidebarLinks: SidebarLink[] = [
  { key: "home", label: "Home", to: "/", icon: IconHome },
  {
    key: "resume",
    label: "Resume Builder",
    to: "/resumes",
    icon: IconIdBadge2,
  },
  {
    key: "resume-search",
    label: "Resume Search",
    to: "/resume/search",
    icon: IconSearch,
  },
  {
    key: "admin-users",
    label: "Admin - Users",
    to: "/admin/users",
    icon: IconUsers,
  },
  { key: "sign-in", label: "Sign in", to: "/auth/sign-in", icon: IconLogin },
  {
    key: "forgot-password",
    label: "Forgot password",
    to: "/auth/forgot-password",
    icon: IconPasswordUser,
  },
  {
    key: "account-settings",
    label: "Account settings",
    to: "/auth/settings",
    icon: IconSettings,
  },
  {
    key: "lock-screen",
    label: "Lock screen",
    to: "/auth/lock-screen",
    icon: IconLockBolt,
  },
];

export const SITE_LINKS =
  (SITE_CONFIG as { links?: SiteLinks }).links ??
  ({
    docs: "#",
    github: "#",
    privacy: "#",
    contact: "#",
  } satisfies SiteLinks);
