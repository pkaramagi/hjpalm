
import type { ComponentType, ReactNode, SVGProps } from "react";

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface LoadSvgOptions {
  fallback?: ReactNode;
}

type SvgModule = {
  ReactComponent?: SvgComponent;
  default?: SvgComponent;
};

export async function loadSvg(
  path: string,
  options: LoadSvgOptions = {}
): Promise<SvgComponent> {
  try {
    const svgModule = (await import(/* @vite-ignore */ path)) as SvgModule;

    // svgr exports the SVG as a React component under 'ReactComponent' or default
    const LoadedSvg = svgModule.ReactComponent ?? svgModule.default;

    if (!LoadedSvg) {
      throw new Error('SVG module does not export a React component');
    }

    return LoadedSvg;
  } catch (error) {
    console.warn(`Failed to load SVG: ${path}`, error);
    if (options.fallback) {
      return () => <>{options.fallback}</>;
    }
    return () => <svg width="24" height="24"><rect fill="red" width="24" height="24" /></svg>;
  }
}
