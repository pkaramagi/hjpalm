import { Button, Card, Text } from 'tabler-react-ui';


const placeholderCards = [
  { key: 'overview', height: '10rem' },
  { key: 'performance', height: '10rem' },
  { key: 'activity', height: '10rem' },
];

export function HomePage() {


  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Vertical layout</h2>
              <div className="text-muted mt-1">
                Kickstart modern UI with a scalable React foundation powered by Tabler components.
              </div>
            </div>
            <div className="col-auto">
              <div className="btn-list">
                <Button color="primary" >
                  Start a project
                </Button>
                <Button color="secondary" ghost>
                  Explore docs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-deck row-cards">
            <div className="col-lg-6">

            </div>
            <div className="col-lg-6">
              <Card>
                <Card.Body className="d-flex flex-column justify-content-center text-center text-muted">
                  <Text size="lg" className="mb-2">
                    Extend the dashboard
                  </Text>
                  <Text muted>
                    Drop in analytics, charts, and internal tools using Tabler&rsquo;s ready-made
                    components.
                  </Text>
                </Card.Body>
              </Card>
            </div>
            {placeholderCards.map((card) => (
              <div key={card.key} className="col-sm-6 col-lg-4">
                <Card>
                  <Card.Body style={{ height: card.height }} />
                </Card>
              </div>
            ))}
            <div className="col-12">
              <Card>
                <Card.Body className="py-4">
                  <Text size="lg" className="mb-2">
                    Build modular features
                  </Text>
                  <Text muted>
                    Feature folders keep state, components, and hooks close together so teams can
                    iterate quickly without sacrificing structure.
                  </Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
