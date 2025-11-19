// src/components/DynamicSvg.tsx
import { type SVGProps, memo } from 'react';
import { useState, useEffect } from 'react';
import { loadSvg } from './loadSvg';

interface DynamicSvgProps extends SVGProps<SVGSVGElement> {
  src: string;
  fallback?: React.ReactNode;
}

export const ReactSvg = memo(({ src, fallback, ...props }: DynamicSvgProps) => {
  const [SvgComponent, setSvgComponent] = useState<React.ComponentType<SVGProps<SVGSVGElement>> | null>(null);

  useEffect(() => {
    let mounted = true;
    loadSvg(src, { fallback }).then((Comp) => {
      if (mounted) setSvgComponent(() => Comp);
    });
    return () => { mounted = false; };
  }, [src, fallback]);

  if (!SvgComponent) {
    return <>{fallback || <div className="w-6 h-6 bg-gray-200 animate-pulse" />}</>;
  }

  return <SvgComponent {...props} />;
});

ReactSvg.displayName = 'ReactSvg';