import {
  Nav,
  NavItem,
  Dropdown,
  Avatar,
  Badge,
  Button,
  Card,
  List,
  Site

} from 'tabler-react-ui';
import {
  IconMoon,
  IconSun,
  IconBell,
  IconStar,
  IconStarFilled,
  IconApps,
  IconHome,
  IconCheckbox,
  IconSettings,
} from '@tabler/icons-react';
import 'tabler-react-ui/dist/style.css';

export const HeaderLayout = () => {
  return (
    <Site.Header fluid >
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
              onClick={() => (document.documentElement.dataset.bsTheme = 'dark')}
            >
              <IconMoon size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hide-theme-light"
              title="Enable light mode"
              onClick={() => (document.documentElement.dataset.bsTheme = 'light')}
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
                <Badge color="red" className="position-absolute top-0 start-100 translate-middle p-1" />
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

                <List.Group className='list-group list-group-flush list-group-hoverable'>
                  <List.GroupItem>
                    <div className="d-flex align-items-center">
                      <span className="status-dot status-dot-animated bg-red me-3" />
                      <div className="flex-fill text-truncate">
                        <a href="#" className="text-body d-block">
                          Example 1
                        </a>
                        <small className="text-secondary text-truncate d-block">
                          Change deprecated html tags to text decoration classes (#29604)
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
                          justify-content:between → space-between (#29734)
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
              </Card>
            </Dropdown.Menu>
          </Dropdown>

          {/* Apps Menu */}

          <Dropdown
            autoClose="both"
            isNavLink
            triggerContent={
              <>
                <IconApps size={20} />
              </>
            }
            size="lg"
            columns
            columnCount={3}
            arrow

          >
            <Dropdown.Menu static style={{ width: '380px' }} className='dropdown-menu-end'>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Card.Title>My Apps</Card.Title>
                  <Button variant="ghost" icon={<IconSettings size={18} />} />
                </Card.Header>

                <Card.Body className="p-2" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  <div className="row row-cols-3 g-2">
                    <Button variant="light" size="sm">
                      App 1
                    </Button>
                    <Button variant="light" size="sm">
                      App 2
                    </Button>
                    <Button variant="light" size="sm">
                      App 3
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown
            isNavLink
            triggerContent={
              <>
                <Avatar size="sm" src="https://preview.tabler.io/static/avatars/000m.jpg" className="me-2" />
                <div className="d-none d-xl-block text-start">
                  <div className="fw-medium">Paweł Kuna</div>
                  <div className="text-secondary small">UI Designer</div>
                </div>
              </>
            }
            size="lg"
            columns
            columnCount={3}
            arrow

          >
            <Dropdown.Menu static className='dropdown-menu-end'>
              <Dropdown.Item>Status</Dropdown.Item>
              <Dropdown.Item href="./profile.html">Profile</Dropdown.Item>
              <Dropdown.Item>Feedback</Dropdown.Item>
              <Dropdown.ItemDivider />
              <Dropdown.Item href="./settings.html">Settings</Dropdown.Item>
              <Dropdown.Item href="./sign-in.html">Logout</Dropdown.Item>
            </Dropdown.Menu>

          </Dropdown>




        </Nav>
      </Nav.Bar>
      {/* Left Navigation */}
      <Nav.Bar className='navbar-transparent collapse navbar-collapse'>
        <Nav className="me-auto">
          <NavItem linkProps={{ to: "/" }}>

            <IconHome size={18} className="me-1" /> Home

          </NavItem>
          <Dropdown

            isNavLink
            autoClose="both"
            popperStatic
            triggerContent={
              <>
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <IconCheckbox size={18} className="me-1" />
                </span>
                <span className="nav-link-title">Forms</span>
              </>
            }
            triggerProps={{
              href: "#",
              "data-bs-toggle": "dropdown",
              "data-bs-auto-close": "outside",
              role: "button",
              "aria-expanded": "false",
            }}
            itemsObject={[
              { href: "./form-elements.html", children: "Form elements" },
              {
                href: "./form-layout.html",
                children: (
                  <>
                    Form layouts
                    <span className="badge badge-sm bg-green-lt text-uppercase ms-auto">
                      New
                    </span>
                  </>
                ),
              },
            ]}
          />

        </Nav>
      </Nav.Bar >
    </Site.Header>
  );
};
