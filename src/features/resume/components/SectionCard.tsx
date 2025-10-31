import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { Card, Text } from "tabler-react-ui";

export const SECTION_ACCENT_COLOR = "#4263eb";
export const SECTION_BORDER_COLOR = "rgba(66, 99, 235, 0.28)";
export const SECTION_ICON_BACKGROUND = "rgba(66, 99, 235, 0.12)";

type IconComponent = ComponentType<{ size?: number | string; stroke?: number | string }>;

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: IconComponent;
  footer?: ReactNode;
}

export function SectionCard({ title, description, actions, icon: Icon, footer, children }: SectionCardProps) {
  return (
    <Card
      className="resume-section-card shadow-sm border-0"
      style={{ borderLeft: `4px solid ${SECTION_BORDER_COLOR}` }}
    >
      <Card.Header className="d-flex flex-column flex-md-row align-items-md-center gap-3 bg-transparent border-0 pb-0">
        <div className="d-flex align-items-center gap-3 w-100">
          {Icon ? (
            <span
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                backgroundColor: SECTION_ICON_BACKGROUND,
                color: SECTION_ACCENT_COLOR,
              }}
            >
              <Icon size={20} stroke={1.6} />
            </span>
          ) : null}
          <div className="flex-grow-1">
            <Card.Title className="h4 mb-1">{title}</Card.Title>
            {description ? (
              <Text muted size="sm" className="mb-0">
                {description}
              </Text>
            ) : null}
          </div>
          {actions ? <div className="d-flex gap-2 flex-wrap justify-content-end">{actions}</div> : null}
        </div>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
      {footer ? (
        <Card.Footer className="bg-transparent border-0 pt-0">{footer}</Card.Footer>
      ) : null}
    </Card>
  );
}
