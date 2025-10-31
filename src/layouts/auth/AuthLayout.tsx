import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { Card, Container, Page, Site } from 'tabler-react-ui';

export type ContainerBreakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AuthLayoutProps = PropsWithChildren<{
  logoUrl?: string;
  logoHref?: string;
  logoAlt?: string;
  afterCard?: ReactNode;
  containerBreakpoint?: ContainerBreakpoint;
  fluid?: boolean;
  cardClassName?: string;
  cardProps?: Partial<ComponentProps<typeof Card>> | null;
}>;

export function AuthLayout({
  logoUrl,
  logoHref = '/',
  logoAlt = 'Application logo',
  afterCard,
  children,
  containerBreakpoint,
  fluid,
  cardClassName,
  cardProps = {},
}: AuthLayoutProps) {
  const cardClasses = ['card-md', cardClassName].filter(Boolean).join(' ');

  return (
    <Page className="page page-center">
      <Page.Main>
        <Container size={"tight"} className="py-4" breakpoint={containerBreakpoint} fluid={fluid}>
          {logoUrl ? (
            <div className="text-center mb-4">
              <Site.Brand
                href={logoHref}
                src={logoUrl}
                alt={logoAlt}
                className="navbar-brand navbar-brand-autodark"
              />
            </div>
          ) : null}

          {cardProps === null ? (
            children
          ) : (
            <Card className={cardClasses} {...cardProps}>
              {children}
            </Card>
          )}

          {afterCard ? <div className="text-center text-secondary mt-3">{afterCard}</div> : null}
        </Container>
      </Page.Main>
    </Page>
  );
}


