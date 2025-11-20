import { useMemo } from "react";
import { Dropdown, Avatar } from "tabler-react-ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getInitials } from "@/shared/utils/formatters";

/**
 * User menu dropdown component
 */
export function UserMenuDropdown() {
  const { logout, lock, user } = useAuth();

  const displayName = useMemo(
    () => user?.name ?? user?.email ?? "User account",
    [user?.email, user?.name]
  );

  const displaySubtitle = useMemo(
    () => user?.email ?? user?.username ?? "Signed in",
    [user?.email, user?.username]
  );

  const initials = useMemo(() => {
    const source = user?.name ?? user?.email ?? "";
    return getInitials(source);
  }, [user?.email, user?.name]);

  return (
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
  );
}
