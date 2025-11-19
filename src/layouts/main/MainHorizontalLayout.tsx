import type { PropsWithChildren } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Nav, Site } from "tabler-react-ui";

import { SITE_CONFIG } from "@/shared/constants/site";
import { sidebarLinks, SITE_LINKS } from "./layoutConfig";
import { HeaderLayout } from "./HeaderLayout";


const horizontalNavItems = (
  <>
    {sidebarLinks.map((item) => (
      <Nav.Item key={item.key} link>
        {"to" in item ? (
          <Nav.Link
            as={RouterNavLink}
            to={item.to}
            end={item.to === "/"}
            className="nav-link"
          >
            <span className="d-flex align-items-center gap-2">
              <item.icon size={18} stroke={1.7} />
              <span>{item.label}</span>
            </span>
          </Nav.Link>
        ) : (
          <Nav.Link
            className="nav-link"
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
          >
            <span className="d-flex align-items-center gap-2">
              <item.icon size={18} stroke={1.7} />
              <span>{item.label}</span>
            </span>
          </Nav.Link>
        )}
      </Nav.Item>
    ))}

  </>
);

const rightColumnActions = (
  <div className="navbar-nav flex-row align-items-center gap-2">
    <a
      className="btn btn-outline-secondary d-none d-md-inline-flex"
      href={SITE_LINKS.docs}
      target="_blank"
      rel="noreferrer"
    >
      Documentation
    </a>
    <a className="btn btn-primary" href="/resume/add">
      New Item
    </a>
  </div>
);

export function MainHorizontalLayout({ children }: PropsWithChildren) {
  const year = new Date().getFullYear();

  return (
    <Site.Wrapper
      layout="top"
      navIsSide={false}
      stickyNav
      header={<HeaderLayout />}
      nav={
        <Site.Nav
          className="navbar navbar-expand-md navbar-light d-print-none"
          collapse

          alt={`${SITE_CONFIG.name} logo`}
          items={horizontalNavItems}
        //  rightColumnComponent={rightColumnActions}

        />
      }
      footerPlacement="outside"
      footer={
        <Site.Footer
          copyright={
            <span>
              Copyright {year} {SITE_CONFIG.company}
            </span>
          }
        />
      }
      contentContainer="xl"
    >
      {children}
    </Site.Wrapper>
  );
}
