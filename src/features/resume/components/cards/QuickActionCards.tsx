import { Link } from "react-router-dom";
import { Badge, Button, Card, Grid, Text } from "tabler-react-ui";
import type { Icon } from "@tabler/icons-react";

export interface QuickAction {
  key: string;
  title: string;
  description: string;
  to: string;
  action: string;
  icon: Icon;
}

interface QuickActionCardsProps {
  actions: QuickAction[];
}

export function QuickActionCards({ actions }: QuickActionCardsProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick actions</Card.Title>
        <Text muted size="sm">
          Jump to the most common resume tools.
        </Text>
      </Card.Header>
      <Card.Body>
        <Grid.Row>
          {actions.map((card) => (
            <Grid.Col key={card.key} md={4}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="icon" aria-hidden="true">
                      <card.icon size={26} />
                    </div>
                    <Badge color="blue" variant="light">
                      Resume
                    </Badge>
                  </div>
                  <div>
                    <Text size="lg" className="mb-1 d-block">
                      {card.title}
                    </Text>
                    <Text muted>{card.description}</Text>
                  </div>
                  <div className="mt-auto">
                    <Link to={card.to} className="text-decoration-none">
                      <Button variant="light" color="primary">
                        {card.action}
                        <card.icon size={16} className="ms-1" />
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Grid.Col>
          ))}
        </Grid.Row>
      </Card.Body>
    </Card>
  );
}
