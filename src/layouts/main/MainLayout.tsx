/**
 * Main layout component that wraps the application content with navigation and footer
 *
 * The layout includes a sidebar navigation, header, and footer using Tabler components.
 */
import { useState, type PropsWithChildren } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Avatar, Dropdown, Nav, Site } from "tabler-react-ui";
import {
  IconBooks,
  IconLock,
  IconMailOpened,
  IconSearch,
  IconSettings,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";


import { SITE_CONFIG } from "@/shared/constants/site";
import { HeaderLayout } from "./HeaderLayout";
import { ReactSvg } from "@/util/lib/ReactSvg";
import { DropdownNavLink } from "./components/DropdownNavLink";
import { useAuth } from "@/features/auth/hooks/useAuth";





const navItems = (
  <Nav>
    {/* sidebarLinks.map((item) => (
      <Nav.Item key={item.key} link>
        {"to" in item ? (
          <Nav.Link as={RouterNavLink} to={item.to} end={item.to === "/"}>
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
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
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
    )) */}
    <Dropdown
      isNavLink
      triggerContent={
        <span className="d-inline-flex align-items-center gap-2">
          <IconBooks size={18} />
          <span>Resumes</span>
        </span>
      }
      arrow
    >
      <Dropdown.Menu static>
        <DropdownNavLink to="/resume/add" icon={IconBooks}>
          My Resumes
        </DropdownNavLink>
        <DropdownNavLink to="/resume/search" icon={IconSearch}>
          Search
        </DropdownNavLink>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown
      isNavLink
      triggerContent={
        <span className="d-inline-flex align-items-center gap-2">
          <IconUserCircle size={18} />
          <span>Auth</span>
        </span>
      }
      arrow
    >
      <Dropdown.Menu static>
        <DropdownNavLink to="/auth/sign-in" icon={IconUserCircle}>
          Sign in
        </DropdownNavLink>
        <DropdownNavLink to="/auth/forgot-password" icon={IconMailOpened}>
          Forgot password
        </DropdownNavLink>
        <DropdownNavLink to="/auth/settings" icon={IconSettings}>
          Settings
        </DropdownNavLink>
        <DropdownNavLink to="/auth/lock-screen" icon={IconLock}>
          Lock screen
        </DropdownNavLink>
      </Dropdown.Menu>
    </Dropdown>
    <Nav.Item linkAs={RouterNavLink} to="/admin/users">

      <Nav.LinkTitle>
        <span className="d-flex align-items-center gap-2">
          <IconUsersGroup size={18} stroke={1.7} />
          <span>Admin</span>
        </span>
      </Nav.LinkTitle>

    </Nav.Item>

  </Nav>
);

export function MainLayout({ children }: PropsWithChildren) {
  const year = new Date().getFullYear();
  const [navCollapsed, setNavCollapsed] = useState(true);
  const { user } = useAuth();
  return (
    <Site.Wrapper
      defaultNavCollapsed
      navCollapsed={navCollapsed}                 // omit these two lines for uncontrolled mode
      onNavCollapsedChange={setNavCollapsed}
      header={<HeaderLayout fluid className="d-none d-lg-flex d-print-none" />}
      nav={
        <Site.Nav
          className="d-print-none"
          alt={`${SITE_CONFIG.name} logo`}
          items={navItems}
        />
      }
      navIsSide
      layout="sidebar"
      preset="sidebar"

      asideProps={{
        className: "d-print-none",
        theme: "dark",
        brand: (
          <div className="navbar-brand navbar-brand-autodark">
            <a href="." aria-label="Tabler">

              <ReactSvg src="../../assets/upa logo.svg" className="navbar-brand-image" height={70} />
            </a>
          </div>
        ),

        mobileHeaderSlot: (

          < Dropdown
            isNavLink
            triggerContent={
              <>
                <Avatar
                  size="sm"
                  imageURL="https://preview.tabler.io/static/avatars/000m.jpg"
                  className="me-2"
                />
                <div className="d-none d-xl-block text-start">
                  <div className="fw-medium">{user?.name}</div>
                  <div className="text-secondary small">{user?.email}</div>
                </div>
              </>
            }
            size="lg"
            columns
            columnCount={3}
            arrow
          >
            <Dropdown.Menu static className="dropdown-menu-end">
              <Dropdown.Item href="./profile.html">Profile</Dropdown.Item>
              <Dropdown.Item href="./settings.html">Settings</Dropdown.Item>
              <Dropdown.Item href="./sign-in.html">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )
      }}

      footerProps={
        {
          className: "d-print-none"
        }
      }

      footer={
        <Site.Footer
          copyright={
            <span>
              Copyright {year} {SITE_CONFIG.company}
            </span>
          }
        />
      }

    >

      {children}


    </Site.Wrapper>
  );
}
