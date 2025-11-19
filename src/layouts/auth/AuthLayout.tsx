import { ReactSvg } from '@/util/lib/ReactSvg';
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { Card, Container, Page, Site, SiteBrand } from 'tabler-react-ui';

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
  const cardClasses = [cardClassName].filter(Boolean).join(' ');

  return (
    <Page className="page-center">

      <Container size={"tight"} className="py-4" breakpoint={containerBreakpoint} fluid={fluid}>
        {logoUrl ? (
          <div className="text-center mb-4">
            <SiteBrand
              svg={<ReactSvg src={logoUrl} />}
              href={logoHref}
              alt={logoAlt}
              className="navbar-brand navbar-brand-autodark auth-logo"
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

    </Page>
  );
}


