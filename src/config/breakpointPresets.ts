export interface BreakpointConfig {
  id: string;
  name: string;
  description: string;
  breakpoints: { lg: number; md: number; sm: number };
  cols: { lg: number; md: number; sm: number };
  containerConfig?: {
    minWidth?: number;
    maxWidth?: number;
    adaptive?: boolean; // Whether to follow container width changes
  };
}

export const breakpointPresets: BreakpointConfig[] = [
  {
    id: 'default',
    name: 'Default (Bootstrap-like)',
    description: 'Classic responsive breakpoints, suitable for most scenarios',
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    description: 'Fully consistent with Tailwind CSS breakpoints',
    breakpoints: { lg: 1024, md: 768, sm: 640 },
    cols: { lg: 12, md: 8, sm: 4 },
  },
  {
    id: 'material',
    name: 'Material Design',
    description: 'Google Material Design recommended breakpoints',
    breakpoints: { lg: 1280, md: 960, sm: 600 },
    cols: { lg: 12, md: 8, sm: 4 },
  },
  {
    id: 'compact',
    name: 'Compact Mode',
    description: 'Compact mode, triggers mobile layout earlier',
    breakpoints: { lg: 1024, md: 768, sm: 480 },
    cols: { lg: 12, md: 8, sm: 4 },
  },
  {
    id: 'wide',
    name: 'Wide Screen',
    description: 'Wide screen optimized, suitable for large displays',
    breakpoints: { lg: 1440, md: 1200, sm: 768 },
    cols: { lg: 16, md: 12, sm: 6 },
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    description: 'Mobile-first, more aggressive responsive strategy',
    breakpoints: { lg: 992, md: 576, sm: 320 },
    cols: { lg: 12, md: 6, sm: 2 },
  },
  {
    id: 'experimental',
    name: 'Experimental (Test Config)',
    description:
      'Container width 1280-1680px, 12 columns fixed, content adapts to container width',
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
    containerConfig: {
      minWidth: 1280,
      maxWidth: 1680,
      adaptive: true,
    },
  },
];

export const getBreakpointPreset = (id: string): BreakpointConfig => {
  return (
    breakpointPresets.find((preset) => preset.id === id) || breakpointPresets[0]
  );
};
