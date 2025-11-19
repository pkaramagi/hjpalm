import { useMemo, type ComponentProps } from "react";
import {
  Nav,
  NavItem,
  Dropdown,
  Avatar,
  Badge,
  Button,
  Card,
  List,
  Site,
} from "tabler-react-ui";
import {
  IconMoon,
  IconSun,
  IconBell,
  IconStar,
  IconStarFilled,
  IconHome,
  IconLanguage,
  IconUsersGroup,
  IconArrowRight,
} from "@tabler/icons-react";
import "tabler-react-ui/dist/style.css";

import { useAuth } from "@/features/auth/hooks/useAuth";

type HeaderLayoutProps = ComponentProps<typeof Site.Header>;

const DefaultHeaderContent = () => {
  const { logout, lock, user } = useAuth();
  const displayName = useMemo(() => user?.name ?? user?.email ?? "User account", [user?.email, user?.name]);
  const displaySubtitle = useMemo(() => user?.email ?? user?.username ?? "Signed in", [user?.email, user?.username]);
  const initials = useMemo(() => {
    const source = user?.name ?? user?.email ?? "";
    if (!source) {
      return "UP";
    }
    return source
      .trim()
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user?.email, user?.name]);

  return (
    <>
      <Nav.Bar className="navbar-transparent navbar-nav flex-row order-md-last d-print-none">
        {/* Brand */}

        {/* Right Actions */}
        <Nav className="ms-auto align-items-center">
          {/* Theme Switcher */}
          <NavItem className="d-none d-md-flex">
            <Button
              variant="ghost"
              size="sm"
              className="hide-theme-dark"
              title="Enable dark mode"
              onClick={() => (document.documentElement.dataset.bsTheme = "dark")}
            >
              <IconMoon size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hide-theme-light"
              title="Enable light mode"
              onClick={() => (document.documentElement.dataset.bsTheme = "light")}
            >
              <IconSun size={18} />
            </Button>
          </NavItem>

          {/* Notifications */}
          <Dropdown
            isNavLink
            autoClose="both"
            triggerContent={
              <>
                <IconBell size={20} />
                <Badge
                  color="red"
                  className="position-absolute top-0 start-100 translate-middle p-1"
                />
              </>
            }
            size="lg"
            columns
            columnCount={3}
            popperStatic
            arrow
          >
            <Dropdown.Menu static className="dropdown-menu-card dropdown-menu-end">
              <Card>
                <Card.Header>
                  <Card.Title>Notifications</Card.Title>
                </Card.Header>

                <List.Group className="list-group list-group-flush list-group-hoverable">
                  <List.GroupItem>
                    <div className="d-flex align-items-center">
                      <span className="status-dot status-dot-animated bg-red me-3" />
                      <div className="flex-fill text-truncate">
                        <a href="#" className="text-body d-block">
                          Example 1
                        </a>
                        <small className="text-secondary text-truncate d-block">
                          Change deprecated html tags to text decoration classes
                          (#29604)
                        </small>
                      </div>
                      <a href="#" className="ms-2">
                        <IconStar size={16} className="text-muted" />
                      </a>
                    </div>
                  </List.GroupItem>

                  <List.GroupItem>
                    <div className="d-flex align-items-center">
                      <span className="status-dot me-3" />
                      <div className="flex-fill text-truncate">
                        <a href="#" className="text-body d-block">
                          Example 2
                        </a>
                        <small className="text-secondary text-truncate d-block">
                          justify-content:between �+' space-between (#29734)
                        </small>
                      </div>
                      <a href="#" className="ms-2">
                        <IconStarFilled size={16} className="text-yellow" />
                      </a>
                    </div>
                  </List.GroupItem>
                </List.Group>

                <Card.Body>
                  <div className="row g-2">
                    <div className="col">
                      <Button block color="secondary" size="sm">
                        Archive all
                      </Button>
                    </div>
                    <div className="col">
                      <Button block color="secondary" size="sm">
                        Mark all as read
                      </Button>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="text-center">
                  <Button
                    color="primary"
                    href="./notifications.html"
                    className="btn btn-primary btn-sm btn-block"
                  >
                    {/* Download SVG icon from http://tabler.io/icons/icon/arrow-right */}

                    <IconArrowRight className="icon icon-2" />
                    Show all notifications
                  </Button>
                </Card.Footer>
              </Card>
            </Dropdown.Menu>
          </Dropdown>


          {/* Language Translation */}
          <Dropdown
            isNavLink
            triggerContent={
              <>
                <IconLanguage />
              </>
            }
            size="lg"
            columns
            columnCount={3}
            arrow
          >
            <Dropdown.Menu static className="dropdown-menu-end">
              <Dropdown.Item>한국어</Dropdown.Item>
              <Dropdown.Item href="./sign-in.html">English</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown
            isNavLink
          triggerContent={
            <>
              <Avatar size="sm" className="me-2">
                {initials}
              </Avatar>
              <div className="d-none d-xl-block text-start">
                <div className="fw-medium">{displayName}</div>
                <div className="text-secondary small">{displaySubtitle}</div>
              </div>
            </>
          }
            size="lg"
            columns
            columnCount={3}
            arrow
          >
            <Dropdown.Menu static className="dropdown-menu-end">
              <Dropdown.Item>Status</Dropdown.Item>
              <Dropdown.Item href="./profile.html">Profile</Dropdown.Item>
              <Dropdown.Item onClick={() => lock()}>Lock</Dropdown.Item>
              <Dropdown.ItemDivider />
              <Dropdown.Item href="./settings.html">Settings</Dropdown.Item>
              <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Nav.Bar>

      {/* Left Navigation */}
      <Nav.Bar className="navbar-transparent collapse navbar-collapse">
        <Nav className="me-auto">
          <NavItem linkProps={{ to: "/" }}>
            <IconHome size={18} className="me-1" /> Home
          </NavItem>
          <NavItem linkProps={{ to: "/admin/users" }}>
            <IconUsersGroup size={18} className="me-1" /> Admin
          </NavItem>

        </Nav>
      </Nav.Bar>
    </>
  );
};

export const HeaderLayout = ({ children, fluid, ...rest }: HeaderLayoutProps) => (
  <Site.Header fluid={fluid} hideMenuToggle {...rest}>
    {children ?? <DefaultHeaderContent />}
  </Site.Header>
);
