/**
 * Main layout component that wraps the application content with navigation and footer
 * 
 * @component
 * @param {PropsWithChildren} props - React component props with children
 * @param {React.ReactNode} props.children - Child elements to render within the layout
 * 
 * @example
 * ```tsx
 * <MainLayout>
 *   <div>Page Content</div>
 * </MainLayout>
 * ```
 * 
 * @remarks
 * The layout includes:
 * - Side navigation with configurable links
 * - Company logo
 * - Footer with copyright and customizable links
 * - Responsive sidebar layout
 * 
 * Navigation links can be internal (using React Router) or external URLs.
 * Footer links and site configuration are pulled from SITE_CONFIG constant.
 * 
 * @returns {JSX.Element} Wrapped content with navigation and footer
 */
import type { ComponentType, PropsWithChildren } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav, Site } from "tabler-react-ui";
import {
  IconHome,
  IconIdBadge2,
  IconLogin,
  IconLockBolt,
  IconPasswordUser,
} from "@tabler/icons-react";

import logoUrl from "@/assets/upa logo.svg";
import { SITE_CONFIG } from "@/shared/constants/site";
import { HeaderLayout } from "./HeaderLayout";

interface SiteLinks {
  docs: string;
  github: string;
  privacy: string;
  contact: string;
}

type SidebarIcon = ComponentType<{ size?: number; className?: string; stroke?: number; }>;

type SidebarLink =
  | { key: string; label: string; to: string; icon: SidebarIcon; }
  | { key: string; label: string; href: string; external?: boolean; icon: SidebarIcon; };

const sidebarLinks: SidebarLink[] = [
  { key: "home", label: "Home", to: "/", icon: IconHome },
  { key: "resume", label: "Resume Builder", to: "/resume/profile", icon: IconIdBadge2 },
  { key: "sign-in", label: "Sign in", to: "/auth/sign-in", icon: IconLogin },
  {
    key: "forgot-password",
    label: "Forgot password",
    to: "/auth/forgot-password",
    icon: IconPasswordUser,
  },
  { key: "lock-screen", label: "Lock screen", to: "/auth/lock-screen", icon: IconLockBolt },
];

const SITE_LINKS = (SITE_CONFIG as { links?: SiteLinks; }).links ?? {
  docs: "#",
  github: "#",
  privacy: "#",
  contact: "#",
};

const footerLinks = [
  <a key="docs" href={SITE_LINKS.docs} target="_blank" rel="noreferrer">
    Product docs
  </a>,
  <a key="github" href={SITE_LINKS.github} target="_blank" rel="noreferrer">
    GitHub
  </a>,
  <a key="privacy" href={SITE_LINKS.privacy} target="_blank" rel="noreferrer">
    Privacy
  </a>,
  <a key="contact" href={SITE_LINKS.contact}>
    Contact
  </a>,
];

const navItems = (
  <Nav>
    {sidebarLinks.map((item) => (
      <Nav.Item key={item.key} link>
        {'to' in item ? (
          <Nav.Link as={RouterNavLink} to={item.to} end={item.to === '/'}>
            <Nav.LinkTitle>
              <span className="d-flex align-items-center gap-2">
                <item.icon size={18} stroke={1.7} />
                <span>{item.label}</span>
              </span>
            </Nav.LinkTitle>
          </Nav.Link>
        ) : (
          <Nav.Link
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
          >
            <Nav.LinkTitle>
              <span className="d-flex align-items-center gap-2">
                <item.icon size={18} stroke={1.7} />
                <span>{item.label}</span>
              </span>
            </Nav.LinkTitle>
          </Nav.Link>
        )}
      </Nav.Item>
    ))}
  </Nav>
);

export function MainLayout({ children }: PropsWithChildren) {
  const year = new Date().getFullYear();

  return (
    <Site.Wrapper
      header={<HeaderLayout />}
      nav={
        <Site.Nav
          className="d-print-none"
          collapse
          logoURL={logoUrl}
          alt={`${SITE_CONFIG.name} logo`}
          items={navItems}
        />
      }
      navIsSide
      layout="sidebar"
      preset="sidebar"

      asideProps={{
        className: 'd-print-none',
        theme: 'dark', brand: <>
          <div className="navbar-brand navbar-brand-autodark">
            <a href="." aria-label="Tabler">
              <img src={logoUrl} height={70} alt="Tabler" className='navbar-brand-image' />
            </a>
          </div>
        </>
      }}
      footerPlacement="outside"

      footer={
        <Site.Footer

          copyright={<span>Copyright {year} {SITE_CONFIG.company}</span>}
        />
      }

      contentContainer="xl"
    >
      {children}
    </Site.Wrapper>
  );
}
