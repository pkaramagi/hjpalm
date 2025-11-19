import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import { Card, Text } from "tabler-react-ui";

export const SECTION_ACCENT_COLOR = "#1d4ed8";
export const SECTION_BORDER_COLOR = "#c7d7ff";
export const SECTION_ICON_BACKGROUND = "#e6edff";
export const SECTION_CARD_BACKGROUND = "#f5f8ff";

type IconComponent = ComponentType<{ size?: number | string; stroke?: number | string; }>;

type ActionsPlacement = "header" | "footer";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: IconComponent;
  actionsPlacement?: ActionsPlacement;
}

export function SectionCard({
  title,
  description,
  actions,
  actionsPlacement = "header",
  icon: Icon,
  children,
}: SectionCardProps) {
  const renderActions =
    actions ? (
      <div className="d-flex gap-2 flex-wrap justify-content-end">{actions}</div>
    ) : null;

  return (
    <Card
      className="resume-section-card "
      style={{
        border: `1px solid ${SECTION_BORDER_COLOR}`,
        borderLeftWidth: "4px",
        backgroundColor: SECTION_CARD_BACKGROUND,
      }}
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
            <Card.Title className="mb-1">{title}</Card.Title>
            {description ? (
              <Text muted size="sm" className="mb-0">
                {description}
              </Text>
            ) : null}


          </div>
          {actions && actionsPlacement === "header" ? renderActions : null}
        </div>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
      {actions && actionsPlacement === "footer" ? (
        <Card.Footer className="bg-transparent border-0 pt-0">
          {renderActions}
        </Card.Footer>
      ) : null}
    </Card>
  );
}
